<template>
    <div class="entry-info">
      <div style="margin-bottom:10px;">
        <h3 style="color:#007fff;">
          <span style="margin-right:10px;">审核结果:{{entryInfo.entryState}}</span>
          <span v-if="entryInfo.state == '3'" style="margin-right:10px;">问题模块:{{entryInfo.entryMaterialProblem}}</span>
          <span v-show="!!entryInfo.entryRemark" style="margin-right:10px;">备注:{{entryInfo.entryRemark}}</span>
        </h3>
      </div>
      <div class="entry-info-title">
        <h5 class="itemH">基本信息</h5>
        <span @click="downNewEntryPDF" class="itemS">导出</span>
      </div>

      <el-form class="search-form form-item" :inline="true" label-width="100px">
        <el-form-item label="姓名:">
          <span>{{info.name}}</span>
        </el-form-item>
        <el-form-item label="性别:">
          <span>{{info.teaGender}}</span>
        </el-form-item>
        <el-form-item label="民族:">
          <span>{{info.nation}}</span>
        </el-form-item>
        <el-form-item label="身份证号:">
          <a v-if="attachmentFiles[0].file[0]" :href="attachmentFiles[0].file[0].url">{{info.idCard}}</a>
          <span v-else>{{info.idCard}}</span>
        </el-form-item>
        <el-form-item label="身份证有效时间:">
          <span>{{transformDate(info.idCardValidityDay)}}</span>
        </el-form-item>
        <el-form-item label="出生日期:">
          <span>{{info.birthday}}</span>
        </el-form-item>
        <el-form-item label="籍贯:">
          <span>{{info.nativePlace}}</span>
        </el-form-item>
        <el-form-item label="户籍性质:">
          <span>{{!!info.household ? '城镇' : '农村'}}</span>
        </el-form-item>
        <el-form-item label="婚姻状况:">
          <span>{{teaMaritalFilter(info.teaMarital)}}</span>
        </el-form-item>
        <el-form-item label="手机号:">
          <span class="mobile-cursor" @click="showMobile('mobile')"
          v-if="!curMobileSeen">点击获取手机号</span>
          <span v-if="curMobileSeen">{{info.mobile}}</span>
        </el-form-item>
        <el-form-item label="邮箱:">
          <span>{{info.email}}</span>
        </el-form-item>
        <el-form-item label="紧急联系人姓名:">
          <span>{{info.emergencyContactName}}</span>
        </el-form-item>
        <el-form-item label="紧急联系人关系:">
          <span>{{info.emergencyContactRelation}}</span>
        </el-form-item>
        <el-form-item label="紧急联系方式:">
          <span class="mobile-cursor" @click="showMobile('emergencyContactMobile')"
          v-if="!emergMobileSeen">点击获取手机号</span>
          <span v-if="emergMobileSeen">{{info.emergencyContact}}</span>
        </el-form-item>
        <el-form-item label="户籍所在地:">
          <span>{{info.houseProv}}{{info.houseCity}}{{info.houseArea}}{{info.houseAddress}}</span>
        </el-form-item>
        <el-form-item label="现居地址:">
          <span>{{info.teaCity}}{{info.teaArea}}{{info.teaAddress}}</span>
        </el-form-item>
      </el-form>
      <h5>教学背景</h5>
      <el-form class="search-form form-item" :inline="true" label-width="100px">
        <el-form-item label="年级:">
          <span>{{info.teaTaughtStuGrade}}</span>
        </el-form-item>
        <el-form-item label="科目:">
          <span>{{info.teaGoodFirst}}</span>
        </el-form-item>
        <el-form-item label="最高学历:">
          <a v-if="attachmentFiles[1].file[0]" :href="attachmentFiles[1].file[0].url">{{info.teaEdu}}</a>
          <span v-else>{{info.teaEdu}}</span>
        </el-form-item>
        <el-form-item label="专业:">
          <span>{{info.teaMajor}}</span>
        </el-form-item>
        <el-form-item label="学校等级:">
          <span>{{info.schoolLevel}}</span>
        </el-form-item>
        <el-form-item label="毕业学校:">
          <a v-if="attachmentFiles[1].file[1]" :href="attachmentFiles[1].file[1].url">{{info.teaSuoshuSchool}}</a>
          <span v-else>{{info.teaSuoshuSchool}}</span>
        </el-form-item>
      </el-form>
      <h5>银行卡信息</h5>
      <el-form class="search-form form-item" :inline="true" label-width="100px">
        <el-form-item label="开户银行:">
          <span>{{info.bankName}}</span>
        </el-form-item>
        <el-form-item label="开户省市:">
          <span>{{info.bankProvince}}{{info.bankCity}}</span>
        </el-form-item>
        <el-form-item label="开户支行:">
          <span>{{info.bankBranch}}</span>
        </el-form-item>
        <el-form-item label="银行卡号:">
          <a v-if="attachmentFiles[4].file[0]" :href="attachmentFiles[4].file[0].url">{{info.bankAccount}}</a>
          <span v-else>{{info.bankAccount}}</span>
        </el-form-item>
      </el-form>
      <h5>备注</h5>
      <el-form class="search-form form-item" :inline="true" label-width="100px">
        <span>{{info.entryRemark}}</span>
      </el-form>
      <h5>教育经历</h5>
      <el-table class="table-item form-item" :data="info.educationInfos" style="width:100%">
        <el-table-column align="center" label="学历" width="80">
          <!-- 学历 0:高中 1: 本科， 2: 硕士 3: 博士 4: 大专 -->
          <template slot-scope="scope" >
              {{['高中', '本科', '硕士', '博士', '大专'][scope.row.degree]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="起终时间" width="200">
          <template scope="scope" >
              {{scope.row.fromyear}}{{scope.row.frommonth}}-{{scope.row.toyear}}{{scope.row.tomonth}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="schoolname" label="就读学校" width="180">
        </el-table-column>
        <el-table-column align="center" prop="submajor" label="所学专业" width="200">
        </el-table-column>
        <!-- 产品又不上该字段，建议暂时保留 -->
        <!-- <el-table-column align="center" label="学习形式" width="100">
          <template slot-scope="scope" >
              {{['-', '全日制', '非全日制'][Number(scope.row.educationForm)]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="学位证和毕业证" width="120">
          <template slot-scope="scope" >
              {{['-', '已取得学信网可查', '暂未取得(未毕业)', '暂无渠道(肄业)'][Number(scope.row.certificate)]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否特殊学制" width="120">
          <template slot-scope="scope" >
              {{['否', '专升本', '专插本', '成人教育', '自考', '函授'][Number(scope.row.specialEdu)]}}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="证明人" prop="proveName">
        </el-table-column>
        <el-table-column align="center" label="证明人联系方式" prop="proveMobile" width="120">
        </el-table-column>
      </el-table>
      <h5>工作经历</h5>
      <el-table class="table-item form-item" :data="info.workExperiences" style="width:100%">
        <el-table-column align="center"   prop="createdTime" label="起终时间" width="200">
          <template scope="scope" >
              {{scope.row.fromyear}}{{scope.row.frommonth}}-{{scope.row.toyear}}{{scope.row.tomonth}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="company" label="公司名称" width="180">
        </el-table-column>
        <el-table-column align="center" prop="position" label="职位名称" width="200">
        </el-table-column>
        <el-table-column align="center" label="公司HR姓名" prop="hrName">
        </el-table-column>
        <el-table-column align="center" label="公司HR联系方式" prop="hrMobile">
        </el-table-column>
      </el-table>
      <h5>家庭成员</h5>
      <el-table class="table-item form-item" :data="info.familyMembers" style="width:100%">
        <el-table-column align="center" prop="relationship" label="与本人关系" width="180">
        </el-table-column>
        <el-table-column align="center" prop="memberName" label="姓名" width="180">
        </el-table-column>
        <el-table-column align="center" prop="workUnit" label="工作单位" width="200">
        </el-table-column>
        <el-table-column align="center" label="居住地" prop="remark">
          <template scope="scope" >
              {{scope.row.liveProv }}{{scope.row.liveCity }}{{scope.row.liveArea }}{{scope.row.liveAddress }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系方式" prop="memberMobile">
        </el-table-column>
      </el-table>
      <h5>相关扫描件</h5>

      <el-form class="search-form form-item" label-width="120px">

        <div id="J-link-content" class="link-content" v-for="(item,index) in attachmentFiles" :key="index" >
          <span>{{item.name}}：</span>
          <a class="link-item" v-for="(_item,_index) in item.file" :key="_index" :href="_item.url" target="_blank"><span>{{_item.name}}</span></a>
        </div>
        <el-form-item label-width="0px" label="">
          <span style="cursor:pointer;display:inline-block;margin-top:10px;color:#3399ff;" @click="downLoadTeaMes">一键下载</span>
        </el-form-item>
      </el-form>


    </div>
</template>
<script>
import getTeaEntryMaterial from '../../api/select/getTeaEntryMaterial'
import downloadTeacherFilesZip from '../../api/action/downloadTeacherFilesZip'
import exportNewEntryPDF from '../../api/action/exportNewEntryPDF'
import getEntryState from '../../api/select/getEntryState';
import getTeaMobile from '../../api/select/getTeaMobile'; // 查询手机号

export default {
  data() {
      return {
        info:{},
        entryInfo:{
          entryState:'',
          state:'',
          entryMaterialProblem:'',
          entryRemark:''
        },
        curMobileSeen: false, // 老师联系电话：是否已查询
        emergMobileSeen: false, // 紧急联系人电话：是否已查询
      }
  },
  props:{
      cipherTId: '',
      currentID: null,
      viewState: false//false表示页面关闭，true表示页面展开
  },
  watch:{
    viewState (val) {
      if(!!val){
        this.getData();
        this.getAuditState();
      }
    }
  },
  computed:{
    attachmentFiles(){
      let _file = [{
        type:1,
        name:"身份证正反面",
        file:[]
      },{
        type:2,
        name:"毕业证学位证",
        file:[]
      },{
        type:3,
        name:"其他证书",
        file:[]
      },{
        type:4,
        name:"劳动关系解除证明",
        file:[]
      },{
        type:5,
        name:"工资卡正面",
        file:[]
      },{
        type:6,
        name:"劳动合同",
        file:[]
      }];
      if(!!this.info && !!this.info.attachmentInfos){
        for(let i = 0; i < this.info.attachmentInfos.length; i++){
          let _item = this.info.attachmentInfos[i];
          this.addToArray(_file,_item)
        }
      }
      return _file;
    }
  },
  methods:{
    // 获取老师手机号详情
    showMobile(type) {
      let parm = {
        teaId: this.currentID,
        infoType: type
      };
      getTeaMobile(parm).then(data => {
        if (data) {
          if (type === 'mobile') { // 老师联系电话
            this.curMobileSeen = true;
            this.info.mobile = data;
          } else if (type === 'emergencyContactMobile') {
            this.emergMobileSeen = true;
            this.info.emergencyContact = data;
          }
        }
      }).catch(message => {
        this.$Message.error('未查询到手机号');
      });
    },
    audit(){

    },
    addToArray(file,item){
      let index = -1;
      for(let i = 0; i < file.length; i++){
        if(file[i].type == item.type){
          index = i;
          break;
        }
      }
      if(index != -1){
        file[index].file.push(item)
      }
    },
    getAuditState(){
      let parm = {
        teaId:this.currentID
      };
      getEntryState(parm).then(data => {
        if(data.entryState == "0"){
          this.entryInfo.entryState = "待提交";
        }
        if(data.entryState == "1"){
          this.entryInfo.entryState = "待审核";
        }
        if(data.entryState == "2"){
          this.entryInfo.entryState = "审核通过";
        }
        if(data.entryState == "3"){
          this.entryInfo.entryState = "审核不通过";
        }
        this.entryInfo.state = data.entryState;
        this.entryInfo.entryMaterialProblem = data.entryMaterialProblem;
        this.entryInfo.entryRemark = data.remark;
      }).catch(message => {
        console.log("getEntryState异常:",message)
        this.$Message({
            message: message
        });
      })
    },
    teaMaritalFilter(val){
        switch(val + '') {
            case '0':
                return '已婚';
            case '1':
                return '未婚';
            case '2':
                return '离异';
            default:
                return '未知';
        }
    },
    transformDate(val) {
        if(!!val){
            return this.$DateTransform(val);
        }
        return "";
    },
    downNewEntryPDF(){
        if(!!this.currentID){
            let parm = {
            teaId:this.currentID
            }
            exportNewEntryPDF(parm);
        }
    },
    downLoadTeaMes(){
      if(!!this.currentID){
        let parm = {
          teaId:this.currentID
        }
        downloadTeacherFilesZip(parm);
      }
    },
    getAttachmentInfoDtoText(val){
      if(val == "1"){
        return "身份证正反面pdf";
      }
      if(val == "2"){
        return "毕业证学位证pdf";
      }
      if(val == "3"){
        return "其他证书pdf";
      }
      if(val == "4"){
        return "劳动关系解除证明pdf";
      }
      if(val == "5"){
        return "工资卡正面pdf";
      }
      if(val == "6"){
        return "劳动合同pdf";
      }
      return "";
    },
    getData(){
      getTeaEntryMaterial({cipherTId: this.cipherTId}).then(data => {
        this.info = data;
      }).catch(message => {
        this.$Message({
            message
        });
        console.log("getData异常:",message)
      })
    },
    scrollBottom(en) {
        en.path.forEach(function(item) {
            if(item.className == 'el-tabs__content') {
                item.scrollTo(0, 10000);
                return false;
            }
        });
    }
  },
  mounted:function(){
    this.getData();
    this.getAuditState();
  }
}
</script>
<style lang="less" media="screen">
.entry-info{
  .el-form-item__content {
    width: 200px;
  }
  .entry-info-title .itemH{
    float: left;
  }
  .entry-info-title .itemS{
    float: right;
    cursor: pointer;
  }
  .entry-info-title::after{
    display: block;
    content: '';
    clear: both;
  }
  .form-item{
    margin-bottom: 20px;
  }
  .table-item{
    margin-top: 20px;
  }
  .link-content{
    padding-top: 10px;
  }
  .link-item{
    display: inline-block;
    margin-left: 10px;
  }
  .mobile-cursor{
    cursor: pointer;
    color: #169bd5;
    width: 100px;
    display: inline-block;
    position: relative;
    left: -10px;
  }
}

</style>
