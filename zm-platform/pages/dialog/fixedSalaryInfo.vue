<template>
  <div class="fixedSalary">
    <el-form ref="form" :model="form" label-width="150px" label-position='left'>
  <el-form-item label="工作性质">
    <span>{{['全职','校招全职'][form.timeType-1] || ''}}</span>
  </el-form-item>
  <el-form-item label="老师类型">
    <span>{{['普通老师','测评师','专职','储备测评师','专职测评师','SVIP老师','专职助教','校招专职助教','本地化全职', '班课(废弃)','本地化专职', '普通老师(新)'][form.teaType]||""}}</span>
  </el-form-item>
  <el-form-item label="教师资格证">
     <span :class="form.certificateType==2 || form.certificateType==5 || form.certificateType==6 ? 'red-span' : ''">
      {{form.certificateName || ''}}
    </span>
  </el-form-item>
  <el-form-item label="年级偏好&第一擅长科目">
     <span :class="form.grade=='高中' ? 'red-span' : ''">{{`${form.grade || '--'}`}}</span>&<span>{{`${form.subject || '--'}`}}</span>
  </el-form-item>
  <el-form-item label="院校">
    {{form.school || ''}}
  </el-form-item>
  <el-form-item label="学历&院校属性">
    <span :class="['博士','硕士','研究生'].includes(form.teaEdu) ? 'red-span' : ''">
      {{`${form.teaEdu || ''}`}}</span>&
    <span :class="{'red-span':form.collageLevel=='985'}" v-if="form.collageLevel">{{form.collageLevel||'--'}}</span>
  </el-form-item>
  <el-form-item label="学习形式">
    <span>{{form.isFullTimeStr}}</span>
  </el-form-item>
  <el-form-item label="职位类型">
    <span v-if="(form.fixedSalaryState==2 || !headleState) && (fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState!=0)"
          class="f-weight">{{positionTypeOption[form.positionType ? Number(form.positionType)-1 : 1].label}}</span>
          <el-select v-else class="f-weight"
            v-model="fixedSalaryEditDto.positionType"
            placeholder="请选择职位类型"
          >
            <el-option
            class="f-weight"
              v-for="(item,index) in positionTypeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
  </el-form-item>
  <el-form-item label="讲师等级">
    <span v-if="(form.fixedSalaryState==2 || !headleState) && (fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState!=0)" class="f-weight">{{ratingName}}</span>
          <el-select v-else class="f-weight"
            v-model="fixedSalaryEditDto.rating"
            placeholder="请选择老师等级"
           @change="handleTeaLevel"
          >
            <el-option
            class="f-weight"
              v-for="(item,index) in trainLevelOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
  </el-form-item>
  <el-form-item label="基本薪资">

          <span class="f-weight" v-if="(form.fixedSalaryState==2 || !headleState) && (fixedSalaryInfo&& fixedSalaryInfo.fixedSalaryState!=0)">{{monthName || form.monthSalary}}</span>
          <el-select v-else
            v-model="fixedSalaryEditDto.monthSalary"
            placeholder="请选择基本薪资"
            class="f-weight"
            disabled
          >
            <el-option
              v-for="(item,index) in salaryListOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
  </el-form-item>
  <el-form-item label="定薪状态">
     <template>
          {{['未定薪','定薪待审核','已定薪'][form.fixedSalaryState]}}
        </template>
  </el-form-item>
</el-form>
    <div
      v-if="fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState==2"
      class="red-span"
    >注：已定薪即老师薪资已审核通过，不可随意变更，如果确实需要调整，可在批量审核薪资列表页，查找到该老师，进行变更</div>
    <div
      style="margin-top: 100px;"
      class="buttonGroup"
    >
      <el-button @click="handleCancel">{{ fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState==2 ? '关闭' : '取消'}}</el-button>
      <el-button
        type="primary"
        v-if="fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState==0"
        @click="saveFixedSalaryInfo"
      >确定定薪</el-button>
      <el-button
        type="primary"
        v-if="headleState && (fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState!=2)"
        @click="saveFixedSalaryInfo"
      >提交修改</el-button>
      <el-button
        type="primary"
        v-if="!headleState && hiddleStatus && (fixedSalaryInfo && fixedSalaryInfo.fixedSalaryState!=0)"
        @click="handleStatus"
      >修改薪资</el-button>

    </div>
    <el-dialog
      title="岗位匹配结果"
      v-model="showResultDialog"
      :modal='false'
      width="30%"
      class="resultDialog"
      >
      <div style="background:#ffffff">
        <h3>提示：老师当前岗位和基础信息不匹配，无法定薪，有以下处理方案</h3>
        <br>

          <el-radio v-model="resultObj.postCode" label="again">修改老师信息，重新定薪</el-radio>
          <p style="margin:20px 0" v-if='postList&&postList.length>0'>使用系统推荐岗位</p>
          <div  :key='index'  v-for='(i,index) in postList'>
            <el-radio v-model="resultObj.postCode"  :label="i.postCode" >
              系统推荐岗位：{{i.postName}}
            </el-radio>
          </div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="showResultDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmResult()">确 定</el-button>
        </span>
      </div>

    </el-dialog>
    <!--loading 效果 -->
    <div>
      <loading-com ref="loadingComRef"></loading-com>
    </div>
  </div>
