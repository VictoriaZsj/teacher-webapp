<template>
  <el-dialog title="分享配置" class="spectial" v-model="shareSettingDialog" :close-on-click-modal="false">
    <el-form
      :model="shareForm"
      :rules="rules"
      ref="shareForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="分享标题" prop="sharetitle">
        <el-input type="textarea" v-model="shareForm.sharetitle" placeholder="请输入分享标题"></el-input>
      </el-form-item>
      <el-form-item label="分享内容" prop="sharecontent">
        <el-input type="textarea" v-model="shareForm.sharecontent" placeholder="请输入分享内容"></el-input>
      </el-form-item>
      <el-form-item label="分享缩略图" prop="sharethumbnail">
        <zm-upload
          v-if="token"
          :upToken="token"
          :uploadId="'uploadInvite'"
          class="btn"
          :url="shareForm.sharethumbnail"
          @update:url="val => shareForm.sharethumbnail = val"
          style="float: left; width:80px;"
        ></zm-upload>
        <img-box :imgsrc="shareForm.sharethumbnail" style="float:left; margin-right:10px;"></img-box>
        <span style="color:red;">*图片大小应在50kb以内</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('shareForm')">确 定</el-button>
        <el-button @click="resetForm('shareForm')">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import imgBox from "../agent_referral/imgbox.vue";
export default {
  components: { imgBox },
  data() {
    return {
      shareSettingDialog: false,
      token: "",
      shareForm: {
        id: "",
        sharetitle: "",
        sharecontent: "",
        sharethumbnail: ""
      },
      rules: {
        sharetitle: [
          { required: true, message: "请设置正确的分享标题", trigger: "blur" }
        ],
        sharecontent: [
          { required: true, message: "请设置正确的分享内容", trigger: "blur" }
        ],
        sharethumbnail: [{ required: true, message: "请设置正确的分享缩略图" }]
      }
    };
  },
  props: {},
  computed: {},
  methods: {
    openInit(data) {
      this.shareSettingDialog = true;
      this.shareForm.id = data.id;
      this.shareForm.sharetitle = data.sharetitle;
      this.shareForm.sharecontent = data.sharecontent;
      this.shareForm.sharethumbnail = data.sharethumbnail;
    },
    // 七牛云token;
    _getQiniuToken() {
      this.$Fetch({
        url: "/api/agent/upToken",
        method: "get"
      }).then(result => {
        const data = result.data;
        const code = result.code;
        const message = result.message;
        if (code == 0) {
          this.token = data;
        } else if (code == 1) {
          this.$Message({
            message
          });
        } else {
          this.$Message({
            message: "调用后端数据失败" + message,
            type: "error"
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$Fetch({
            url: "/api/zm-teacher-recruit-web/api/activity/configActivityShare",
            method: "post",
            data: this.shareForm
          }).then(result => {
            const data = result.data;
            const code = result.msgCode;
            const message = result.msgContent;
            if (code == 200) {
              this.$Message({
                message
              });
              this.shareSettingDialog = false;
              this.$parent.getTableData();
            } else {
              this.$Message({
                message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.shareSettingDialog = false;
      this.$refs[formName].resetFields();
    }
  },
  created() {},
  mounted() {
    this._getQiniuToken();
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
}
</style>

