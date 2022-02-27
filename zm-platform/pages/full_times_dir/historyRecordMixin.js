import historyRecord from '../userInfoItems/history_record'
import getTeacherHistoryRecord from '../../api/select/getTeacherHistoryRecord'

export default {
  data() {
    return {
      historyRecord: []
    }
  },

  methods: {
    handleGetTeacherHistoryRecord(teaId) {
      getTeacherHistoryRecord({ teaId })
        .then(({ data }) => (this.historyRecord = data))
        .catch(message => {
          this.$Message({ message })
        })
    }
  },

  components: {
    historyRecord
  }
}
