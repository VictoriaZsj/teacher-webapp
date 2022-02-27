<template>
  <div class="recommenderForm">
    <el-form
      :model="recommenderForm"
      ref="recommenderForm"
      label-width="100px"
    >
      <el-form-item
        label="原推荐人"
      >
        <div class="form-input div-tag" >{{recommender.channelName}}</div>
      </el-form-item>
      <el-form-item
        prop='currChannelId'
        label="新推荐人"
        :rules="[
          { required: true, message: '', trigger: 'change' }
        ]"
      >
        <el-select
          class="form-input"
          v-model="recommenderForm.currChannelId"
          placeholder="输入姓名或手机号查询"
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.channelId"
            :label="item.nameAndMobile"
            :value="item.channelId.toString()">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="fileList"
        label="上传证明"
        :rules="[
          { required: true, message: '', trigger: 'blur' }
        ]"
      >
        <el-upload
          name="multipartFile"
          accept="image/*"
          action="/api/zm-teacher-recruit-web/api/change-recommender/file/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          multiple
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          :file-list="fileList">
          <el-button size="small" type="text">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">文件格式≤50M</div>
        </el-upload>
      </el-form-item>
      <el-form-item
        prop="reason"
        label="变更原因"
        :rules="[
          { required: true, message: '', trigger: 'blur' }
        ]"
      >
        <el-input
          class="form-textarea"
          type="textarea"
          v-model="recommenderForm.reason"
          placeholder="请输入变更推荐人原因"
          :maxlength="maxlength">
        </el-input>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'editRecommender',
    props: ['recommender'],
    data() {
      return {
        recommenderForm: {
          currChannelId: '',
          fileIds: [],
          preChannelId: '',
          reason: '',
          teaId: ''
        },
        fileIds: [],
        fileList: [],
        loading: false,
        options: [],
        bigSize: 50,
        maxlength: 200
      }
    },
    methods: {
      remoteMethod(query) {
        if (query) {
          this.loading = true
          this.$Fetch({
            url: "/api/zm-teacher-recruit-web/api/change-recommender/query/recommender",
            data: {mobileOrName: query},
            method: "post"
          })
            .then(res => {
              this.loading = false
              const {code, data} = res
              if (code === 200) {
                this.options = data
              }
            })
        } else {
          this.options = []
        }
      },
      beforeUpload (file) {
        const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        const fileTypes = ['xbm', 'tif', 'pjp', 'jfif', 'bmp', 'png', 'jpg', 'gif', 'jpeg', 'webp', 'tiff', 'ico']
        const isType = fileTypes.includes(fileType)
        const isSize = (file.size / 1024 / 1024) < this.bigSize;
        if (!isSize) {
          this.$Message.error(`上传文件大小不能超过${this.bigSize}MB!`);
        };
        if (!isType) {
          this.$Message.error(`不支持${fileType}类型文件上传`);
        }
        return isSize && isType;
      },
      handleRemove(file, fileList) {
        this.fileIds = []
        fileList.map(file => {
          const {fileId} = file.response.data
          this.fileIds.push(fileId)
        })
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleUploadSuccess(res, file, fileList) {
        this.fileIds = []
        fileList.map(file => {
          const {fileId} = file.response.data
          this.fileIds.push(fileId)
        })
      },
      handleSubmitForm(callback) {
        if (!this.recommenderForm.currChannelId) {
          this.$Message({
            type: 'error',
            message: '请输入新推荐人'
          })
          return
        }
        if (!this.fileIds.length) {
          this.$Message({
            type: 'error',
            message: '请上传证明'
          })
          return
        }
        if (!this.recommenderForm.reason) {
          this.$Message({
            type: 'error',
            message: '请上传请输入变更推荐人原因证明'
          })
          return
        }
        const {channelId: preChannelId, teaId} = this.recommender
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/change-recommender/modify/recommender",
          data: { ...this.recommenderForm, preChannelId, teaId, fileIds: this.fileIds },
          method: "post"
        })
          .then(res => {
            const {code, data, msgCode, msgContent} = res
            if (code === 200 && msgCode==200) {
              callback&&callback()
              this.reloadTableData()
            } else {
              return this.$Message({
                type: 'error',
                message: msgContent,
              })
            }
          }).catch(err=>{
            return this.$Message({
              type: 'error',
              message: err.msgContent,
            })
          })
      },
      reloadTableData() {
        this.$refs.recommenderForm.resetFields()
        this.fileIds = []
        this.fileList = []
      }
    },
  }
</script>

<style lang="less" scoped>
  .recommenderForm{
    .el-form{
      .el-form-item{
        margin-bottom: 20px;
        .form-input{
          width: 200px;
          border: 1px solid #999;
          border-radius: 5px;
          font-size: 14px;
          &.div-tag{
            height: 32px;
            line-height: 32px;
            background-color: rgba(242, 242, 242, 1);
            padding-left: 10px;
          }

        }
        .form-textarea{
          width: 300px;
        }
      }
    }
  }

</style>
<style lang="less">
  .recommenderForm{
    .form-input{
      .el-input__inner{
        border-radius: 5px;
      }
    }
  }
</style>
