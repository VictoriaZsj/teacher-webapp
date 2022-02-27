<template>
<div id="salaryAndPay" class="basic-tab-item">
  <div v-if="!statueText">
    <div class="basic-tab-item-content">
      <el-form :inline="true" class="basic-message-form" label-position="left" label-width="80px">
        <el-form-item label="讲师等级">
          <el-select  v-model="salaryAnPaylData.rating" placeholder="请选择">
            <el-option v-for="(item,index) in trainLevelData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="老师档次">
          <el-input :disabled="true" v-model="salaryAnPaylData.teaRank"></el-input>
        </el-form-item>

        <el-form-item v-if="salaryAnPaylData.teaBu != '3' && (salaryAnPaylData.timeType == '1' || salaryAnPaylData.timeType == '2' || salaryAnPaylData.timeType == '4')" label="职位类型">
          <el-select v-model="salaryAnPaylData.positionType" placeholder="请选择">
            <el-option label="坐班" :value="1"></el-option>
            <el-option label="非坐班" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="(salaryAnPaylData.timeType == '1' || salaryAnPaylData.timeType == '2' || salaryAnPaylData.timeType == '4')" label="基本薪资">
          <el-select v-model="salaryAnPaylData.monthSalary" placeholder="请选择">
            <el-option v-for="(item,index) in salaryList" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="120px" v-if="teaStatue >= 6" label="是否缴纳社保">
          <el-select style="width:160px; overflow:hidden;" v-model="salaryAnPaylData.socialSecurity" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="teaStatue >= 5 && salaryAnPaylData.teaBu !== '3'" label="老师类型">
          <el-select v-model="salaryAnPaylData.teaType" placeholder="请选择">
            <el-option label="无" :value="0"></el-option>
            <el-option label="测评师" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="teaStatue >= 5 && salaryAnPaylData.teaBu === '3'" label="老师类型">
          <el-select v-model="salaryAnPaylData.teaType" placeholder="请选择">
            <el-option label="无" :value="0"></el-option>
            <el-option label="测评师" :value="1"></el-option>
            <el-option label="专职" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="(salaryAnPaylData.timeType == '0' || salaryAnPaylData.timeType == '3')" label="基本薪资">
          <el-select v-model="salaryAnPaylData.payroll" placeholder="请选择">
            <el-option v-for="(item,index) in salaryList" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开户省">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.bankProvince" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item label="开户市">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.bankCity" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item label="开户银行">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.bankName" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item label="银行支行">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.bankBranch" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item label="银行账号">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.bankAccount" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <el-form-item label="支付宝号">
          <dami-pwd-input disabled="disabled" :show="viewState" v-model="salaryAnPaylData.alipayAccount" :permission="secretMessagePermission"></dami-pwd-input>
        </el-form-item>
        <div>
          <el-form-item label="备注信息"></el-form-item>
        </div>
        <div>
          <el-input type="textarea" :rows="6" size="medium" v-model="salaryAnPaylData.remark"></el-input>
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
import updateSalaryAnPay from './API/updateSalaryAnPay'
import getSalaryInfo from './API/getSalaryInfo'
import getTeaLevel from './API/getTeaLevel'

