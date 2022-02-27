<template>
  <el-dialog :title="id?'编辑':'新增'" v-model="dialogVisible" width="100%" @close="resetForm">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item class="is-required" label="渠道名称">
        <el-input v-model.trim="ruleForm.teaName"></el-input>
      </el-form-item>
      <el-form-item
        class="is-required"
        label="手机号"
        v-if="[1,2,3,4,5,6,7,8,9].includes(ruleForm.channelType)"
      >
        <el-input v-model="ruleForm.mobile" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item class="is-required" label="渠道类型">
        <el-select v-model="ruleForm.channelType" >
          <el-option :label="item.label"
                     :value="item.value"
                     :key="index"
                     v-for="(item,index) in channelType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行卡信息" v-if="[1,2,3,4,5,6,7,8,9].includes(ruleForm.channelType)">
        <el-input v-model="ruleForm.bankAccount"></el-input>
      </el-form-item>
      <el-form-item label="开户城市" v-if="[1,2,3,4,5,6,7,8,9].includes(ruleForm.channelType)">
        <el-select v-model="ruleForm.bankProvince" @change="provincesChange" placeholder="选择省">
          <el-option
            v-for="(item,index) in provincesList"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
        <el-select v-model="ruleForm.bankCity" placeholder="选择市">
          <el-option
            v-for="(item,index) in cityList"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户行" v-if="[1,2,3,4,5,6,7,8,9].includes(ruleForm.channelType)">
        <el-select v-model="ruleForm.bankName">
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
      </el-form-item>
      <el-form-item label="开户支行" v-if="[1,2,3,4,5,6,7,8,9].includes(ruleForm.channelType)">
        <el-input v-model="ruleForm.bankBranch"></el-input>
      </el-form-item>
      <el-form-item class="is-required" label="是否长期合作" v-if="[3,4,6,7,8].includes(ruleForm.channelType)">
        <el-radio-group v-model="ruleForm.isPersistence" @change="isPersistenceChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="合作起止时间"
        v-if="[3,4,6,7,8].includes(ruleForm.channelType)&&ruleForm.isPersistence===1"
      >
        <el-date-picker
          style="width:270px;"
          v-model="cooperationTime"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="下次投放时间" v-if="[3,4,6,7,8].includes(ruleForm.channelType)">
        <el-date-picker v-model="ruleForm.nextPutTime" clearable type="date"></el-date-picker>
      </el-form-item>
      <el-form-item class="is-required" label="合作费用" v-if="[3,4,6,7,8].includes(ruleForm.channelType)">
        <el-input type="number" v-model="ruleForm.cooperationFee"></el-input>元
      </el-form-item>
      <el-form-item class="is-required" label="跟进人" v-if="[3,4,6,7,8].includes(ruleForm.channelType)">
        <el-select
          v-model="ruleForm.follower"
          filterable
          remote
          reserve-keyword
          placeholder="请输入跟进人姓名"
          no-data-text="用户不存在，请确认输入的姓名是否正确，是否存在OA框架中"
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="item in followerList"
            :key="item.userId"
            :label="item.personName+'('+item.mobile+')'"
            :value="item.userId+'&&&'+item.personName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" :maxlength="120"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getNotAttrWithEmpty } from "./../../../../src/utils/assist";

