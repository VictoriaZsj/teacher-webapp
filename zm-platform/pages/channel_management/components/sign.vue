<template>
  <el-dialog title="配置报名页" v-model="dialogVisible" width="100%" @close="closeBtn">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item class="is-required" label="兼职报名页">
        <el-select v-model="form.parttimeEntryConfigId" placeholder="请选择">
          <el-option
            v-for="(item,index) in options.parttimeEntryConfigUrls"
            :key="index"
            :label="item.entryName"
            :value="item.entryConfigId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="is-required" label="全职报名页">
        <el-select v-model="form.fulltimeEntryConfigId" placeholder="请选择">
          <el-option
            v-for="(item,index) in options.fulltimeConfigUrls"
            :key="index"
            :label="item.entryName"
            :value="item.entryConfigId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="is-required" label="校招全职报名页">
        <el-select v-model="form.schoolFulltimeEntryConfigId" placeholder="请选择">
          <el-option
            v-for="(item,index) in options.schoolFulltimeConfigUrls"
            :key="index"
            :label="item.entryName"
            :value="item.entryConfigId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeBtn">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        parttimeEntryConfigId: "",
        fulltimeEntryConfigId: "",
        schoolFulltimeEntryConfigId: "",
        channelId: ""
      },
      options: {}
    };
  },
  methods: {
    show(row) {
      this.dialogVisible = true;
      this.form.channelId = row.id;
      this.form.parttimeEntryConfigId = ''+row.parttimeEntryConfigId;
      this.form.fulltimeEntryConfigId = ''+row.fulltimeConfigId;
      this.form.schoolFulltimeEntryConfigId = ''+row.schoolFulltimeConfigId;
      this.getEntryConfigURL(row.parttimeEntryConfigId||row.fulltimeConfigId||row.schoolFulltimeConfigId);
    },
    onSubmit() {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/agentMember/configEntryConfigURL",
        method: "post",
        data: this.form
      })
        .then(res => {
          if (res.msgCode === "200") {
            this.$Message.success("配置成功");
            this.$emit("successBack");
            this.closeBtn();
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
    closeBtn() {
      this.dialogVisible = false;
      this.form = {
        parttimeEntryConfigId: "",
        fulltimeEntryConfigId: "",
        schoolFulltimeEntryConfigId: "",
        channelId: ""
      };
    },
    getEntryConfigURL(key) {
      this.$Fetch({
        url: "/api/zm-teacher-recruit-web/api/agentMember/getEntryConfigURL",
        method: "post",
        data: {}
      })
        .then(res => {
          if (res.msgCode === "200") {
            this.options = res.data;
            if(!key){ 
              this.form.parttimeEntryConfigId = res.data.parttimeEntryConfigUrls[0].entryConfigId;
              this.form.fulltimeEntryConfigId = res.data.fulltimeConfigUrls[0].entryConfigId;
              this.form.schoolFulltimeEntryConfigId = res.data.schoolFulltimeConfigUrls[0].entryConfigId;
            }
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
    }
  }
};
</script>

<style lang='less' scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