</template>

<script>
import getTeaLevel from '../../api/select/getTeaLevel';
import {getTeaLevelWithSalary} from '../../api/select/teaInfoCard';
import basicInfo from '../../api/select/basicInfo';
import getTeaCerListService from '../../api/select/getTeaCerListService';
import fetch from '../../../src/utils/fetch';
import LoadingCom from '../ui/loading-com.vue'; // loading效果
import commonCascade from '../../api/select/commonCascade';


export default {
  data() {
    return {

      radio2:'',
      showResultDialog:false,
      postList:[],
      form:{},
      fixedSalaryInfo: {},
      salaryStateOption: ['未定薪', '定薪待审核', '已定薪'],
      positionTypeOption: [{
        label: '坐班',
        value: 1
      },{
        label: '非坐班',
        value: 2,
      }],
      trainLevelData: [],
      LevelandsalaryData:[],
      trainLevelOption: [], // 教师等级
      salaryListOption: [], //薪资option
      teaCerOptions: [], // 教师资格证option
      teaId: '',
      fixedSalaryEditDto: {
        rating: '',
        monthSalary: '',
        periodState: this.periodState,
        positionType: 2,
      },
      headleState: false,
      hiddleStatus: false,  // 体验状态
      ratingName: '',
      monthName: '',
      resultObj:{
        postCode:'',
        postVersion:''
      },
      val:''
    };

  },
  props: ['currentID', 'periodState', 'cipherTId'],
  components:{
    LoadingCom
  },
  methods: {
    confirmResult(){
      if(this.resultObj.postCode=='again'){
        this.showResultDialog=false;
        this.$emit('openBasicMessageComp')
      }else{
        this.resultObj.postVersion=this.postList.filter(i=>{
          return i.postCode==this.resultObj.postCode
        })[0].postVersion
        fetch({
          url: `/api/teacherPost/changePost`,
          method: 'get',
          params: {
            teaId: this.currentID,
            postCode:this.resultObj.postCode,
            postVersion:this.resultObj.postVersion
          }
        }).then((res)=>{
          this.showResultDialog=false;
          this.handleStatus();
          this.$emit('refreshFixedSalary')
        })
      }

    },
    handleTeaLevel(val){
      const data = this.LevelandsalaryData.find(item => item.value === val)
      if(data) {
         this.fixedSalaryEditDto.monthSalary=data.extendValue; // 改变基本薪资
      }
    },
    handleTeaSalary(val){
      const data = this.LevelandsalaryData.find(item => item.extendValue === val)
      if(data) {
        this.fixedSalaryEditDto.rating=data.value; // 基本薪资 - 改变讲师等级
      }
    },
    // 获取定薪
    async TabHandleClick(val,teaId) {

      this.teaId = teaId.teaId;
      this.monthName='';
      this.ratingName ='';
      this.fixedSalaryEditDto.rating='';
      this.fixedSalaryEditDto.monthSalary='';
      this.fixedSalaryInfo = [];
      this.headleState = false;
      this.hiddleStatus = false;
      if (val === 'second') {
        if (this.$refs.loadingComRef) {
          this.$refs.loadingComRef.progressState = true;
        }
        setTimeout( ()=> {
          if (this.$refs.loadingComRef) {
            this.$refs.loadingComRef.progressState = false;
          }
        }, 2000);
        let user = await basicInfo({ teaId: this.cipherTId });
        if (!user) return;
        let parm = {
          bu: user.teaBu,
          TEACHER_ORIGIN: user.timeType,
          teaId: this.currentID
        };
        let levelData = [];
        let salaryData= [];
        let _data = await getTeaLevelWithSalary(parm);
        if (_data && _data.children){
          this.LevelandsalaryData=_data.children;
          for (let i = 0; i < _data.children.length; i++) {
            levelData.push({
              value: _data.children[i].value + '',
              label: _data.children[i].label,
            });
            salaryData.push({
              value: _data.children[i].extendValue,
              label: _data.children[i].extendLabel,
              levelValue: _data.children[i].value,
            })
          }
          this.trainLevelOption = levelData;
          this.salaryListOption = salaryData;
        }

        let data = [
          {
            dictCode: 'ZM_BU',
            optionValue: user.teaBu,
            bizCategory: 'common',
          },
          {
            dictCode: 'TEACHER_ORIGIN',
            optionValue: user.timeType,
            bizCategory: 'common',
          },
          {
            dictCode: 'TEACHER_SALARY',
            strategy: 0,
          },
        ];
        // let sala = await this.$Fetch({
        //   url: `/api/cascade/dict/service`,
        //   method: 'post',
        //   data,
        // });
        // if (sala.code === '0') this.salaryListOption = sala.data.children;
        let teaCer = await getTeaCerListService([
          {
            dictCode: 'TEACHER_CERTIFICATE',
          },
        ]);
        if (!teaCer) return;
        let styleClassOption = await commonCascade([{"dictCode":"IS_FULL_TIME"}]);
        let res = await fetch({
          url: `/api/fixSalary/getFixedSalaryInfo`,
          method: 'post',
          data: {
            teaIds: [this.currentID],
          },
        });
        if (this.$refs.loadingComRef) {
          this.$refs.loadingComRef.progressState = false;
        }
        if (res.code === '0') {
          let arr = teaCer.children.filter(
            r => r.value == res.data[0].certificateType
          );
          if (arr.length) res.data[0].certificateName = arr[0].label;
          res.data[0].isFullTimeStr = '';
          if(res.data[0].isFullTime) {
            let fullTime = styleClassOption.children.filter(r=>r.value==res.data[0].isFullTime)
            if(fullTime.length) {
              res.data[0].isFullTimeStr = fullTime[0].label;
            } else {
              res.data[0].isFullTimeStr = '';
            }
          } else {
            res.data[0].isFullTimeStr = '';
          }
          this.fixedSalaryInfo = res.data[0];
          this.form=this.fixedSalaryInfo
          // this.fixedSalaryEditDto.rating = this.fixedSalaryInfo.rating.toString();
          // this.fixedSalaryEditDto.monthSalary = this.fixedSalaryInfo.monthSalary.toString();

          let salar = this.trainLevelOption.filter(r=>r.value == this.fixedSalaryInfo.rating);
          if(salar.length) this.ratingName = salar[0].label;

          let month = this.salaryListOption.filter(r=>{

            return (r.value==this.fixedSalaryInfo.monthSalary)
            });

          if(month.length) this.monthName = month[0].label;
          this.fixedSalaryEditDto.positionType = this.fixedSalaryInfo.positionType || 2;
          this.hiddleStatus = true;
        }
      }
      this.saveStatus();
    },
    // 保存定薪
    async saveFixedSalaryInfo() {
      if(this.fixedSalaryEditDto.monthSalary == 0 || !this.fixedSalaryEditDto.monthSalary) return this.$Message({
        type: 'warning',
        message: '请选择基本薪资',
      });

      let validateResult=await this.handleValidateStation()
      if(validateResult){
        if (validateResult.code == '0') {

              if(validateResult.data.matched==true){

              }else{
                  this.showResultDialog=true
                  this.postList=validateResult.data.matchedPosts

                  return false
              }
          }
      }

      this.fixedSalaryEditDto.teaIds = [Number(this.teaId)];
      let res = await fetch({
        url: `/api/fixSalary/saveFixedSalaryInfo`,
        method: 'post',
        data: this.fixedSalaryEditDto,
      });
      if (res.code === '0') {
        this.$emit('cancel');
        return this.$Message({
          type: 'success',
          message: '修改成功',
        });
      }
      this.$Message({
        type: 'warning',
        message: res.message,
      });

    },
    handleCancel() {
      this.$emit('cancel');
    },
    saveStatus() {
      if(!this.fixedSalaryInfo) return
      if(this.fixedSalaryInfo.fixedSalaryState==2) this.headleState = true;
    },
    handleStatus() {
      this.fixedSalaryEditDto.monthSalary='';
      this.fixedSalaryEditDto.rating='';
      this.headleState = true;
    },
    //校验岗位
    handleValidateStation(){
     return fetch({
        url: `/api/teacherPost/validate`,
        method: 'get',
        params: {
          teaId:this.currentID
        },
      })
    }
  },
};
</script>

<style lang="less">
.resultDialog{
  .el-dialog__header{
    border-bottom:1px solid #ddd}
  .el-dialog__body {
    border-top:1px solid #ddd;
    background: #ffffff;
    .dialog-footer{
      float: right;
      margin-bottom: 20px;
    }
}
}
.fixedSalary{
  .el-form-item{
    margin-bottom: 3px;
  }
}
.buttonGroup {
  text-align: right;
  margin: 40px 0;
}
.red-span {
  color: #ff0000;
}
.f-weight  {
  // // font-weight: bold !important;
  // .el-input__inner {
  //   font-weight: bold !important;
  // }
}
</style>
