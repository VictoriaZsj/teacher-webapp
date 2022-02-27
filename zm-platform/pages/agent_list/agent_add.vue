<template>
  <div>
    <div class="content">
      <Spin size="large" fix v-if="tableLoading"></Spin>

        <el-row>
          <el-col :span="6">代理名称</el-col>
          <el-col :span="18">
              <el-input v-model="options.teaName" placeholder="输入代理姓名"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">代理类型</el-col>
          <el-col :span="18">
            <el-select multiple v-model="options.agentType" placeholder="请选择类型">
                <el-option label="1对1兼职" value="0"></el-option>
                <el-option label="1对1全职" value="2"></el-option>
                <el-option label="少儿兼职" value="3"></el-option>
                <el-option label="少儿全职" value="4"></el-option>
                <el-option label="陪练" value="5"></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">手机号</el-col>
          <el-col :span="18">
              <el-input class="white-input" :disabled="isUpdate" @blur="getBankAccountByTel" v-model="options.mobile" placeholder="输入手机号"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">开户银行</el-col>
          <el-col :span="18">
            <el-select v-model="options.bankName" placeholder="请选择">
                 <el-option label="中国工商银行" value="中国工商银行">中国工商银行</el-option>
                 <el-option label="中国农业银行" value="中国农业银行">中国农业银行</el-option>
                 <el-option label="中国银行" value="中国银行">中国银行</el-option>
                 <el-option label="中国建设银行" value="中国建设银行">中国建设银行</el-option>
                 <el-option label="交通银行" value="交通银行">交通银行</el-option>
                 <el-option label="中信银行" value="中信银行">中信银行</el-option>
                 <el-option label="中国光大银行" value="中国光大银行">中国光大银行</el-option>
                 <el-option label="华夏银行" value="华夏银行">华夏银行</el-option>
                 <el-option label="中国民生银行" value="中国民生银行">中国民生银行</el-option>
                 <el-option label="广发银行" value="广发银行">广发银行</el-option>
                 <el-option label="平安银行" value="平安银行">平安银行</el-option>
                 <el-option label="招商银行" value="招商银行">招商银行</el-option>
                 <el-option label="兴业银行" value="兴业银行">兴业银行</el-option>
                 <el-option label="浦发银行" value="浦发银行">浦发银行</el-option>
                 <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行">中国邮政储蓄银行</el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">银行卡信息</el-col>
          <el-col :span="18">
            <el-input v-model="options.bankAccount" placeholder="输入卡号"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">开户城市</el-col>
          <el-col :span="18">
            <el-select class="city-select" v-model="options.bankProvince" placeholder="请选择省份">
              <el-option
                v-for="(item,index) in proData"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-select class="city-select" v-model="options.bankCity" placeholder="请选择市">
              <el-option
                v-for="(item,index) in cityData"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">开户支行</el-col>
          <el-col :span="18">
            <el-input v-model="options.bankBranch" placeholder="输入支行"></el-input>
          </el-col>
        </el-row>

        <el-row v-show="is_in_agent">
          <el-col :span="6">代理学校</el-col>
          <el-col :span="18">
            <el-input v-model="options.agency_school" placeholder="输入代理学校"></el-input>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="6">生成代理报名链接:</el-col>
        </el-row>

        <el-row v-show="options.agentType.indexOf('0') != -1">
          <el-col class="agentUrlTitle" :span="6">1对1兼职代理链接:</el-col>
          <el-col :span="18">
            {{agentDomain}}mobile/teacher-register?from={{encodeURIComponent(options.teaName)}}
          </el-col>
        </el-row>

        <el-row v-show="options.agentType.indexOf('2') != -1">
          <el-col class="agentUrlTitle" :span="6">1对1全职代理链接:</el-col>
          <el-col :span="18">
            {{agentDomain}}mobile/teacher-register?wechat_account=zmforum&from={{encodeURIComponent(options.teaName)}}
          </el-col>
        </el-row>

        <el-row v-show="options.agentType.indexOf('3') != -1">
          <el-col class="agentUrlTitle" :span="6">少儿兼职代理链接:</el-col>
          <el-col :span="18">
            {{agentPeilianDomain}}teacher-register/kid?from={{encodeURIComponent(options.teaName)}}&requestInfo={{aesEscape(options.mobile)}}
          </el-col>
        </el-row>

        <el-row v-show="options.agentType.indexOf('4') != -1">
          <el-col class="agentUrlTitle" :span="6">少儿全职代理链接:</el-col>
          <el-col :span="18">
            {{agentDomain}}mobile/teacher-register?wechat_account=zmforum&from={{encodeURIComponent(options.teaName)}}
          </el-col>
        </el-row>

        <el-row v-show="options.agentType.indexOf('5') != -1">
          <el-col class="agentUrlTitle" :span="6">陪练代理链接:</el-col>
          <el-col :span="18">
            {{agentPeilianDomain}}teacher-register/peilian/?from={{encodeURIComponent(options.teaName)}}&requestInfo={{aesEscape(options.mobile)}}
          </el-col>
        </el-row>


    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
