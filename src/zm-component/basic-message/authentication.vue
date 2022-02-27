<template>
<div id="authentication" class="basic-tab-item">
  <div v-if="!statueText">
    <div class="basic-tab-item-content">
      <el-form :inline="true" class="basic-message-form" label-position="left" label-width="80px">
        <div class="basic-message-audit-state">
          <div class="basic-message-audit-text">
            <div class="basic-message-audit-title">
              {{getstateStr(authentication.state)}}
            </div>
          </div>
        </div>
        <el-form-item class="require" label="姓名">
          <el-input :disabled="authentication.state == '1'" v-model="authentication.realName"></el-input>
        </el-form-item>
        <el-form-item class="require" label="证件类型">
          <el-select :disabled="authentication.state == '1'" v-model="authentication.certificateType" placeholder="请选择">
            <el-option label="身份证" :value="1" />
            <el-option label="其他证件" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="require" label="证件号">
          <dami-pwd-input :disabled="authentication.state == '1'" :permission="secretMessagePermission" v-model="authentication.idCard"></dami-pwd-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="basic-tab-item-control">
      <el-button @click="cancel">取消</el-button>
      <el-button v-if="authentication.state == '0'" :loading="confirmState" @click="confirm" type="primary">实名认证</el-button>
      <el-button v-if="authentication.state == '1'" :loading="confirmState" @click="openCancelAuth" type="primary">取消实名认证</el-button>
    </div>
  </div>
  <div v-else class="basicinfo-no-data">
    {{statueText}}
  </div>
  <time-remark :show="cancelAuthDialog" title="取消实名认证" @cancel="cancelCancelAuth" @confirm="confirmCancelAuth" remark-title="备注"></time-remark>
</div>
</template>
<script>
import damiPwdInput from 'dami-pwd-input'
import getRealnameInfo from './API/getRealnameInfo'
import teacherInfoSetTeacherRealName from './API/teacherInfoSetTeacherRealName'
import cancelTeacherRealName from './API/cancelTeacherRealName'

import {
  isEmpty
} from './assets/js/assist'

export default {
  data() {
    return {
      authentication: {},
      confirmState: false,
      cancelAuthDialog:false,
      API:{
        getRealnameInfo:null,
        teacherInfoSetTeacherRealName:null,
        cancelTeacherRealName:null
      },
      statueText:'正在加载...'
    }
  },
  props: [
    'tea-id',
    'realnameinfo-permission',//保存实名认证(权限)
    'cancel-realnameinfo-permission',//取消实名认证(权限)
    'realnameinfo-save-permission',//获取实名认证
    'secret-message-permission',//机密信息(权限)
    'get-realname-info',//获取实名认证信息
    'teacher-info-set-teacher-real-name',//进行实名认证
    'cancel-teacher-realName'//取消实名认证
  ],
  methods: {
    getstateStr(state) {
      if (state == "1") {
        return '已实名认证'
      }
      if (state == "0") {
        return '未实名认证'
      }
      return "";
    },
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.saveData();
    },
    openCancelAuth(){
      this.cancelAuthDialog = true;
    },
    cancelCancelAuth(){
      this.cancelAuthDialog = false;
    },
    confirmCancelAuth(options){
      this.$MessageBox.confirm(`确定要取消实名认证吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.cancelAuthDialog = false;

        //取消实名认证
        let parm = {
          teaId:this.teaId,
          remark:options.remark
        }
        this.API.cancelTeacherRealName(parm).then(data => {
          this.$Message({
            message: '操作成功'
          });
          this.getData();
        }).catch(message => {
          this.$Message({
            message
          });
        })

      }).catch(message => {

      });
    },
    saveData() {
      if(!this.realnameinfoPermission){
        this.$Message({
          message: '您暂时没有权限进行实名认证'
        });
        return;
      }
      if (this.authentication.state == 1) {
        this.$Message({
          message: '已经实名认证,不需要再次进行实名认证'
        });
        return;
      }
      if (isEmpty(this.teaId)) {
        this.$Message({
          message: '请选择教师'
        });
        return;
      }
      if (isEmpty(this.authentication.realName)) {
        this.$Message({
          message: '请填写姓名'
        });
        return;
      }
      if (isEmpty(this.authentication.certificateType)) {
        this.$Message({
          message: '请选择证件类型'
        });
        return;
      }
      if (isEmpty(this.authentication.idCard)) {
        this.$Message({
          message: '请填写证件号'
        });
        return;
      } else {
        if (this.authentication.certificateType == "1") {
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
          if (reg.test(this.authentication.idCard) == false) {
            this.$Message({
              message: '身份证格式不正确'
            });
            return;
          }
        }
      }

      let parm = {
        teaId: this.teaId,
        idCard: this.authentication.idCard, //证件号码
        realName: this.authentication.realName, //姓名
        certificateType: this.authentication.certificateType //证件类型
      };
      if(!!this.authentication._data){
        parm._data = this.authentication._data;
      }

      this.$MessageBox.confirm(`请确保老师的姓名、证件类型和证件号码是真实有效的。实名认证之后，将不可修改这3项信息。是否确定要进行实名认证？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmState = true;
        this.API.teacherInfoSetTeacherRealName(parm).then(data => {
          this.authentication.state = "1";
          this.confirmState = false;
          this.$Message({
            message: '实名认证成功'
          });
          this.getData();
          this.$emit("confirm")
        }).catch(message => {
          this.confirmState = false;
          this.$Message({
            message
          });
          console.log("teacherInfoSetTeacherRealName异常:", message)
        });
      }).catch(message => {

      });
    },
    getData() {
      if(!this.realnameinfoSavePermission){
        this.statueText = "您暂时没有权限获取实名认证信息";
        return;
      }
      this.$BMloading("authentication")
      let parm = {
        teaId: this.teaId
      }
      this.statueText = "";
      this.API.getRealnameInfo(parm).then(data => {
        this.authentication = data;
        this.$BMloadingFinish("authentication")
      }).catch(message => {
        this.$Message({
          message: message
        });
        this.statueText = "暂无数据";
        this.$BMloadingFinish("authentication")
        this.authentication = {};
        console.log("getRealnameInfo异常:", message)
      });
    },
    apiSetting(){
      if(!!this.getRealnameInfo){
        this.API.getRealnameInfo = this.getRealnameInfo;
      }else{
        this.API.getRealnameInfo = getRealnameInfo;
      }
      if(!!this.teacherInfoSetTeacherRealName){
        this.API.teacherInfoSetTeacherRealName = this.teacherInfoSetTeacherRealName;
      }else{
        this.API.teacherInfoSetTeacherRealName = teacherInfoSetTeacherRealName;
      }
      if(!!this.cancelTeacherRealName){
        this.API.cancelTeacherRealName = this.cancelTeacherRealName;
      }else{
        this.API.cancelTeacherRealName = cancelTeacherRealName;
      }
    }
  },
  mounted: function() {
    this.apiSetting();
    this.getData();
  },
  components: {
    damiPwdInput
  }
}
</script>
<style scoped media="screen">
  .basic-message-audit-state{
    padding: 10px 0;
  }
  .basic-message-audit-text:after{
    content: '';
    display: block;
    clear: both;
  }
  .basic-message-audit-title{
    width: 100px;
    min-height: 40px;
    line-height: 40px;
    background-color: rgba(22, 155, 213, 1);
    color:white;
    font-size: 14px;
    text-align: center;
    float: left;
  }
  .basic-message-audit-description{
    min-height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 120px;
  }
  /* .el-button{
    padding: 0 20px;
  } */
</style>
