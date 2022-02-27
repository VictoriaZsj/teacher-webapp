<!--批量审核页-->
<template>
  <div class="full-time-container">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="讲师">
        <el-input v-model="search_data.keyWord" placeholder="支持姓名/手机号">
        </el-input>
      </el-form-item>
      <el-form-item label="工作性质">
        <el-select v-model="search_data.timeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师类型">
        <el-select filterable v-model="search_data.teaType" placeholder="请选择老师类型">
          <el-option v-for="item in teaTypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

       <el-form-item label="所属BU">
          <el-select v-model="search_data.teaBu" @change='handleBuChange()' placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="1对1" value="1"></el-option>
              <el-option label="少儿" value="2"></el-option>
              <el-option label="陪练" value="3"></el-option>
              <el-option label="优课" value="5"></el-option>
          </el-select>
      </el-form-item>
       <el-form-item label="讲师等级">
              <el-select  v-model="search_data.rating" placeholder="请选择" @change="hhh()">
                <el-option v-for="(item,index) in levelData" :key="index" :label="item.label" :value="item.value">

                </el-option>
              </el-select>
       </el-form-item>
       <el-form-item label="基本薪资">
        <el-select v-model="search_data.salary" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in salaryList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好">
        <el-select v-model="search_data.grade" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in phaseList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第一擅长科目">
        <el-select v-model="search_data.subject" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in basesubList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="教资情况">
            <el-select v-model="search_data.certificateSituation" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in hasCertificateList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="教师资格证">
        <el-select v-model="search_data.certificateType" placeholder="请选择">
          <el-option v-for="item in teaCerOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历">
        <el-select v-model="search_data.teaEdu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="本科" value="本科"></el-option>
          <el-option label="硕士（研究生）" value="硕士（研究生）"></el-option>
          <el-option label="博士及以上" value="博士"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习形式">
        <el-select v-model="search_data.isFullTime" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in styleClassOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院校属性">
        <el-select v-model="search_data.collegeLevel" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="985" value="985"></el-option>
          <el-option label="211" value="211"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="定薪状态">
        <el-select v-model="search_data.fixedSalaryState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="定薪待审核" value="1"></el-option>
          <el-option label="已定薪" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训时间">
        <el-date-picker
          v-model="searchActDateArea"
          clearable
          :editable="false"
          type="daterange"
          range-separator="  -  "
          placeholder="请选择日期范围"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="chooseActDate">
        </el-date-picker>
      </el-form-item>

      <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
      </el-form>
      <div class="context-body">
        <div class="table-head">
          <el-button size="small" @click="batchCheck()" type="text" >批量审核</el-button>
        </div>
        <el-table :data="table_data"  style="width:100%" @selection-change="selectTable" >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="name" fixed="left" align="center" label="姓名" min-width="145">
            <template scope="scope" >
              <span>{{scope.row.name}}</span><br>
              <span class="f-12">{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="trainTime" align="center" label="培训时间" min-width="120">
          </el-table-column>
          <!--跟进人：如果登录人是招师专员，则不显示跟进人，如果登录的人是管理员，则显示该字段-->
          <el-table-column prop="followPerson" align="center" label="跟进人"  min-width="120" v-if="adminFlg">
          </el-table-column>
          <el-table-column prop="timeType" align="center" label="工作性质" >
            <template scope="scope" >
              {{scope.row.timeType | timeTypeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="subject" align="center" label="年级偏好&第一擅长科目" min-width="160">
            <template scope="scope" >
              <span :class="{'high-light': scope.row.grade && scope.row.grade === '高中'}">{{scope.row.grade}}</span>
              <span v-if="scope.row.grade || scope.row.subject ">&</span>
              <span>{{scope.row.subject}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isFullTimeStr" align="center" label="学习形式" min-width="140">
            <template scope="scope" >
              <span>{{scope.row.isFullTimeStr}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="certificateTypeVal" align="center" label="教师资格证" min-width="120">
            <template scope="scope" >
              <span :class="{'high-light': scope.row.certificateTypeVal &&
              (scope.row.certificateTypeVal === '持本学科证' ||
              scope.row.certificateTypeVal === '持本学科合格证' ||
              scope.row.certificateTypeVal === '已持本学科证' ||
              scope.row.certificateTypeVal === '持本学科考试合格证明')}">
              {{scope.row.certificateType| certificateTypeFilter}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="school" align="center" label="院校" >
          </el-table-column>
          <el-table-column prop="teaStateName" align="center" label="学历&院校属性" min-width="150">
            <template scope="scope">
              <span :class="{'high-light': scope.row.teaEdu && (scope.row.teaEdu === '硕士' || scope.row.teaEdu === '研究生' || scope.row.teaEdu === '博士')}"
              v-if="scope.row.teaEdu">{{scope.row.teaEdu}}</span>
              <span v-if="scope.row.collageLevel">&</span>
              <span :class="{'high-light':scope.row.collageLevel=='985'}" v-if="scope.row.collageLevel">{{scope.row.collageLevel}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ratingStr" align="center" fixed="right" label="讲师等级" >
          </el-table-column>
          <el-table-column prop="monthSalary" width="120" align="center" fixed="right" label="基本薪资" >
          </el-table-column>
          <el-table-column prop="fixedSalaryState" width="120" align="center" fixed="right" label="定薪状态" >
            <template scope="scope" >
              {{scope.row.fixedSalaryState | fixedSalaryStateFilter}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="130">
            <template scope="scope" >
              <el-button size="small" @click="showUpdataSalary(scope.row)"
              type="text" v-if="scope.row.fixedSalaryState == 2">变更薪资</el-button>
              <el-button size="small" @click="singleCheckSalary(scope.row)"
              type="text" v-if="scope.row.fixedSalaryState == 1">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
        </el-pagination>
      </div>

      <!--loading 效果-->
      <div>
        <loading-com ref="loadingComRef"></loading-com>
      </div>

      <!--变更薪资dialog start-->
      <el-dialog size="small" v-model="changeSalaryDialogVisible" title="变更薪资" :destroy-on-close="true">
        <el-form :inline="true" :model="changeSalaryData" class="search-form">
          <el-form-item label="讲师等级">
            <el-select v-model="changeSalaryData.rating" placeholder="请选择" >
              <el-option
                @click.native="handleTeaLevel(changeSalaryData.rating)"
                v-for="(item,index) in trainLevelData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基本薪资">
            <el-select v-model="changeSalaryData.monthSalary" placeholder="请选择"  disabled>
              <el-option v-for="(item,index) in salaryListData" :key="index" :label="item.label" :value="item.labelValue"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideChangeSalaryDialog()">取消</el-button>
          <el-button type="primary" @click="submitChangeSalaryDialog()">提交变更</el-button>
        </span>
      </el-dialog>
      <!--变更薪资dialog end-->

      <!--审核薪资dialog start-->
      <el-dialog size="small" v-model="checkSalaryDialogVisible" :title="checkSalaryTitle" :destroy-on-close="true">
        <el-table :data="checkSalaryList">
          <el-table-column prop="name" align="center" label="姓名" min-width="115">
            <template scope="scope" >
              <span>{{scope.row.name}}</span><br>
              <span class="f-12">{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subject" align="center" label="年级偏好&第一擅长科目" min-width="140">
            <template scope="scope" >
              <span :class="{'high-light': scope.row.grade && scope.row.grade === '高中'}">{{scope.row.grade}}</span>
              <span v-if="scope.row.grade || scope.row.subject ">&</span>
              <span>{{scope.row.subject}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isFullTimeStr" align="center" label="学习形式" min-width="140">
            <template scope="scope" >
              <span>{{scope.row.isFullTimeStr}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="certificateTypeVal" align="center" label="教师资格证" min-width="110">
            <template scope="scope" >
              <span :class="{'high-light': scope.row.certificateTypeVal &&
              (scope.row.certificateTypeVal === '持本学科证' ||
              scope.row.certificateTypeVal === '持本学科合格证' ||
              scope.row.certificateTypeVal === '已持本学科证' ||
              scope.row.certificateTypeVal === '持本学科考试合格证明')}">
              {{scope.row.certificateType| certificateTypeFilter}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="school" align="center" label="院校" >
          </el-table-column>
          <el-table-column prop="teaStateName" align="center" label="学历&院校属性" min-width="140">
            <template scope="scope">
              <span :class="{'high-light': scope.row.teaEdu && (scope.row.teaEdu === '硕士' || scope.row.teaEdu === '博士')}"
              v-if="scope.row.teaEdu">{{scope.row.teaEdu}}</span>
               <span v-if="scope.row.collageLevel">&</span>
               <span :class="{'high-light':scope.row.collageLevel=='985'}" v-if="scope.row.collageLevel">{{scope.row.collageLevel}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ratingStr" align="center" min-width="100" label="讲师等级">
          </el-table-column>
          <el-table-column prop="monthSalary" width="120" align="center" label="基本薪资" min-width="100">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideCheckSalaryDialog()">取消</el-button>
          <el-button type="primary" @click="submitCheckSalaryDialog()">{{checkSalaryBtnVal}}</el-button>
        </span>
      </el-dialog>
      <!--审核薪资dialog end-->
  </div>
</template>

<script>
import getTeaLevel from '../../api/select/getTeaLevel'; // 获取讲师等级
import {getTeaLevelWithSalary} from '../../api/select/teaInfoCard';
import getTeachersSalaryData from '../../api/action/getTeachersSalaryData'; // 面试管理，培训管理 - 查询审核薪资列表
import getCommissioner from '../../api/action/getCommissioner'; // 查询登录人是否为管理员
import saveFixedSalaryInfo from '../../api/action/saveFixedSalaryInfo'; // 面试管理 - 查询审核薪资列表
import checkFixedSalaryInfo from '../../api/action/checkFixedSalaryInfo'; // 审核薪资
import getPhase from '../../api/select/getPhase'; // 获取年级偏好
import getSubject from '../../api/select/getSubject'; // 获取第一擅长科目
import getTeaCerListService from '../../api/select/getTeaCerListService'; // 获取教师资格状态列表
import LoadingCom from '../ui/loading-com.vue'; // loading效果
import commonCascade from '../../api/select/commonCascade';
import teacherCertificateMixin from '../../../zm-platform/pages/userInfoItems/teacherCertificateMixin'
import fetch from "../../../src/utils/fetch";

export default {
    mixins: [teacherCertificateMixin],
    data() {
      return {
        LevelandsalaryData:[],
        levelData:[],
        trainLevelData:[],
        salaryListData:[],
        search_data:{
          certificateSituation:'',
          teaBu: '', // 所属bu
          timeType: '', // 工作性质
          keyWord: '', // 讲师名字手机号
          grade: '', // 年级偏好
          subject: '', // 第一擅长科目
          certificateType: '', // 教师资格证
          teaEdu: '', // 学历
          collegeLevel: '', // 院校属性
          salary: '', // 基本薪资
          fixedSalaryState: '1', // 定薪状态
          pageNo: 1,
          pageSize: 10,
          startTrainTime: '',
          endTrainTime: '',
          isFullTime: '',
          teaType:'',
          rating:''
        },
        table_data:[],
        searchActDateArea: [], // 培训时间
        phaseList: [], // 年级偏好list
        basesubList: [], // 第一擅长科目list
        salaryList:[], // 基本薪资list和变更薪资里的取值不一样
        table_data_total:0,
        teaCerOptions: [], // 教师资格状态list
        changeSalaryData: { // 变更薪资
          rating: '', // 讲师等级
          monthSalary: '', // 基本薪资
        },
        hasCertificateList:[],
        changeSalaryDialogVisible: false, // 变更薪资弹窗显示flg
        trainLevelOption: [], // 讲师等级list
        changeSalaryBackupData: {}, // 修改薪资对象backup
        checkSalaryTitle: '', // 审核薪资title
        checkSalaryDialogVisible: false, // 审核薪资弹窗显示flg
        checkSalaryList: [], // 审核薪资list
        checkSalaryBtnVal: '', // 薪资审核确认按钮内容
        selectData: [], // 监听已选中数据
        curPage: '', // 当前页面name
        adminFlg: false, // 登陆者是否是管理员
        allSelectData: [], // 所有选中数据
        styleClassOption: [], // 学习形式
        teaTypeOption:[]
      }
    },
    filters:{
      // 工作性质
      timeTypeFilter(val) {
        let timeTypeStr = '';
        switch (val) {
          case 1:
            timeTypeStr = '全职';
            break;
          case 2:
            timeTypeStr = '校招全职';
            break;
          default:
          }
        return timeTypeStr;
      },
      fixedSalaryStateFilter(val) {
        let salaryVal = '';
        switch (val) {
          case 0:
            salaryVal = '未定薪';
            break;
          case 1:
            salaryVal = '定薪待审核';
            break;
          case 2:
            salaryVal = '已定薪';
            break;
          default:
          }
        return salaryVal;
      }
    },
    methods: {
      initHasCertificate(){

        this.$Fetch({
          url: `/api/dict/getDictByGroupCode`,
          method: 'get',
          params:{"groupCode":"CERTIFICATE_SITUATION","bu":1},
        })
          .then(res => {
            res.data.forEach(i=>{
                this.hasCertificateList.push({
                  value:i.itemCode,
                  label:i.itemName
                })
            })

          })
      },
      hhh(val){
      },
      handleBuChange(){
        this.search_data.rating='';
        this.getLevelForList()
      },
      recursiveHandle(arr,data){
        for (let i = 0; i < arr.length; i++) {
          if(arr[i].children){
            this.recursiveHandle(arr[i].children,data)
          }else{
            if(arr[i].value!='ZM_AGENT'&&arr[i].value!='ZM_AI'){
              data.push({
                value: arr[i].value,
                label: arr[i].label,
              });
            }

            }
          }
        if(data.length){
          return [{label:'全部',value:''}].concat(data)
        }else {
          return data
        }
      },
      getLevelForList(){
        let parm =[
            {"dictCode":"ZM_BU","optionValue":this.search_data.teaBu,"bizCategory":"common"},
            {"dictCode":"TEACHER_LEVEL_PL","strategy":1}
        ];
        fetch({
          url:"/api/cascade/dict/service",
          method: 'post',
          data:parm,
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            let _data=[];
            if(data.children&&data.children.length){
              this.levelData=this.recursiveHandle(data.children,_data);
            }
          } else {
            this.$Message({
              message
            });
          }
        })
          .catch((err) => {
            if (err) {
              console.log(err);
            }
            this.$Message({
              err
            });
          });
      },
      handleTeaLevel(val){
        const data = this.LevelandsalaryData.find(item => item.value === val)
        if(data) {
          this.changeSalaryData.monthSalary=data.extendValue;
        }
      },
      handleTeaSalary(val){
        const data = this.LevelandsalaryData.find(item => item.value === val)
        if(data) {
          this.changeSalaryData.rating=data.value;
        }
      },
      getTeacherTypes() {
        this.teaTypeOption = [];
        commonCascade([{"dictCode":"TEACHER_TYPE"}]).then(data => {
          this.teaTypeOption =  [{label:'全部',value:""},...data.children];
        });
      },
      // 监听列表选中
      selectTable(val) {
        this.selectData = [];
        // 整理出定薪待审核的数据
        for(let i = 0; i < val.length; i++) {
          if (val[i].fixedSalaryState == 1) {
            this.selectData.push(val[i]);
          }
        }
        this.allSelectData = val;
      },
      // 批量审核
      batchCheck() {
        if (!this.allSelectData.length) {
          this.$Message({
            message:"至少选中一条数据，批量审核"
          });
          return;
        }
        let match = false;
        for(let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].fixedSalaryState == 1) {
            match = true; // 选中数据中至少有一条定薪待审核的数据
          }
        }
        if (!match) {
          this.$Message({
            message:"所选数据的定薪状态都不是【定薪待审核】，请重新选择"
          });
          return;
        }
        this.checkSalaryList = this.selectData;
        this.checkSalaryBtnVal = '批量确认';
        this.checkSalaryTitle = '批量确认薪资';
        this.checkSalaryDialogVisible = true;
      },
      //全量薪资等级接口
      allLevelAndSalary(){
        this.$Fetch({
          url: `/api/cascade/dict/service`,
          method: 'post',
          data:[{"dictCode":"TEACHER_LEVEL_PL"}],
        })
          .then(res => {
            let leveData =res.data.children;
            // 整理出讲师等级内容
            for(let i = 0; i < this.table_data.length; i++) {
              for(let m = 0; m < leveData.length; m++) {
                if (this.table_data[i].rating == leveData[m].value) {
                  this.$set(this.table_data[i],'ratingStr', leveData[m].label)
                }
              }
            }
          })
      },
      // 单个老师，审核薪资
      singleCheckSalary(row) {
        this.checkSalaryList = [row];
        this.checkSalaryBtnVal = '确认';
        this.checkSalaryTitle = '确认薪资';
        this.checkSalaryDialogVisible = true;
        this.gettrainLevel(row);
      },
      // 关闭审核薪资弹窗
      hideCheckSalaryDialog() {
        this.checkSalaryDialogVisible = false;
      },
      // 确认审核薪资提交
      submitCheckSalaryDialog() {
        let teaIds = [];
        for(let i = 0; i < this.checkSalaryList.length; i++) {
          teaIds.push(this.checkSalaryList[i].teaId);
        }
        checkFixedSalaryInfo({
          teaIds: teaIds
        }).then(data => {
          this.checkSalaryDialogVisible = false;
          if (!data) {
            this.$Message({
              type: 'success',
              message: this.checkSalaryList.length + '条数据审核成功'
            });
            this.search();
          }
        }).catch(message => {
          this.checkSalaryDialogVisible = false;
          this.$Message({
            message: message
          });
        });
      },
      // 变更薪资提交
      submitChangeSalaryDialog() {
        if (JSON.stringify(this.changeSalaryBackupData) === JSON.stringify(this.changeSalaryData)) {
          this.$Message({
            message:"您没有修改任何数据"
          });
          return;
        }
        saveFixedSalaryInfo({
          rating: this.changeSalaryData.rating,
          monthSalary: this.changeSalaryData.monthSalary,
          teaIds: [this.changeSalaryData.teaId]
        }).then(data => {
          this.changeSalaryDialogVisible = false;
          if (!data) {
            this.$Message({
              type: 'success',
              message: '变更薪资成功'
            });
            this.search();
          }
        }).catch(message => {
          this.changeSalaryDialogVisible = false;
          this.$Message({
            message: message
          });
        });
      },
      // 关闭变更薪资弹窗
      hideChangeSalaryDialog() {
        this.changeSalaryDialogVisible = false;
      },
      // 变更薪资
      showUpdataSalary(row) {
        let monthSalary=''
        if(row.timeType==2){
           monthSalary='实习工资';
        }else {
           monthSalary=row.monthSalary;
        };
        this.changeSalaryData = {
          rating: row.rating,
          monthSalary: monthSalary,
          teaId: row.teaId,
        };
        this.changeSalaryBackupData = JSON.parse(JSON.stringify(this.changeSalaryData)); // 备份变更薪资对象，对比是否做了修改
        this.changeSalaryDialogVisible = true;
        this.gettrainLevel(row);
      },
      handleSizeChange(pageSize) {
          this.search_data.pageSize = pageSize;
          this.search_data.pageNo = 1;
          this.getTableData();
      },
      handleCurrentChange(currentPage) {
          this.search_data.pageNo = currentPage;
          this.getTableData();
      },
      chooseActDate() {
        if(this.searchActDateArea[0] == null){
            this.search_data.startTrainTime = "";
            this.search_data.endTrainTime = "";
        }else{
            let sDate = new Date(this.searchActDateArea[0]).getTime();
            let eDate = new Date(this.searchActDateArea[1]).getTime();
            this.search_data.startTrainTime = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
            this.search_data.endTrainTime = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";
        }
      },
      // 获取基本薪资，一对一
      getBasicSalary() {
        let data = [
          {
              "dictCode": "ZM_BU",
              "optionValue": '1',
              "bizCategory":"common"
          },
          {
              "dictCode": "TEACHER_ORIGIN",
              "optionValue": '1', // 1 全职 2 校招全职
              "bizCategory":"common"
          },
          {
              "dictCode": "TEACHER_SALARY",
              "strategy": 0
          }
        ]
        this.$Fetch({
          url: `/api/cascade/dict/service`,
          method: 'post',
          data
        }).then(res => {
          if (res.code === '0') {
            this.salaryList = [...res.data.children, ...[{label: '实习工资', value: '1200'}]];
          }
        })
        .catch(err => {
           console.log(err)
        })
      },
      // 获取教师资格状态列表
      getTeaCerList() {
        getTeaCerListService([{
          "dictCode": "TEACHER_CERTIFICATE"
        }]).then(res => {
          this.teaCerOptions = [...[{
            label: '全部',
            value: ''
          }],...res.children];
          for(let i = 0; i < this.table_data.length; i++) {
            if (this.table_data[i].certificateType) {
              for(let j = 0; j < this.teaCerOptions.length; j++) {
                if (this.table_data[i].certificateType == this.teaCerOptions[j].value) {
                  this.table_data[i].certificateTypeVal = this.teaCerOptions[j].label;
                }
              }
            }
            if (this.table_data[i].certificateType ==  0) {
              this.table_data[i].certificateTypeVal = '未持证';
            }
          }
        }).catch(message => {
          this.$Message({
            message
          });
        })
      },
      // 获取讲师等级
      gettrainLevel(row) {
        let parm = {
          bu: row.teaBu || 1, // 1：1对1
          TEACHER_ORIGIN: row.timeType, // 1 全职，2全职校招
           teaId: row.teaId
        };
        let levelData = [];
        let salaryData= [];

        getTeaLevelWithSalary(parm)
          .then(data => {
            this.LevelandsalaryData=data.children;
            if(data.children&&data.children.length){
              for (let i = 0; i < data.children.length; i++) {
              levelData.push({
                value: data.children[i].value + '',
                label: data.children[i].label,
              });
              salaryData.push({
                value: data.children[i].extendValue,
                label: data.children[i].extendLabel,
                labelValue: data.children[i].value,
              })
            }
            this.trainLevelData = levelData;
            this.salaryListData = salaryData;
            
            
            // 整理出讲师等级内容
            for(let i = 0; i < this.table_data.length; i++) {
              for(let m = 0; m < this.trainLevelData.length; m++) {
                if (this.table_data[i].rating == this.trainLevelData[m].value) {
                  this.table_data[i].ratingStr = this.trainLevelData[m].label;
                }
              }
            }
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      },
      // 获取第一擅长科目
      initSubject(){
        this.basesubList = [];
        getSubject({}).then(data => {
          this.basesubList = data.children;
        }).catch(message => {
        });
      },
      // 获取年级偏好
      initPhase() {
        this.phaseList = [];
        getPhase({}).then(data => {
          this.phaseList = data.children;
        }).catch(message => {
        });
      },
      // 查询登录人是否为管理员
      getLoginUserType() {
        getCommissioner({}).then(data => {
          // positionFlag 1 管理员，0 专员
          this.adminFlg = data.positionFlag == 1 ? true : false;
        }).catch(message => {
        });
      },
      // 查询
      search() {
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      // 查询批量审批薪资list
      getTableData(){
        if (this.$refs.loadingComRef) {
          this.$refs.loadingComRef.progressState = true;
        }
        let getParams = JSON.parse(JSON.stringify(this.search_data));
        // 面试管理，批量审核列表查询
        if (this.curPage === 'pre_training') {
          getParams.type = 'pre_training';
          getTeachersSalaryData(getParams).then(data => {
            if (this.$refs.loadingComRef) {
              this.$refs.loadingComRef.progressState = false;
            }
            if (data.list && data.list.length) {
              this.table_data = data.list;
              this.table_data_total = data.total;
              // 整理出教资内容
                this.getTeaCerList();
              // 整理出讲师等级和薪资内容
              this.allLevelAndSalary()
            } else {
              this.table_data = [];
              this.table_data_total = 0;
            }
          }).catch(message => {
            if (this.$refs.loadingComRef) {
              this.$refs.loadingComRef.progressState = false;
            }
            if (JSON.stringify(message) != '{}') {
              this.$Message({
                message: message
              });
            }
            this.table_data = [];
            this.table_data_total = 0;
          });
        } else if(this.curPage === 'bef_int'){ // 培训管理，批量审核列表查询
          getParams.type = 'bef_int';
          getTeachersSalaryData(getParams).then(data => {
            if (this.$refs.loadingComRef) {
              this.$refs.loadingComRef.progressState = false;
            }
            if (data.list && data.list.length) {
              this.table_data = data.list;
              this.table_data_total = data.total;
              // 整理出教资内容
              for(let i = 0; i < this.table_data.length; i++) {
                if (this.table_data[i].certificateType) {
                  for(let j = 1; j < this.teaCerOptions.length; j++) {
                    if (this.table_data[i].certificateType == this.teaCerOptions[j].value) {
                      this.table_data[i].certificateTypeVal = this.teaCerOptions[j].label;
                    }
                  }
                }
                if (this.table_data[i].certificateType ==  0) {
                  this.table_data[i].certificateTypeVal = '未持证';
                }
              }
              this.allLevelAndSalary()
              // 整理出讲师等级和薪资内容
              // this.gettrainLevel(); // 获取讲师等级
            } else {
              this.table_data = [];
              this.table_data_total = 0;
            }

          }).catch(message => {
            if (this.$refs.loadingComRef) {
              this.$refs.loadingComRef.progressState = false;
            }
            this.$Message({
                message: message
            });
            this.table_data = [];
            this.table_data_total = 0;
          });
        }
      },
  },
  computed: {
  },
  mounted() {
    this.initHasCertificate();
    this.getLoginUserType(); // 查询登录人是否为管理员
    this.initPhase(); // 初始化年级偏好
    this.initSubject(); // 初始化第一擅长科目
    this.getTeaCerList(); // 获取教师资格状态列表
    this.getBasicSalary(); // 获取基本薪资，目前只获取1对1的
    this.getTeacherTypes();
    this.getLevelForList();
    this.curPage = this.$route.query.originPage;// 获取当前页面name，bef_int: 培训管理页，pre_training:面试管理页
    commonCascade([{"dictCode":"IS_FULL_TIME"}]).then(data => {
      this.styleClassOption = data.children;
    })
    this.$nextTick(() => {
      this.search()
    })
  },
  components:{
    LoadingCom
  }
}
</script>
<style lang="less" scoped>
.high-light {
  color: red;
}
.f-12 {
  font-size: 12px;
}
</style>
