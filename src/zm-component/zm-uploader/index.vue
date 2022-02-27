<template>
  <div>
    <el-upload
      class='zm-uploader-ui'
      :action='uploadUrl'
      :multiple='false'
      :accept="accept.join(',')"
      list-type="picture"
      :show-file-list='false'
      :with-credentials='true'
      :on-success='onSuccess'
      :on-error='onFailed'
      name='multipartFile'
      :before-upload='beforeUpload'
    >
      <el-button type="primary" size="small">上传图片</el-button>
      <div slot="tip" class="el-upload__tip"><slot/></div>
    </el-upload>
  </div>
</template>

<script>

/**
 * vue版本 和 element-ui版本不匹配
 * 导致 el-upload被渲染时, 报 injection el-form not found **警告**
 * 打包成prod包时 警告消失.
 */
import config from '@config'
export default {
  name: 'UI-ZM-UPLOADER',
  props: {
    url: {
      type: String,
      default: ''
    },
    accept: {
      type: Array,
      default: () => (['image/bmp', 'image/jpg', 'image/jpeg', 'image/png', 'image/gif'])
    }
  },
  computed: {
    uploadUrl () {
      return `${process.env.NODE_ENV === 'development' ? config.dev.proxypath : ''}/api/zm-teacher-recruit-web/api/qiniu/picUpload`
    }
  },
  methods: {
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$Message.error('上传图片大小不能超过 10MB!');
      }
      return isLt10M;
    },
    onSuccess (response, /*file, fileList*/) {
      if (response && response.code === 200 && response.data) {
        this.$emit('update:url', response.data)
      } else {
        this.$Message.error('上传失败, 请稍候重试')
      }
    },
    onFailed () {
      this.$Message.error('上传失败, 请稍候重试')
    }
  },
}
</script>

<style lang="less" scoped>
.zm-uploader-ui {
  // float: left;
  // margin-right: 20px;
}
</style>