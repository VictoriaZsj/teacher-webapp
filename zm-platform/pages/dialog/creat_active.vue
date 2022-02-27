<template>
  <el-dialog :title="titleFrom" class="spectial" v-model="dialogVisible" :close-on-click-modal="false">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动名称：" prop="activitytitle">
        <el-input v-model="ruleForm.activitytitle" :maxlength="100" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="渠道类型：" prop="channelTypes">
        <el-select v-model="ruleForm.channelTypes" multiple placeholder="请选择活动区域">
          <el-option
            v-for="(item,index) in channelType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="BU：" prop="bu">
        <el-select v-model="ruleForm.bu" multiple placeholder="请选择bu">
          <el-option
            v-for="(item,index) in bu_type"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师性质：" prop="timetypes">
        <el-select v-model="ruleForm.timetypes" placeholder="请选择老师性质">
          <el-option
            v-for="(item,index) in timetypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动开始时间：" prop="activitystarttime">
        <zm-datepicker type="second" v-model="ruleForm.activitystarttime"></zm-datepicker>
      </el-form-item>
      <el-form-item label="活动结束时间：" prop="activityendtime">
        <zm-datepicker type="second" v-model="ruleForm.activityendtime"></zm-datepicker>
      </el-form-item>
      <el-form-item label="活动奖励规则：" prop="ruleIds">
        <el-select v-model="ruleForm.ruleIds" multiple placeholder="请选择活动奖励规则">
          <el-option
            v-for="(item,index) in active_award"
            :key="index"
            :label="item.ruleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="奖励截止天数：" prop="delaydays" class="is-required">
        <el-input v-model.number="ruleForm.delaydays" placeholder="请输入奖励截止天数"></el-input>
      </el-form-item>
      <el-form-item label="活动介绍链接：" prop="linkid">
        <el-select v-model="ruleForm.linkid" placeholder="请选择活动介绍链接">
          <el-option
            v-for="(item,index) in linkIdList"
            :key="index"
            :label="item.linkname"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
