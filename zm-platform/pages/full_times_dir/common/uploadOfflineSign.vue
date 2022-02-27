<template>
    <div class="uploadth ff-upload-2">
      <!-- 注意: FfUpload采用elementUi 2.9.1上传组件, 如有api上面的问题，请参考element-ui-2.9.1___upload -->
      <el-upload
        class="upload-demo"
        :action="action"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        multiple
        :limit="10"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小<50M，最多上传10个文件</div>
        </el-upload>
      <!-- <el-form>
        <el-form-item>
          <el-upload class="upload-demo" ref="upload" :data="uploadData"
            :action="action"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :file-list="fileList"
            :limit="limit"
            multiple>
            <span v-if="isButton">
                <el-button type="primary" :disabled="overLimit">上传附件</el-button> <span style="font-size: 12px;">{{tipsComputed}}</span>
            </span>
            <span v-else>
                <span class="Cf27274"><span v-if="!overLimit" class="el-icon-upload"> 上传附件</span> </span>
                <span slot="tip" class="el-upload__tip"><span v-if="overLimit" class="el-icon-upload"> 上传附件</span> {{tipsComputed}}</span>
            </span>
          </el-upload>
        </el-form-item>
      </el-form> -->
    </div>
</template>

<script>
export default {
    props: {
      isButton: {
          default: true,
          type: Boolean
      },
      limit: {
          default: 10,
          type: Number
      },
      bigSize: {
          default: 50,
          type: Number
      },
      tips: {
          default: '',
          type: String
      },
      aboutType: {
        type: Array,
        default () {
          return ['pdf', 'jpg', 'png', 'gif', 'jpeg', 'bmp']
        }
      },
      action: {
        type: String
      },
      uploadData: {
        default: {
            name: null
        },
        type: Object
      }
    },
    components: {},
    data () {
      return {
          fileList: []
      }
    },
    computed: {
      overLimit () {
          return this.fileList.length >= this.limit
      },
      tipsComputed () {
          return (this.tips==='') ? `(最多上传${this.limit}个附件, 单个文件最大${this.bigSize}M)` : this.tips
      }
    },
    methods: {
      uploadSuccess() {

      },
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        this.$Message({
          message: `最多只能上传 10 个文件，本次选择了 ${files.length} 个文件，请重新选择`
        });
      },
      handleChange(file, fileList) {
        if (fileList.length) {
          this.$emit('callback', fileList);
        }
        if (file.response && file.response.code !== '0') {
          this.$Message({
            message: file.response.message
          });
          return;
        }
      },
      // 每次打开签线下合同弹窗，清空已上传文件列表
      resetFileList() {
        this.fileList = [];
      },
      beforeUpload (file) {
        if ((file.size / (1024 * 1024)) >= 50) {
          this.$Message.error('文件大小需小于50M，请重新选择');
          return false;
        }
        const filetype = file.name.substring(file.name.lastIndexOf('.') + 1);
        const isType = this.aboutType.includes(filetype);
        const isSize = (file.size / 1024 / 1024) < this.bigSize;
        if (!isType) {
            this.$Message.error('上传仅支持pdf和图片文件格式')
            return false
        }
        if (!isSize) {
            this.$Message.error(`上传文件大小不能超过${this.bigSize}MB!，请重新选择`);
        };
        this.uploadData.name = file.name
        return isType && isSize;
      },
    }
}
</script>
<style lang="less" scoped>
.uploadth {
  .Cf27274{
      font-size: 12px;
      color: #f27274;
  }
  .Cfb3b2b2{
      font-size: 12px;
      color: #b3b2b2;
  }
  .el-upload__input {
      display: none;
  }
}
</style>
