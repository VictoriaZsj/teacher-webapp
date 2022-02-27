<template>
  <div>
    <el-dialog
      title="查看面试结果"
      v-model="dialogVisible"
      class="application-record-dialog"
      :before-close="handleClose"
    >
      <application-re-form
        ref="applicationReForm"
        pageType="interiewee"
      />
    </el-dialog>
  </div>
</template>
<script>
import applicationReForm from './applicationReForm';
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    getEvaluationUsing(id) {
      this.$nextTick(()=>{
        this.$refs.applicationReForm.init(id);
      })
    },
  },
  components: { applicationReForm },
};
</script>
<style lang="less">
  .application-record-dialog .el-dialog {
    width: 1000px;
  }
</style>