const bu_type = [
  {
    label: "掌门1对1",
    value: "1"
  },
  {
    label: "掌门少儿",
    value: "2"
  },
  {
    label: "掌门陪练",
    value: "3"
  },
  {
    label: "掌门优课",
    value: "5"
  }
];
const timetypeList = [
  {
    label: "兼职",
    value: "0"
  },
  {
    label: "全职",
    value: "1"
  },
  {
    label: "校招全职",
    value: "2"
  }
];
export default {
  data() {
    var checkDelaydays = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请设置正确的奖励截止天数"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (0 < value && 365 < value) {
            callback(new Error("必须输入0~365之间的正整数"));
          } else {
            callback();
          }
        }
      }, 500);
    };
    return {
      dialogVisible: false,
      titleFrom: "新增",
      bu_type: bu_type,
      timetypeList: timetypeList,
      active_award: [],
      ruleIdsList: "",
      linkIdList: [],
      ruleForm: {
        id: "",
        activitytitle: "",
        channelTypes: ['1'],
        bu: [],
        timetypes: "",
        activitystarttime: "",
        activityendtime: "",
        ruleIds: [],
        delaydays: "",
        linkid: ""
      },
      isEdit: "",
      rules: {
        activitytitle: [
          { required: true, message: "请设置正确的活动名称", trigger: "blur" }
        ],
        channelTypes: [
          {
            type: "array",
            required: true,
            message: "请设置正确的渠道类型",
            trigger: "change"
          }
        ],
        bu: [
          {
            type: "array",
            required: true,
            message: "请设置正确的bu",
            trigger: "change"
          }
        ],
        timetypes: [
          {
            required: true,
            message: "请设置正确的老师性质",
            trigger: "change"
          }
        ],
        activitystarttime: [
          {
            required: true,
            message: "请设置正确的活动开始时间",
            trigger: "change"
          }
        ],
        activityendtime: [
          {
            required: true,
            message: "请设置正确的活动结束时间",
            trigger: "change"
          }
        ],
        ruleIds: [
          {
            type: "array",
            required: true,
            message: "请设置正确的活动奖励规则",
            trigger: "change"
          }
        ],
        delaydays: [
          {
            validator: checkDelaydays,
            trigger: "blur"
          }
        ],
        linkid: [
          {
            type: "number",
            required: true,
            message: "请设置正确的活动介绍链接",
            trigger: "change"
          }
        ]
      }
    };
  },
  props:{
    channelType:{
      type:Array,
      default:[]
    }
  },
  computed: {},
  methods: {
    init() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
      this.dialogVisible = true;
      this.titleFrom = "新增";
      this.isEdit = '';
      this.ruleForm.activitytitle = "";
      this.ruleForm.channelTypes = ['1'];
      this.ruleForm.bu = [];
      this.ruleForm.timetypes = "";
      this.ruleForm.activitystarttime = "";
      this.ruleForm.activityendtime = "";
      this.ruleForm.ruleIds = [];
      this.ruleForm.delaydays = "";
      this.ruleForm.linkid = "";
    },
    renderTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    editData(_edit, row) {
      this.dialogVisible = true;
      this.isEdit = _edit;
      this.titleFrom = "修改";
      this.ruleForm.id = row.id;
      this.ruleForm.activitytitle = row.activitytitle;
      this.ruleForm.channelTypes = row.channelTypes
        ? row.channelTypes.split(",")
        : [];
      this.ruleForm.bu = row.bus ? row.bus.split(",") : [];
      this.ruleForm.timetypes = row.timetypes;
      this.ruleForm.activitystarttime = this.renderTime(row.activitystarttime);
      this.ruleForm.activityendtime = this.renderTime(row.activityendtime);
      let _ruleIds = row.ruleIds ? row.ruleIds.split(",") : [];
      _ruleIds.map((item,index)=>{
        _ruleIds[index] = parseInt(_ruleIds[index]);
      })
      this.ruleForm.ruleIds = _ruleIds;
      this.ruleForm.delaydays = row.delaydays;
      this.ruleForm.linkid = row.linkid;
    },
    getQueryConfig() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/activity/queryConfig",
        method: "post",
        data: {
          ruleName: ""
        }
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.active_award = data.rewardRules;
        } else {
          this.$Message({
            message
          });
        }
      });
    },
    getAgentLinkList() {
      this.$Fetch({
        url: "/api/agent/agentLinkList?status=1",
        method: "get"
      }).then(result => {
        const data = result.data;
        const code = result.code;
        const message = result.message;
        if (code == 0) {
          this.linkIdList = data;
        } else {
          this.$Message({
            message
          });
        }
      });
    },
    //新增——处理数据
    dealWithData() {
      let _channelTypes = this.ruleForm.channelTypes.toString();
      let _bu = this.ruleForm.bu.toString();
      let _ruleIds = this.ruleForm.ruleIds.toString();
      let _activitystarttime = Date.parse(
        new Date(this.ruleForm.activitystarttime)
      );
      let _activityendtime = Date.parse(
        new Date(this.ruleForm.activityendtime)
      );
      let formData = {
        id: this.isEdit == "edit" ? this.ruleForm.id : "",
        activitytitle: this.ruleForm.activitytitle,
        channelTypes: _channelTypes,
        bus: _bu,
        timetypes: this.ruleForm.timetypes,
        activitystarttime: _activitystarttime,
        activityendtime: _activityendtime,
        ruleIds: _ruleIds,
        delaydays: this.ruleForm.delaydays,
        linkid: this.ruleForm.linkid
      };
      if (this.isEdit == "edit") {
        this.updateDealWith(formData);
      } else {
        this.addDealWith(formData);
      }
    },
    addDealWith(formData) {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/activity/add",
        method: "post",
        data: formData
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.$Message({
            message
          });
          this.dialogVisible = false;
          this.$parent.getTableData();
        } else {
          this.$Message({
            message
          });
        }
      });
    },
    //修改——数据处理
    updateDealWith(formData) {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/activity/update",
        method: "post",
        data: formData
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.$Message({
            message
          });
          this.dialogVisible = false;
          this.$parent.getTableData();
        } else {
          this.$Message({
            message
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dealWithData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    }
  },
  created() {},
  mounted() {
    this.getQueryConfig();
    this.getAgentLinkList();
  }
};
</script>
<style lang="less" rel="stylesheet/scss" scoped>
.demo-ruleForm {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less" rel="stylesheet/scss">
.spectial {
  .el-dialog__body,
  .el-dialog__footer {
    background-color: #fff;
  }
  .el-tag span{
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-tag{
    .el-icon-close{
      vertical-align: super;
    }
  }
}
</style>

