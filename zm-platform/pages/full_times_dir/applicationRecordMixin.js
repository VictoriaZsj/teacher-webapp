/**
 * 培训管理
 * 入职管理
 * 转正管理
 * 试用期管理
 * 面试管理
 * 应聘记录的mixin
 */

import applicationRecord from '../dialog/applicationRecord';
import applicationRecordDialog from '../dialog/applicationRecordDialog'

export default {
  data() {
    return {
      
    }
  },

  methods: {
  },

  components: {
    'application-record': applicationRecord,
    'application-record-dialog': applicationRecordDialog
  }
}