export default {
  data() {
    return {
      salaryAnPaylData: {},
      trainLevelData: [],
      salaryList: [],
      viewState: false,
      confirmState: false,
      API:{
        updateSalaryAnPay:null,
        getSalaryInfo:null,
        getTeaLevel:null
      },
      statueText:"正在加载..."
    }
  },
  props: [
    'tea-id',
    'tea-statue',
    'salary-info-permission',//获取薪资支付(权限)
    'edit-salary-permission',//修改薪资支付(权限)
    'secret-message-permission',//机密信息(权限)
    'update-salary-an-pay',//修改基本薪资
    'get-salary-info',//获取基本薪资
    'get-tea-level'//获取教师等级
  ],
  computed: {
    levelDisabled() {
      if (this.salaryAnPaylData.teaBu == "1") {
        return true;
      }
      if (this.salaryAnPaylData.teaBu == "2") {
        return true;
      }
      if (this.salaryAnPaylData.teaBu == "3") {
        return false;
      }
    }
  },
  components: {
    damiPwdInput
  },
  mounted: function() {
    this.apiSetting();
    this.getData();
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.saveData();
    },
    getData() {
      if(!this.salaryInfoPermission){
        this.statueText = "您暂时没有权限获取薪资数据";
        return;
      }
      this.statueText = "";
      this.$BMloading("salaryAndPay")
      this.API.getSalaryInfo({
        teaId: this.teaId
      }).then(data => {
        this.salaryAnPaylData = data;

        if(isNaN(this.salaryAnPaylData.socialSecurity) == false && this.salaryAnPaylData.socialSecurity != null && this.salaryAnPaylData.socialSecurity != ""){
          this.salaryAnPaylData.socialSecurity = parseInt(this.salaryAnPaylData.socialSecurity)
        }
        if(isNaN(this.salaryAnPaylData.teaType) == false && this.salaryAnPaylData.teaType != null && this.salaryAnPaylData.teaType != ""){
          this.salaryAnPaylData.teaType = parseInt(this.salaryAnPaylData.teaType)
        }

        this.$BMloadingFinish("salaryAndPay")
        this.initOtherData();
      }).catch(message => {
        this.statueText = "暂无数据"
        this.$Message({
          message: message
        });
        this.salaryAnPaylData = {};
        this.$BMloadingFinish("salaryAndPay")
        console.log("getSalaryInfo异常:", message)
      })
    },
    saveData() {
      if(!this.editSalaryPermission){
        this.$Message({
          message: "您暂时没有权限修改薪资数据"
        });
        return;
      }
      this.confirmState = true;
      let parm = {};
      parm.teaId = this.teaId;
      parm.rating = this.salaryAnPaylData.rating;
      parm.teaRank = this.salaryAnPaylData.teaRank;
      parm.positionType = this.salaryAnPaylData.positionType;
      parm.monthSalary = this.salaryAnPaylData.monthSalary;
      parm.payroll = this.salaryAnPaylData.payroll;
      parm.bankProvince = this.salaryAnPaylData.bankProvince;
      parm.bankCity = this.salaryAnPaylData.bankCity;
      parm.bankName = this.salaryAnPaylData.bankName;
      parm.bankBranch = this.salaryAnPaylData.bankBranch;
      parm.bankAccount = this.salaryAnPaylData.bankAccount;
      parm.alipayAccount = this.salaryAnPaylData.alipayAccount;
      parm.remark = this.salaryAnPaylData.remark;
      parm.socialSecurity = this.salaryAnPaylData.socialSecurity;
      parm.teaType = this.salaryAnPaylData.teaType;
      if(!!this.salaryAnPaylData._data){
        parm._data = this.salaryAnPaylData._data;
      }

      this.API.updateSalaryAnPay(parm).then(data => {
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
        console.log("updateSalaryAnPay异常:", message)
      })
    },
    initOtherData() {
      this.initTrainLevelData();
      this.initSalaryData();
    },
    initSalaryData() {
      if (this.salaryAnPaylData.timeType == 1 || this.salaryAnPaylData.timeType == 4) {
        this.salaryList = [
          {
            value: "3200",
            text: "3200" //0级
          }, {
            value: "3600",
            text: "3600" //1级
          }, {
            value: "4000",
            text: "4000" //2级
          }, {
            value: "4400",
            text: "4400" //3级
          }, {
            value: "4800",
            text: "4800" //4级
          }, {
            value: "5200",
            text: "5200" //5级
          }, {
            value: "5600",
            text: "5600" //6级
          }, {
            value: "6000",
            text: "6000" //7级
          }, {
            value: "6400",
            text: "6400" //8级
          }, {
            value: "6800",
            text: "6800" //9级
          }
        ];
      } else if (this.salaryAnPaylData.timeType == 2) {
        this.salaryList = [{
          value: 1200,
          text: "实习工资"
        }];
      }
    },
    initTrainLevelData() {
      this.trainLevelData = [];
      let parm = {
        bu: this.salaryAnPaylData.teaBu,
        timeType: this.salaryAnPaylData.timeType
      };
      this.API.getTeaLevel(parm).then(data => {
        let _data = [];
        for (let i = 0; i < data.children.length; i++) {
          _data.push({
            value: data.children[i].value + "",
            label: data.children[i].label
          })
        }
        this.trainLevelData = _data;
      }).catch(message => {
        console.log("getTeaLevel异常:",message)
        this.$Message({
          message
        });
      });
    },
    apiSetting(){
      if(!!this.updateSalaryAnPay){
        this.API.updateSalaryAnPay = this.updateSalaryAnPay;
      }else{
        this.API.updateSalaryAnPay = updateSalaryAnPay;
      }
      if(!!this.getSalaryInfo){
        this.API.getSalaryInfo = this.getSalaryInfo;
      }else{
        this.API.getSalaryInfo = getSalaryInfo;
      }
      if(!!this.getTeaLevel){
        this.API.getTeaLevel = this.getTeaLevel;
      }else{
        this.API.getTeaLevel = getTeaLevel;
      }
    }
  }
}
</script>
<style scoped media="screen">
  /* .el-button{
    padding: 0 20px;
  } */
</style>
