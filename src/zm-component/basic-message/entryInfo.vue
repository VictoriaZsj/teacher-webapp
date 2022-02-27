<template>
  <div id="entryInfo" class="basic-tab-item">
    <div v-if="!statueText">
      <div class="basic-tab-item-content">
        <div class="entryInfo" >
          <h3 style="color:#007fff;">
            <span style="margin-right:10px;">审核结果:{{entryInfo.entryState}}</span>
            <span v-if="entryInfo.state == '2'" style="margin-right:10px;">问题模块:{{entryInfo.entryMaterialProblem}}</span>
            <span v-show="!!entryInfo.entryRemark" style="margin-right:10px;">备注:{{entryInfo.entryRemark}}</span>
          </h3>
        </div>
        <div class="entry-info-title">
          <h5 class="itemH">基本信息</h5>
          <span @click="downNewEntryPDF" class="itemS">导出</span>
        </div>

        <el-form class="form-item" :inline="true" >
          <el-form-item label="姓名:">
            <span>{{info.name}}</span>
          </el-form-item>
          <el-form-item label="性别:">
            <span>{{info.teaGender}}</span>
          </el-form-item>
          <el-form-item label="民族:">
            <span>{{info.nation}}</span>
          </el-form-item>
          <el-form-item label="邮箱:">
            <span>{{info.email}}</span>
          </el-form-item>
          <el-form-item label="手机号:">
            <span>{{info.mobile}}</span>
          </el-form-item>
          <br />
          <el-form-item label="籍贯:">
            <span>{{info.nativePlace}}</span>
          </el-form-item>
          <el-form-item label="户籍性质:">
            <span>{{!!info.household ? '城镇' : '农村'}}</span>
          </el-form-item>
          <el-form-item label="户籍所在地:">
            <span>{{info.houseProv}}{{info.houseCity}}{{info.houseArea}}{{info.houseAddress}}</span>
          </el-form-item>
          <el-form-item label="现居地址:">
            <span>{{info.teaCity}}{{info.teaArea}}{{info.teaAddress}}</span>
          </el-form-item>
          <br />
          <el-form-item label="出生日期:">
            <span>{{info.birthday}}</span>
          </el-form-item>
          <el-form-item label="婚姻状况:">
            <span>{{teaMaritalFilter(info.teaMarital)}}</span>
          </el-form-item>
          <el-form-item label="身份证号:">
            <span>{{info.idCard}}</span>
          </el-form-item>
          <el-form-item label="身份证有效时间:">
            <span>{{transformDate(info.idCardValidityDay)}}</span>
          </el-form-item>
          <br />
          <el-form-item label="紧急联系人姓名:">
            <span>{{info.emergencyContactName}}</span>
          </el-form-item>
          <el-form-item label="紧急联系人关系:">
            <span>{{info.emergencyContactRelation}}</span>
          </el-form-item>
          <el-form-item label="紧急联系方式:">
            <span>{{info.emergencyContact}}</span>
          </el-form-item>
        </el-form>
        <h5>教学背景</h5>
        <el-form class="form-item" :inline="true" >
          <el-form-item label="年级:">
            <span>{{info.teaTaughtStuGrade}}</span>
          </el-form-item>
          <el-form-item label="科目:">
            <span>{{info.teaGoodFirst}}</span>
          </el-form-item>
          <el-form-item label="最高学历:">
            <span>{{info.teaEdu}}</span>
          </el-form-item>
          <el-form-item label="毕业学校:">
            <span>{{info.teaSuoshuSchool}}</span>
          </el-form-item>
          <!-- 建议保留 -->
          <!-- <el-form-item label="专业">
            <span>{{info.submajor}}</span>
          </el-form-item> -->
          <!-- <el-form-item label="学校类型">
            <span>{{info.name}}</span>
          </el-form-item> -->
          <el-form-item label="教师资格证:">
            <span>{{!!info.teacherCertificate ? '有' : '无'}}</span>
          </el-form-item>
          <!-- 建议保留 -->
          <!-- <el-form-item label="入掌门时间:">
            <span>{{transformDate(info.entryTime)}}</span>
          </el-form-item> -->
        </el-form>
        <h5>银行卡信息</h5>
        <el-form class="form-item" :inline="true" label-width="100px">
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
            <span>{{info.bankAccount}}</span>
          </el-form-item>
        </el-form>
        <h5>备注</h5>
        <el-form class="form-item" :inline="true" label-width="100px">
          <span>{{info.entryRemark}}</span>
        </el-form>
        <h5>教育经历</h5>
        <el-table class="table-item form-item" :data="info.educationInfos" style="width:100%">
          <el-table-column align="center" prop="educationStr" label="学历" width="80">
            <template slot-scope="scope" >
                {{['高中', '本科', '硕士', '博士', '大专'][scope.row.degree]}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createdTime" label="起终时间" width="200">
            <template slot-scope="scope" >
                {{scope.row.fromyear}}{{scope.row.frommonth}}-{{scope.row.toyear}}{{scope.row.tomonth}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="schoolname" label="就读学校" width="180">
          </el-table-column>
          <el-table-column align="center" prop="submajor" label="所学专业" width="200">
          </el-table-column>
          <el-table-column align="center" label="学习形式" width="100">
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
          </el-table-column>
          <el-table-column align="center" label="证明人" prop="proveName">
          </el-table-column>
          <el-table-column align="center" label="证明人联系方式" prop="proveMobile">
          </el-table-column>
        </el-table>
        <h5>工作经历</h5>
        <el-table class="table-item form-item" :data="info.workExperiences" style="width:100%">
          <el-table-column align="center"   prop="createdTime" label="起终时间" width="200">
            <template slot-scope="scope" >
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
            <template slot-scope="scope" >
                {{scope.row.liveProv }}{{scope.row.liveCity }}{{scope.row.liveArea }}{{scope.row.liveAddress }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="联系方式" prop="memberMobile">
          </el-table-column>
        </el-table>
        <h5>相关扫描件</h5>

        <el-form class="form-item" label-width="120px">

          <a class="link-item" v-for="(item,index) in info.attachmentInfos" :key="index" :href="item.url"><span>{{item.name}}</span></a>
          <el-form-item label-width="0px" label="">
            <span style="cursor:pointer;display:inline-block;margin-top:10px;" @click="downLoadTeaMes">一键下载</span>
          </el-form-item>
        </el-form>


      </div>
      <div class="basic-tab-item-control">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">审核</el-button>
      </div>
    </div>
    <div v-else class="basicinfo-no-data">
      {{statueText}}
    </div>
  </div>
</template>
<script>
import getTeaEntryMaterial from './API/getTeaEntryMaterial'
import downloadTeacherFilesZip from './API/downloadTeacherFilesZip'
import exportNewEntryPdf from './API/exportNewEntryPdf'
import getEntryState from './API/getEntryState'

export default {
  data() {
      return {
        info:{},
        statueText:"",
        entryInfo:{
          entryState:'',
          state:'',
          entryMaterialProblem:'',
          entryRemark:''
        },
        API:{
          getTeaEntryMaterial:null,
          downloadTeacherFilesZip:null,
          exportNewEntryPdf:null,
          getEntryState:null
        }
      }
  },
  props:{
      teaId:null,
      'get-tea-entry-material':null,
      'download-teacher-files-zip':null,
      'export-new-entry-pdf':null,
      'get-entry-state':null,
  },
  methods:{
    cancel(){
      this.$emit("cancel")
    },
    confirm(){
      this.$emit("audit",this.info.name)
    },
    apiSetting(){
      if(!!this.getTeaEntryMaterial){
        this.API.getTeaEntryMaterial = this.getTeaEntryMaterial;
      }else{
        this.API.getTeaEntryMaterial = getTeaEntryMaterial;
      }
      if(!!this.downloadTeacherFilesZip){
        this.API.downloadTeacherFilesZip = this.downloadTeacherFilesZip;
      }else{
        this.API.downloadTeacherFilesZip = downloadTeacherFilesZip;
      }
      if(!!this.exportNewEntryPdf){
        this.API.exportNewEntryPdf = this.exportNewEntryPdf;
      }else{
        this.API.exportNewEntryPdf = exportNewEntryPdf;
      }
      if(!!this.getEntryState){
        this.API.getEntryState = this.getEntryState;
      }else{
        this.API.getEntryState = getEntryState;
      }
    },
    getAuditState(){
      let parm = {
        teaId:this.teaId
      };
      this.API.getEntryState(parm).then(data => {
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
      if(val + '' == '0'){
        return '已婚'
      } else if (val + '' == '1') {
          return '未婚'
      }
      return '离异'
    },
    transformDate(val) {
      if(!!val){
        return this.$DateTransform(val);
      }
      return "";
    },
    downNewEntryPDF(){
      if(!!this.teaId){
        let parm = {
          teaId:this.teaId
        }
        this.API.exportNewEntryPdf(parm);
      }
    },
    downLoadTeaMes(){
      if(!!this.teaId){
        let parm = {
          teaId:this.teaId
        }
        this.API.downloadTeacherFilesZip(parm);
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
        return "工资卡正反面pdf";
      }
      if(val == "6"){
        return "劳动合同pdf";
      }
      return "";
    },
    getData(){
      let parm = {
        teaId:this.teaId,
      }
      this.$BMloading("entryInfo")
      this.API.getTeaEntryMaterial(parm).then(data => {
        this.info = data;
        this.$BMloadingFinish("entryInfo")
      }).catch(message => {
        this.$BMloadingFinish("entryInfo")
        this.$Message({
            message
        });
        this.info = {};
        this.statueText = "暂无数据"
      })
    }
  },
  mounted:function(){
    this.apiSetting();
    this.getData();
    this.getAuditState();
  }
}
</script>
<style scoped media="screen">
  .entryInfo{
    margin-bottom: 10px;
  }
  .entryInfo .el-form-item__label{
    min-width: auto !important;
  }
  .entry-info-title .itemH{
    float: left;
  }
  .entry-info-title .itemS{
    float: right;
    cursor: pointer;
    margin-right: 10px;
    color: #007fff;
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
  .link-item{
    display: block;
    padding-bottom: 10px;
  }
  /* .el-button{
    padding: 0 20px;
  } */
</style>
