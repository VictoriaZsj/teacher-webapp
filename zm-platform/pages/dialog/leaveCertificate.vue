<template>
  <div>
    <div class="content">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <el-row>
        <el-col :span="4">身份证号</el-col>
        <el-col :span="20">
          <el-input
            style="width: 200px"
            v-model="options.idcardNo"
            placeholder="请输入身份证号"
          ></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">离职时间</el-col>
        <el-col :span="20">
          <!-- <zm-datepicker  type="hour" v-model="options.leaveTime"></zm-datepicker> -->
          <el-date-picker
            v-model="options.leaveTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">备注</el-col>
        <el-col :span="20">
          <el-input
            type="textarea"
            :rows="2"
            v-model="options.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary"
        >确定</el-button
      >
    </div>
  </div>
</template>
<script>
import sendLeaveCertificate from "../../api/action/sendLeaveCertificate";
import getTeacherIdcardNo from "../../api/select/getTeacherIdcardNo";

export default {
  data() {
    return {
      buttonState: false,
      tableLoading: false,
      options: {
        idcardNo: "",
        leaveTime: null,
        remark: "",
      },
    };
  },
  props: {
    currentID: null,
    currentName: null,
    viewState: false, //false表示页面关闭，true表示页面展开
    teacherLeaveTime: null, // 老师最后上课时间
  },
  watch: {
    teacherLeaveTime: {
      handler: function (val) {
        if (val) {
          this.options.leaveTime = val;
        }
      },
      immediate: true,
    },
    viewState(val) {
      if (!val) {
        this.default();
      } else {
        this.getTeacherIdcardNo();
      }
    },
  },
  mounted: function () {
    this.getTeacherIdcardNo();
  },
  methods: {
    getTeacherIdcardNo() {
      if (!this.currentID) {
        return;
      }
      this.tableLoading = true;
      let parm = {
        teaId: this.currentID,
      };
      getTeacherIdcardNo(parm)
        .then((data) => {
          this.tableLoading = false;
          this.options.idcardNo = data;
        })
        .catch((message) => {
          this.tableLoading = false;
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      if (!this.currentID) {
        this.$Message({
          message: "未选择教师",
        });
        return;
      }
      if (window.isEmpty(this.options.idcardNo)) {
        this.$Message({
          message: "请填写身份证号",
        });
        return;
      } else {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
        if (reg.test(this.options.idcardNo) == false) {
          this.$Message({
            message: "身份证格式不正确",
          });
          return;
        }
      }
      if (window.isEmpty(this.options.leaveTime)) {
        this.$Message({
          message: "请选择离职时间",
        });
        return;
      }

      let tip = `确定已经跟该老师 沟通过，确定从掌门离职吗？点击【确定】会给离职老师发一封离职证明，老师被拉入回收站，没收掌门产品登录权限`;
      if (!!this.currentName) {
        tip =
          "确定已经跟" +
          this.currentName +
          "老师 沟通过，确定从掌门离职吗？点击【确定】会给离职老师发一封离职证明，老师被拉入回收站，没收掌门产品登录权限";
      }
      this.$MessageBox
        .confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.buttonState = true;
          this.options.leaveTime = this.$DateTransform(
            +new Date(this.options.leaveTime),
            "yyyy-MM-dd 00:00:00"
          );
          Object.assign(this.options, { teaId: this.currentID });
          sendLeaveCertificate(this.options)
            .then((data) => {
              this.$emit("confirm");
              this.default();
            })
            .catch((message) => {
              this.$Message({
                message: message,
              });
              this.buttonState = false;
            });
        })
        .catch((message) => {});
    },
    default() {
      this.options = {
        idcardNo: "",
        leaveTime: "",
        remark: "",
      };
      this.buttonState = false;
    },
  },
};
</script>
<style scoped>
.content {
  max-height: 400px;
  overflow-y: visible;
  position: relative;
}
.control {
  text-align: right;
  padding-top: 20px;
  background-color: white;
}
.el-row {
  padding: 10px;
}
.el-row div:first-child {
  line-height: 30px;
}
.el-row:after {
  content: "";
  display: table;
  clear: both;
}
.trainTopicContent {
  line-height: 30px;
}
</style>
