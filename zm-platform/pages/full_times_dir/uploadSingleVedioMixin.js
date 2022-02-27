/**
 * 培训管理
 * 入职管理
 * 转正管理
 * 试用期管理
 * 面试管理
 * 上传个人视频的mixin
 */

import uploadSingleVedio from './common/upload-single-vedio.vue'; // 单个老师上传视频

export default {
  data() {
    return {
      
    }
  },

  methods: {
    uploadSingleVedio(teaId) {
      
      this.$refs.uploadSingleVedio.uploadData.teaId = teaId
      this.$refs.uploadSingleVedio.dialogVisible = true
    }
  },

  components: {
    'upload-single-vedio': uploadSingleVedio // 单个老师上传
  }
}