export default {
  name: "",
  props:{
    editRow:{
      type:Object,
      default:{}
    },
    channelType:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        teaName: "",
        mobile: "",
        channelType: "0",
        bankAccount: "",
        bankProvince: "",
        bankCity: "",
        bankName: "",
        bankBranch: "",
        isPersistence: "",
        remark: "",
        nextPutTime: "",
        cooperationFee: "",
        follower: ""
      },
      cooperationTime: [],
      provincesList: [],
      cityList: [],
      followerList: [],
      id: "",
      first: false
    };
  },
  watch: {
    "ruleForm.channelType": function(_new) {
      if (!this.first) {
        this.channelTypeChange(_new);
      }
      this.first = false;
    }
  },
  methods: {
    // 获取渠道对应手机号
    async show(row) {
      this.dialogVisible = true;
      this.provincesList = await this.getProvinces();
      if (row) {
        this.first = true;
        this.id = row.id;
        this.ruleForm.teaName = row.teaName;
        this.ruleForm.channelType = String(row.channelType);
        this.ruleForm.bankAccount = row.bankAccount;
        this.ruleForm.bankProvince = row.bankProvince;
        this.ruleForm.bankCity = row.bankCity;
        this.ruleForm.bankName = row.bankName;
        this.ruleForm.bankBranch = row.bankBranch;
        this.ruleForm.isPersistence = row.isPersistence;
        this.ruleForm.remark = row.remark;
        this.ruleForm.cooperationFee = row.cooperationFee;
        this.ruleForm.follower = row.followerId+'&&&'+ row.follower;
        this.ruleForm.mobile =this.editRow.mobile;
        if (row.bankCity) this.getCity(row.bankProvince);
        this.ruleForm.nextPutTime = row.nextPutTime
          ? new Date(row.nextPutTime)
          : "";
        this.cooperationTime = [
          new Date(row.startTime && row.startTime.slice(0, 19)),
          new Date(row.endTime && row.endTime.slice(0, 19))
        ];
      }
    },
    channelTypeChange(val) {
      if ([0].includes(val)) {
        this.ruleForm.mobile = "";
        this.ruleForm.bankAccount = "";
        this.ruleForm.bankProvince = "";
        this.ruleForm.bankCity = "";
        this.ruleForm.bankName = "";
        this.ruleForm.bankBranch = "";
        this.ruleForm.isPersistence = "";
        this.ruleForm.nextPutTime = "";
        this.ruleForm.cooperationFee = "";
        this.ruleForm.follower = "";
        this.cooperationTime = [];
      } else if ([1, 2, 5, 9].includes(val)) {
        this.ruleForm.isPersistence = "";
        this.ruleForm.nextPutTime = "";
        this.ruleForm.cooperationFee = "";
        this.ruleForm.follower = "";
        this.cooperationTime = [];
      } else {
        this.ruleForm.isPersistence = 1;
      }
    },
    isPersistenceChange() {
      this.cooperationTime = [];
    },
    remoteMethod(query) {
      if(query){
        this.queryFollower(query);
      }else{
        this.followerList = [];
      }
    },
    queryFollower(inputMsg) {
      inputMsg = inputMsg.includes('&&&')?inputMsg.split('&&&')[1]:inputMsg;
      inputMsg = inputMsg.includes('(')?inputMsg.split('(')[0]:inputMsg;
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/agentMember/queryOaPerson",
        method: "post",
        data: {
          inputMsg,
          pageNo: 1,
          pageSize: 20
        }
      })
        .then(res => {
          if (res.msgCode === "200") {
            this.followerList = res.data.content;
          } else {
            this.followerList = [];
            this.$Message.error(res.msgContent);
          }
        })
        .catch(err => {
          this.$Message({
            type: "error",
            message: err
          });
        });
    },
    submitForm() {
      //验证必填项
      const _channelType = this.ruleForm.channelType;
      if (!this.ruleForm.teaName) {
        return this.$Message.warning("请填写渠道名称");
      }
      if ([1, 2, 5].includes(_channelType) && !this.ruleForm.mobile) {
        return this.$Message.warning("请填写手机号");
      } else if ([3, 4, 6, 7, 8].includes(_channelType)) {
        if (!this.ruleForm.mobile) {
          return this.$Message.warning("请填写必填项");
        } else if (!this.ruleForm.cooperationFee) {
          return this.$Message.warning("请填写合作费用");
        } else if (!this.ruleForm.follower) {
          return this.$Message.warning("请填写跟进人");
        }
      }
      this.submitFormFun();
    },
    submitFormFun() {
      let startTime = "";
      let endTime = "";
      if (this.cooperationTime[0]) {
        startTime = +this.cooperationTime[0];
        endTime = +this.cooperationTime[1];
      } else {
        startTime = "";
        endTime = "";
      };
      let followerId = '';
      let follower = '';
      if (this.ruleForm.follower) {
        followerId = this.ruleForm.follower.split('&&&')[0];
        follower = this.ruleForm.follower.split('&&&')[1];
      } else {
        follower = "";
      }
      const nextPutTime = this.ruleForm.nextPutTime
        ? +this.ruleForm.nextPutTime
        : "";
      this.$Fetch({
        url: this.id
          ? "/api/zm-teacher-recruit-web/api/agentMember/updateByChannelId"
          : "/api/zm-teacher-recruit-web/api/agentMember/addOperatingAgent",
        method: "post",
        data: getNotAttrWithEmpty({
          ...this.ruleForm,
          startTime,
          endTime,
          nextPutTime,
          id: this.id,
          followerId,
          follower
        })
      })
        .then(res => {
          if (res.msgCode === "200") {
            this.$Message.success("操作成功");
            this.dialogVisible = false;
            this.resetForm("ruleForm");
            this.$emit("successBack");
          } else {
            this.$Message.error(res.msgContent);
          }
        })
        .catch(err => {
          this.$Message({
            type: "error",
            message: err
          });
        });
    },
    resetForm() {
      this.dialogVisible = false;
      this.ruleForm = {
        teaName: "",
        mobile: "",
        channelType: "0",
        bankAccount: "",
        bankProvince: "",
        bankCity: "",
        bankName: "",
        bankBranch: "",
        isPersistence: "",
        remark: "",
        nextPutTime: "",
        cooperationFee: "",
        follower: ""
      };
      this.cooperationTime = [];
      this.id = "";
    },
    //获取省 市
    getProvinces() {
      return new Promise((resolve, reject) => {
        this.$Fetch({
          url: "/api/getProvinces",
          method: "get"
        })
          .then(res => {
            if (res.code === "0") {
              resolve(res.data);
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(err => {
            this.$Message({
              type: "error",
              message: err
            });
          });
      });
    },
    provincesChange(val) {
      this.ruleForm.bankCity = "";
      this.getCity(val);
    },
    getCity(val) {
      const province = this.provincesList.filter(item => {
        return item.name === val;
      });
      this.$Fetch({
        url: "/api/getCitys",
        method: "get",
        params: {
          provinceId: province[0].id
        }
      })
        .then(res => {
          if (res.code === "0") {
            this.cityList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(err => {
          this.$Message({
            type: "error",
            message: err
          });
        });
    }
  }
};
</script>

<style lang='less' scoped>
.el-input,.el-select {
  width: 200px;
}
.el-form-item {
  margin-bottom: 20px;
}
</style>