const agentDomain = ENV.agentDomain;
const agentPeilianDomain = ENV.agentPeilianDomain;
const _aesKey = ENV.aesKey;

import getProvinces from '../../api/select/getProvinces'
import getCitys from '../../api/select/getCitys'
import getBankAccount from '../../api/select/getBankAccount'
import addOperatingAgent from '../../api/action/addOperatingAgent'
import getAgent from '../../api/select/getAgent'
import updateOperatingAgent from '../../api/action/updateOperatingAgent'

var CryptoJS = require("crypto-js");
var aesKey = CryptoJS.enc.Utf8.parse(_aesKey);

export default {
    data() {
        return {
            buttonState:false,
            tableLoading:false,
            is_in_agent:false,//是否是内部代理
            proData:[],
            cityData:[],
            waitShowPro:'',
            waitShowCity:'',
            agentDomain:agentDomain,
            agentPeilianDomain:agentPeilianDomain,
            options:{
              teaName:'',//代理名称
              agentType:[],//代理类型
              mobile:'',//手机号
              bankName:'',//银行名称
              bankAccount:'',//银行账号
              bankProvince:'',//开户省
              bankCity:'',//开户市
              bankBranch:'',//开户支行
              agency_school:''//代理学校
            }
        }
    },
    props:{
        viewState:false,//false表示页面关闭，true表示页面展开
        teaId:null,
        type:null//1 是内部 2是外部 默认为1
    },
    computed:{
      isUpdate(){
        return this.teaId != null && this.teaId != "" && typeof this.teaId != "undefined";
      }
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }else{
          //判断是否是修改
          this.getUserMes();
        }
      },
      "options.bankProvince":function(name){
        this.getCityData(this.getProId(name));
      }
    },
    methods:{
        getProId (name){
          let id = "";
          for(let i = 0; i < this.proData.length; i++){
            if(this.proData[i].name == name){
              id = this.proData[i].id;
              break;
            }
          }
          return id;
        },
        aesEscape(tel){
          var encrypPwd = CryptoJS.AES.encrypt(tel, aesKey, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                      });
          return encodeURIComponent(encrypPwd.toString());
        },
        getUserMes(){
          if(this.teaId != null && this.teaId != "" && typeof this.teaId != "undefined"){
            //获取用户信息
            this.tableLoading = true;
            getAgent({agentId:this.teaId}).then(data => {
              this.tableLoading = false;
              this.is_in_agent = !!data.teaId;//如果是内部代理则显示学校,否则隐藏学校
              this.options.bankName = data.bankName;
              this.options.bankAccount = data.bankAccount;
              this.options.bankBranch = data.bankBranch;
              this.options.teaName = data.teaName;
              if(data.agentType != null && data.agentType != ""){
                let list = data.agentType.split(',');
                this.options.agentType = list.reverse();
              }
              this.options.mobile = data.mobile;
              if(this.proData.length == 0){
                this.waitShowPro = data.bankProvince;
                this.waitShowCity = data.bankCity;
              }else{
                if(this.options.bankProvince == data.bankProvince){
                  this.options.bankCity = data.bankCity;
                }else{
                  this.options.bankProvince = data.bankProvince;
                  this.waitShowCity = data.bankCity;
                }
              }
            }).catch(message => {
              this.$Message({
                  message
              });
              this.tableLoading = false;
            });
          }
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            this.buttonState = true;
            let parm = {};
            Object.assign(parm,this.options);
            parm.agentType = parm.agentType.toString();
            if(this.is_in_agent == false){//如果不是内部代理 则去掉学校
              delete parm.agency_school;
            }
            if(this.teaId != null && this.teaId != "" && typeof this.teaId != "undefined"){
              parm.id = this.teaId;
              updateOperatingAgent(parm).then(data => {
                this.$Message({
                    message:"修改成功"
                });
                this.buttonState = false;
                this.$emit("confirm");
              }).catch(message => {
                this.$Message({
                    message:message
                });
                this.buttonState = false;
              });
            }else{
              addOperatingAgent(parm).then(data => {
                this.$Message({
                    message:"添加成功"
                });
                this.buttonState = false;
                this.$emit("confirm");
              }).catch(message => {
                this.$Message({
                    message:message
                });
                this.buttonState = false;
              });
            }
        },
        getProData () {
          getProvinces().then(data => {
            this.proData = data;
            if(this.waitShowPro){
              this.options.bankProvince = this.waitShowPro;
              this.waitShowPro = '';
            }
          }).catch(message => {
            this.$Message({
                message
            });
          })
        },
        getCityData (id) {
          if(!id){
            return;
          }
          getCitys({provinceId:id}).then(data => {
            this.cityData = data;
            if(this.waitShowCity){
              this.options.bankCity = this.waitShowCity;
              this.waitShowCity = '';
            }
          }).catch(message => {
            this.$Message({
                message
            });
          })
        },
        clearMes () {
          this.is_in_agent = false
          this.options.bankName = "";
          this.options.bankAccount = "";
          this.options.bankBranch = "";
          this.waitShowPro = "";
          this.waitShowCity = "";
          this.options.bankProvince = "";
          this.options.bankCity = "";
        },
        getBankAccountByTel () {
          getBankAccount({mobile:this.options.mobile}).then(data => {
            if(!data){
              this.clearMes();
              return;
            }
            this.is_in_agent = !!data.teaId;//如果是内部代理则显示学校,否则隐藏学校
            this.options.bankName = data.bankName;
            this.options.bankAccount = data.bankAccount;
            this.options.bankBranch = data.bankBranch;
            if(this.proData.length == 0){
              this.waitShowPro = data.bankProvince;
              this.waitShowCity = data.bankCity;
            }else{
              if(this.options.bankProvince == data.bankProvince){
                this.options.bankCity = data.bankCity;
              }else{
                this.options.bankProvince = data.bankProvince;
                this.waitShowCity = data.bankCity;
              }
            }
          }).catch(message => {
            this.clearMes();
          })
        },
        default () {
          this.options = {
            teaName:'',//代理名称
            agentType:[],//代理类型
            mobile:'',//手机号
            bankName:'',//银行名称
            bankAccount:'',//银行账号
            bankProvince:'',//开户省
            bankCity:'',//开户市
            bankBranch:''//开户支行
          };
          this.waitShowPro = '';
          this.waitShowCity = '';
          this.buttonState = false;
        }
    },
    mounted:function(){
      this.getProData();
      this.getUserMes();
    }
}
</script>
<style scoped>
    .content{
      overflow-y: auto;
    }
    .control{
      text-align: right;
      padding-top: 20px;
      background-color: #f4f5f5;
    }
    .el-row{
        padding: 10px;
    }
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
    .el-select{
      width: 100%;
    }
    .city-select{
      width: 49%;
    }
    .agentUrlTitle{
      text-align: right;
      padding-right: 10px;
    }
</style>
