<template>
<div id="baseInfo" class="basic-tab-item">
  <div v-if="!statueText">
    <div class="basic-tab-item-content">
      <el-form :inline="true"  class="basic-message-form" label-position="left">
        <el-form-item class="require" label="联系电话" label-width="80px">
          <span class="mobile-cursor" @click="showMobile('mobile')"
          v-if="!curUMobileSeen">点击获取手机号</span>
          <el-input v-if="curUMobileSeen" :disabled="baseInfo.isEditMobile ? false : true"
          v-model="baseInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item :class="!requirePermission&&teaStatue > 2 ? 'require' : ''"  label="性别" label-width="80px">
          <el-select v-model="baseInfo.teaGender" placeholder="请选择">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="不确定" value="" />
          </el-select>
        </el-form-item>
        <el-form-item :class="requirePermission||teaStatue > 2 ? 'require' : ''" label="讲师邮箱" label-width="80px">
          <el-input v-if="teaStatue < 5" v-model="baseInfo.email"></el-input>
          <dami-pwd-input v-else  v-model="baseInfo.email" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item :class="requirePermission||teaStatue > 2 ? 'require' : ''" label="讲师QQ" label-width="80px">
          <el-input v-if="teaStatue < 5" v-model="baseInfo.teaQq"></el-input>
          <dami-pwd-input v-else  v-model="baseInfo.teaQq" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item :class="requirePermission||teaStatue > 2 ? 'require' : ''" label="讲师微信" label-width="80px">
          <el-input v-if="teaStatue < 5" disabled="true" v-model="baseInfo.teaWeixin"></el-input>
          <dami-pwd-input v-else  v-model="baseInfo.teaWeixin" disabled="true" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item  label="现居住地" label-width="80px">
          <div class="address">
            <el-cascader width="100" :value="provinceCityCounty" :options="provinceCityCountyOptions" @change="handleProvinceCityCountyChange"></el-cascader>
            <el-input v-model="baseInfo.teaAddress" placeholder="详细地址"></el-input>
          </div>
        </el-form-item>
        <br />
        <el-form-item :class="!requirePermission&&teaStatue > 2 ? 'require' : ''" label="推荐人手机">
          <el-tooltip effect="dark" :disabled="!hoverString.length" placement="right">
            <div style="line-height: 20px;" slot="content"><div v-for="(item,i) in hoverString" :key="i">{{item}}<br/></div></div>
            <img class="hover-src" :src="hoverSrc" alt="">
          </el-tooltip>
          <span class="mobile-cursor" @click="showMobile('referMobile')"
          v-if="!refeMobileSeen">点击获取手机号</span>
          <el-input style="width: 90%;" v-if="refeMobileSeen" :disabled="true"
          v-model="baseInfo.teaReferrerMobile"></el-input>
        </el-form-item>
        <el-form-item :class="!requirePermission&&teaStatue > 6 ? 'require' : ''" label="紧急联系人姓名">
          <el-input v-model="baseInfo.emergencyContactName" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item :class="!requirePermission&&teaStatue > 6 ? 'require' : ''" label="紧急联系人关系">
          <el-input v-model="baseInfo.emergencyContactRelation"></el-input>
        </el-form-item>
        <el-form-item :class="!requirePermission&&teaStatue > 6 ? 'require' : ''" label="紧急联系人手机号">
          <span class="mobile-cursor" @click="showMobile('emergencyContactMobile')"
          v-if="!emergMobileSeen">点击获取手机号</span>
          <el-input v-if="emergMobileSeen" v-model="baseInfo.emergencyContact"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="备注"></el-form-item>
        <div>
          <el-input type="textarea" :rows="6" size="medium" v-model="baseInfo.hrMark"></el-input>
        </div>
      </el-form>
    </div>
    <div class="basic-tab-item-control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="confirmState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
  <div v-else class="basicinfo-no-data">
    {{statueText}}
  </div>
</div>
</template>
<script>
import damiPwdInput from 'dami-pwd-input'
import updateBasicInfo from './API/updateBasicInfo'
import basicInfo from './API/basicInfo';
import updateBasicInfoData from './API-Data/updateBasicInfoData';
import getTeaMobile from '../../../zm-platform/api/select/getTeaMobile'; // 查询手机号
import {getProvinceCityCounty} from '../../../zm-platform/api/common'

