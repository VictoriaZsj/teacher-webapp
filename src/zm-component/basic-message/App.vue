<template>
<div id="basic-main" class="basic-main" :class="{'redPoint':redPoint}">
  <div v-if="!!errorMessage" class="errorMessage">
    {{errorMessage}}
  </div>
  <div v-else>
    <el-tabs v-if="finish" v-model="selectMode" :class="bmClass" tab-position="left">
      <el-tab-pane label="实名认证" name="authentication">
        <authentication v-if="selectMode == 'authentication'"
          :get-realname-info="apiData.getRealnameInfo"
          :teacher-info-set-teacher-real-name="apiData.teacherInfoSetTeacherRealName"
          :cancel-teacher-realName="apiData.cancelTeacherRealName"
          :tea-id="teaId"
          :realnameinfoPermission="realnameinfoPermission"
          :cancelRealnameinfoPermission="cancelRealnameinfoPermission"
          :realnameinfoSavePermission="realnameinfoSavePermission"
          :secretMessagePermission="secretMessagePermission"
          @confirm="confirm"
          @cancel="cancel">
        </authentication>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="info">
        <base-info v-if="selectMode == 'info'"
          :tea-id="teaId"
          :cipherTId="cipherTId"
          :basic-info="apiData.basicInfo"
          :update-basic-info="apiData.updateBasicInfo"
          :set-head-image-url="apiData.setHeadImageUrl"
          :tea-statue="teaStatue"
          :baseinfoPermission="baseinfoPermission"
          :editbaseinfoPermission="editbaseinfoPermission"
          :secretMessagePermission="secretMessagePermission"
          :pageInfo="pageInfo"
          @confirm="confirm"
          @cancel="cancel">
        </base-info>
      </el-tab-pane>
      <el-tab-pane label="教学背景" name="backGround">
        <edu-back v-if="selectMode == 'backGround'"
          :tea-id="teaId"
          :get-edu-back="apiData.getEduBack"
          :update-tea-edu-back-info="apiData.updateTeaEduBackInfo"
          :get-subject="apiData.getSubject"
          :get-appointment-subject="apiData.getAppointmentSubject"
          :get-all-dic="apiData.getAllDic"
          :get-grade="apiData.getGrade"
          :get-phase="apiData.getPhase"
          :get-provinces="apiData.getProvinces"
          :get-citys="apiData.getCitys"
          :get-tea-level="apiData.getTeaLevel"
          :all-subject="allSubject"
          :eduInfoPermission="eduInfoPermission"
          :editEduInfoPermission="editEduInfoPermission"
          :pageInfo="pageInfo"
          @confirm="confirm"
          @cancel="cancel">
        </edu-back>
      </el-tab-pane>
      <el-tab-pane v-if="teaStatue > 1" label="个人介绍" name="introduce">
        <tea-personal-info ref="teaPersonalInfo" v-if="selectMode == 'introduce'"
          :get-tea-personal-info="apiData.getTeaPersonalInfo"
          :tea-id="teaId"
          :bu="bu"
          :introduceInfoPerssion="introduceInfoPerssion"
          @preview="openPreviewDialog"
          @audit="openAuditDialog"
          @showRedPoint="showRedPoint"
          @confirm="confirm"
          @cancel="cancel">
        </tea-personal-info>
      </el-tab-pane>
      <el-tab-pane label="薪资支付" name="salaryAnPay">
        <salary-and-pay v-if="selectMode == 'salaryAnPay'"
          :update-salary-an-pay="apiData.updateSalaryAnPay"
          :get-salary-info="apiData.getSalaryInfo"
          :get-tea-level="apiData.getTeaLevel"
          :tea-id="teaId"
          :tea-statue="teaStatue"
          :salaryInfoPermission="salaryInfoPermission"
          :editSalaryPermission="editSalaryPermission"
          :secretMessagePermission="secretMessagePermission"
          @confirm="confirm"
          @cancel="cancel">
        </salary-and-pay>
      </el-tab-pane>
      <el-tab-pane v-if="bu != 3 && entryInfoEnable && teaStatue > 3" label="入职资料" name="entryInfo">
        <entry-info ref="entryInfo" v-if="selectMode == 'entryInfo'"
          :tea-id="teaId"
          :get-tea-entry-material="apiData.getTeaEntryMaterial"
          :download-teacher-files-zip="apiData.downloadTeacherFilesZip"
          :export-new-entry-pdf="apiData.exportNewEntryPdf"
          :get-entry-state="apiData.getEntryState"
          @audit="openTeaEntryAuditDialog"
          @cancel="cancel">
        </entry-info>
      </el-tab-pane>
      <el-tab-pane v-if="bu == 3" label="老师标签" name="teachTag">
        <teach-tag v-if="selectMode == 'teachTag'"
          :get-tea-level="apiData.getTeaLevel"
          :tea-id="teaId"
          :tea-statue="teaStatue"
          :teachTagPermission="teachTagPermission"
          :editTeachTagPermission="editTeachTagPermission"
          @confirm="confirm"
          @cancel="cancel">
        </teach-tag>
      </el-tab-pane>
    </el-tabs>
    <preview :tea-data="previewData" v-if="previewDialog && bu != 3" @cancel="cancelPreviewDialog" :view-state="previewDialog"></preview>
    <previewOld :tea-data="previewData" v-if="previewDialog && bu == 3" @cancel="cancelPreviewDialog" :view-state="previewDialog"></previewOld>
    <audit :tea-id="teaId" v-if="auditDialog"
      :auditingIntroduceInfoPermission="auditingIntroduceInfoPermission"
      :review-tea-personal-info="apiData.reviewTeaPersonalInfo"
      :get-review-list="apiData.getReviewList"
      :audit-state="auditState"
      @confirm="confirmAuditDialog"
      @cancel="cancelAuditDialog"
      :view-state="auditDialog">
    </audit>
    <tea-entry-audit :tea-id="teaId" v-if="teaEntryAuditDialog"
      :name="teaEntryAuditTeaName"
      :new-entry-audit="apiData.newEntryAudit"
      :get-audit-records="apiData.getAuditRecords"
      :get-entry-state="apiData.getEntryState"
      @confirm="confirmTeaEntryAuditDialog"
      @cancel="cancelTeaEntryAuditDialog">
    </tea-entry-audit>
  </div>
