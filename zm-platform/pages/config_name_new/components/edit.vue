<template>
  <el-dialog :title="ruleForm.entryConfigId?'编辑':'新增'" v-model="dialogVisible">
    <el-form :model="ruleForm" label-width="120px">
      <el-form-item label="选择报名类型：">
        <el-select v-model="ruleForm.entryType" placeholder="请选择" :disabled="ruleForm.entryConfigId?true:false">
          <el-option label="兼职" value="0"></el-option> 
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填写报名页名称：">
        <el-input v-model="ruleForm.entryName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="postEntryData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script> 
export default { 
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        entryName: "",
        entryType: "",
        entryConfigId:''
      },
    };
  },
  methods: {
    show(row) {
      this.dialogVisible = true;
      if(row){
        this.ruleForm.entryName = row.entryName;
        this.ruleForm.entryType = ''+row.entryType;
        this.ruleForm.entryConfigId = row.entryConfigId;
      }else{
        this.ruleForm.entryName = '';
        this.ruleForm.entryType = '';
        this.ruleForm.entryConfigId = '';
      }
    },
    // 新增报名类型-点击确定
    postEntryData() {
      this.$Fetch({
        url: this.ruleForm.entryConfigId?"/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/updateEntryConfigName":"/api/zm-teacher-recruit-web/api/1.0.0/recruitEntryConfig/createEntryConfig",
        method: "post",
        data: this.ruleForm.entryConfigId?{
          entryConfigName:this.ruleForm.entryName,
          entryConfigType:this.ruleForm.entryType,
          entryConfigId:this.ruleForm.entryConfigId,
        }:this.ruleForm
      })
        .then(result => {
          if (result.msgCode == '200') {
            this.$Message({
              message: result.data,
              type: "success"
            });
            this.dialogVisible = false;
            this.$emit('successBack');
          } else {
            this.$Message({
              message: result.msgContent,
              type: "error"
            });
          }
        })
        .catch(message => {
          this.$Message({
            message
          });
        });
    }
  }
};
</script>

<style lang='less' scoped>
.el-input {
  width: 200px;
}
.el-form-item {
  margin-bottom: 20px;
}
</style>