export default {
  data() {
    return {
      provinceCityCounty: [],
      provinceCityCountyOptions: [],
      provinceCityCountyProps: {
        value: 'label'
      },
      baseInfo: {
        emergencyContactMobile:''
      },
      requirePermission:this.pageInfo=='招师-兼职-面试管理-个人信息-基本信息',//限制该页面=>联系电话、讲师邮箱、讲师QQ、讲师微信必填，其他非必填
      confirmState: false,
      API:{
        updateBasicInfo:null,
        basicInfo:null
      },
      statueText:"正在加载...",
      emergMobileSeen: false, // 紧急联系人电话：是否已查询
      curUMobileSeen: false, // 用户电话：是否已查询
      refeMobileSeen: false, // 推荐人电话：是否已查询
      hoverSrc: require('../../../src/images/hover.png'),
      hoverString: [],
    }
  },
  mounted: function() {
    // 获取全国省市区三维数组
    getProvinceCityCounty().then(({data}) => {
      if (data.code === '0') {
        this.provinceCityCountyOptions = data.data || [];
      }
    });
    this.apiSetting();
    this.getData();
  },
  props: [
    'tea-statue',
    'tea-id',
    'cipherTId',
    'baseinfo-permission',//获取基本信息(权限)
    'editbaseinfo-permission',//修改基本信息(权限)
    'secret-message-permission',//机密信息(权限)
    'update-basic-info',//修改基本信息
    'basic-info',//获取基本信息，
    'page-info'//引用该组件的入口页面的信息
  ],
  methods: {
    // 获取老师手机号详情
    showMobile(type) {
      let parm = {
        teaId: this.teaId,
        infoType: type
      };
      getTeaMobile(parm).then(data => {
        if (data) {
          if (type === 'mobile') { // 老师联系电话
            this.curUMobileSeen = true;
            this.baseInfo.mobile = data;
          } else if (type === 'emergencyContactMobile') {
            this.emergMobileSeen = true;
            this.baseInfo.emergencyContactMobile = data;
          } else if (type === 'referMobile') {
            this.refeMobileSeen = true;
            this.baseInfo.teaReferrerMobile = data;
          }
        }
      }).catch(message => {
        this.$Message.error('未查询到手机号');
      });
    },
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.saveData();
    },
    getData() {
      if(!this.baseinfoPermission){
        this.statueText = "您暂时没有权限查看基本信息数据"
        return;
      }
      this.$BMloading("baseInfo")
      this.statueText = ""
      this.API.basicInfo({
        teaId: this.cipherTId
      }).then(data => {
        this.baseInfo = {
          ...this.baseInfo,
          ...data
        };
        const {teaProv, teaCity, teaArea} = this.baseInfo;
        if (teaProv && teaCity && teaArea) {
          this.provinceCityCounty = [teaProv, teaCity, teaArea];
        }
        this.$BMloadingFinish("baseInfo")
      }).catch(message => {
        this.$BMloadingFinish("baseInfo")
        this.$Message({
          message: message
        });
        this.baseInfo = {};
        this.statueText = "暂无数据"
        console.log("basicInfo异常:", message)
      })
      this.listRelease();
    },
    saveData() {
      if(!this.editbaseinfoPermission){
        this.$Message({
          message: "您暂时没有权限修改基本信息数据"
        });
        return;
      }
      //组织数据 字段不能多传，后端会报错
      let param = {};
      param.teaId = this.teaId;
      param.mobile = this.baseInfo.mobile;
      param.teaGender = this.baseInfo.teaGender;
      param.email = this.baseInfo.email;
      param.teaQq = this.baseInfo.teaQq;
      param.teaWeixin = this.baseInfo.teaWeixin;
      param.teaProv = this.baseInfo.teaProv;
      param.teaCity = this.baseInfo.teaCity;
      param.teaArea = this.baseInfo.teaArea;
      param.teaAddress = this.baseInfo.teaAddress;
      param.emergencyContactRelation = this.baseInfo.emergencyContactRelation;
      param.emergencyContact = this.baseInfo.emergencyContact;
      param.hrMark = this.baseInfo.hrMark;
      param.isEditMobile = this.baseInfo.isEditMobile;
      param.emergencyContactName = this.baseInfo.emergencyContactName;

      if(this.baseInfo._data){
        param._data = this.baseInfo._data;//回传旧数据
      }

      if(this.teaStatue > 2){
        let err = updateBasicInfoData(param,this.requirePermission)
        if(!!err){
          this.$Message({
            message: err
          });
          return;
        }
      }

      this.confirmState = true;
      this.API.updateBasicInfo(param).then(data => {
        this.confirmState = false;
        this.$Message({
          message: "操作成功"
        });
        this.$emit("confirm")
      }).catch(message => {
        this.confirmState = false;
        this.$Message({
          message: message
        });
        console.log("updateBasicInfo异常:", message)
      });
    },
    apiSetting(){
      if(!!this.updateBasicInfo){
        this.API.updateBasicInfo = this.updateBasicInfo;
      }else{
        this.API.updateBasicInfo = updateBasicInfo;
      }
      if(!!this.basicInfo){
        this.API.basicInfo = this.basicInfo;
      }else{
        this.API.basicInfo = basicInfo;
      }
    },
    listRelease() {
      if(!this.teaId) return
      this.$Fetch({
        url: '/api/zm-teacher-recruit-web/api/teaChannelRelease/listRelease',
        method: 'post',
        data: {teaId: this.teaId,},
      })
      .then((res) => {
        this.hoverString = [];
        const {code, data} = res;
        if(code==200 && data.length) {
          this.hoverString.push('推荐人记录（页面显示第一次推荐人）');
          data.forEach(r => {
            this.hoverString.push(
              `${r.triggerTime.substring(0,10)} ${r.channelName}，${r.channelMobile}`
            )
          });
        }
      })
    },
    handleProvinceCityCountyChange(val) {
      this.baseInfo.teaProv = val[0] || '';
      this.baseInfo.teaCity = val[1] || '';
      this.baseInfo.teaArea = val[2] || '';
    }
  },
  components: {
    damiPwdInput
  }
}
</script>
<style lang="less" media="screen">
.basic-tab-item{
  .mobile-cursor{
    cursor: pointer;
    color: #169bd5;
    width: 200px;
    display: inline-block;
  }
  .hover-src {
    height: 14px;
    cursor: pointer;
    position: relative;
    left: -4px;
    top: 2px;
  }
  .address{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .el-cascader{
      margin-right: 10px;
      line-height: 36px;
    }
    .el-input__inner{
      width: 100px !important;
    }
    .el-form-item__content {
      line-height: initial !important;
    }
  }
}
</style>