</div>
</template>
<script>
import authentication from './authentication'
import baseInfo from './baseInfo'
import teaPersonalInfo from './teaPersonalInfo'
import salaryAndPay from './salaryAndPay'
import eduBack from './eduBack'
import entryInfo from './entryInfo'
import teachTag from './teachTag'
import preview from './component/preview_new'
import preview_old from './component/preview'
import audit from './component/audit'
import teaEntryAudit from './component/teaEntryAudit'

import getTeaPersonalInfo from './API/getTeaPersonalInfo';
import getBasicInfo from './API/basicInfo';

import getSubject from './API/getSubject'

export default {
  name: 'basic-message',
  data() {
    return {
      selectMode: "authentication",
      previewData: null,
      previewDialog: false,
      auditDialog: false,
      finish:false,
      auditState:0,
      allSubject:[],
      redPoint:false,//小红点 标记是否有审核的东西
      teaEntryAuditTeaName:"",
      teaEntryAuditDialog:false,
      apiData:{
        'getRealnameInfo':null, //获取实名认证信息
        'teacherInfoSetTeacherRealName':null, //进行实名认证
        'updateBasicInfo':null, //修改基本信息
        'basicInfo':null, //获取基本信息
        'updateSalaryAnPay':null, //修改基本薪资
        'getSalaryInfo':null, //获取基本薪资
        'getTeaLevel':null, //获取教师等级
        'getTeaPersonalInfo':null, //获取个人介绍
        'getEduBack':null, //获取教学背景
        'updateTeaEduBackInfo':null, //修改教学背景
        'getSubject':null, //获取第一擅长科目
        'getAppointmentSubject':null, //获取预约科目
        'getAllDic':null, //获取所有字典
        'getGrade':null, //获取年级
        'getPhase':null, //获取学段
        'getProvinces':null, //获取省
        'getCitys':null, //获取市
        'reviewTeaPersonalInfo':null,//审核个人信息
        'getReviewList':null,//获取审核列表
        'getTeaEntryMaterial':null,//获取入职资料
        'downloadTeacherFilesZip':null,//一键导出入职文件
        'exportNewEntryPdf':null,//导出入职资料pdf
        'getEntryState':null,//获取入职状态
        'getAuditRecords':null,//获取入职资料审核记录
        'newEntryAudit':null,//审核入职资料
      },
      getTeaPersonalInfoAPI:null,
      getBasicInfoAPI:null,
      errorMessage:"",
      bu:null
    }
  },
  props: [
    'tea-id',
    'cipherTId',
    'tea-statue',
    'baseInfo',
    'api',
    'auth',
    'bm-class',
    'entry-info-enable',//是否显示入职资料
    'page-info'
  ],
  computed:{
    realnameinfoPermission()//获取实名认证
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.realnameinfoPermission;
    },
    cancelRealnameinfoPermission(){
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.cancelRealnameinfoPermission;
    },
    realnameinfoSavePermission()//保存实名认证
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.realnameinfoSavePermission;
    },
    baseinfoPermission()//获取基本信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.baseinfoPermission;
    },
    editbaseinfoPermission()//保存基本信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.editbaseinfoPermission;
    },
    eduInfoPermission()//获取教学背景
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.eduInfoPermission;
    },
    editEduInfoPermission()//保存教学背景
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.editEduInfoPermission;
    },
    introduceInfoPerssion()//获取个人介绍信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.introduceInfoPerssion;
    },
    auditingIntroduceInfoPermission()//个人介绍审核
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.auditingIntroduceInfoPermission;
    },
    salaryInfoPermission()//获取薪资银行信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.salaryInfoPermission;
    },
    editSalaryPermission()//保存(编辑)薪资银行信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.editSalaryPermission;
    },
    secretMessagePermission()//获取加密信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.secretMessagePermission;
    },
    teachTagPermission()//获取薪资银行信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.teachTagPermission;
    },
    editTeachTagPermission()//保存(编辑)薪资银行信息
    {
      if(!this.auth){//如果没有配置 默认是有权限的
        return true;
      }
      return this.auth.editTeachTagPermission;
    }
  },
  mounted: function() {
    this.apiSetting();
    this.getCheckState();
    this.initBasicMes();
  },
  methods: {
    confirm() {
      this.$emit("confirm")
    },
    cancel() {
      this.$emit("cancel")
    },
    initBasicMes(){
      this.$BMloading("basic-main")
      this.getBasicInfoAPI({
        teaId: this.cipherTId
      }).then(data => {
        this.$BMloadingFinish("basic-main")
        this.bu = data.teaBu;
        this.getALLSubject();
      }).catch(message => {
        this.$BMloadingFinish("basic-main")
        this.errorMessage = "拉取用户信息失败";
      })
    },
    getALLSubject(){
      getSubject({}).then(data => {
        this.allSubject = data.children;
        this.finish = true;
      }).catch(message => {
        this.finish = true;
      })
    },
    apiSetting(){
      if(!!this.api && !!this.api.getTeaPersonalInfo){
        this.getTeaPersonalInfoAPI = this.api.getTeaPersonalInfo;
      }else{
        this.getTeaPersonalInfoAPI = getTeaPersonalInfo;
      }
      if(!!this.api && !!this.api.basicInfo){
        this.getBasicInfoAPI = this.api.basicInfo;
      }else{
        this.getBasicInfoAPI = getBasicInfo;
      }

      if(!!this.api){
        Object.assign(this.apiData,this.api)
      }
    },
    openTeaEntryAuditDialog(name){
      this.teaEntryAuditTeaName = name;
      this.teaEntryAuditDialog = true;
    },
    cancelTeaEntryAuditDialog(){
      this.teaEntryAuditDialog = false;
    },
    confirmTeaEntryAuditDialog(){
      this.teaEntryAuditDialog = false;
    },
    openPreviewDialog(data) {
      this.previewData = data;
      this.previewDialog = true;
    },
    cancelPreviewDialog() {
      this.previewDialog = false;
    },
    showRedPoint(){
      this.redPoint = true;
    },
    openAuditDialog(state) {
      this.auditState = state;
      this.auditDialog = true;
    },
    confirmAuditDialog(options) {
        this.$refs['teaPersonalInfo'].getData();
        this.auditDialog = false;
    },
    cancelAuditDialog() {
      this.auditDialog = false;
    },
    getCheckState(){//获取审核情况
      this.getTeaPersonalInfoAPI({
        teaId: this.teaId
      }).then(data => {
        if(data.state == "1" && this.teaStatue > 1){
          this.redPoint = true;
        }
      }).catch(message => {
        console.log("getTeaPersonalInfo异常:", message);
      });
    }
  },
  components: {
    authentication,
    baseInfo,
    teaPersonalInfo,
    salaryAndPay,
    eduBack,
    entryInfo,
    preview,
    audit,
    teaEntryAudit,
    teachTag,
    previewOld: preview_old
  }
}
</script>

<style scoped media="screen">
  @import url("./APP.css");
  .errorMessage{
    text-align: center;
  }
</style>
