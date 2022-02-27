<template>
  <div class="main">
    <span @click="open()">点击我</span>
    <el-dialog
      title="提示"
      width="1050px"
      :visible.sync="dialogVisible">
      <app v-if="dialogVisible"
        :tea-id="7727228"
        :tea-statue="6"
        :api="api"
        @confirm="confirm"
        @cancel="cancel">
      </app>
    </el-dialog>
  </div>
</template>
<script>
import App from './App'
import getRealnameInfo from './API/getRealnameInfo'

export default {
  data() {
    return {
      dialogVisible:false,
      api:{
        getRealnameInfo:getRealnameInfo
      },
      auth:{
        realnameinfoPermission:true,//获取实名认证
        cancelRealnameinfoPermission:true,//获取实名认证
        realnameinfoSavePermission:true,//实名认证操作

        baseinfoPermission:true,//获取基本信息
        editbaseinfoPermission:false,//保存基本信息

        eduInfoPermission:true,//获取教学背景
        editEduInfoPermission:false,//保存教学背景

        introduceInfoPerssion:true,//获取个人介绍信息
        auditingIntroduceInfoPermission:false,//个人介绍审核

        salaryInfoPermission:true,//获取薪资银行信息
        editSalaryPermission:false,//保存(编辑)薪资银行信息

        secretMessagePermission:true//获取加密信息
      }
    }
  },
  mounted:function(){
  },
  methods:{
    open(){
      this.dialogVisible = true;
    },
    confirm(){
      this.dialogVisible = false;
    },
    cancel(){
      this.dialogVisible = false;
    }
  },
  components:{
    App,
  }
}
</script>

<style scoped media="screen">
  .main{
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
