export default {
  data() {
    return {
      teacherCertificateStateOption: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '未报考',
          value: '0'
        },
        {
          label: '已报考待审核',
          value: '11'
        },
        {
          label: '已报考审核通过',
          value: '12'
        },
        {
          label: '已报考审核未通过',
          value: '13'
        },
        {
          label: '已持证待审核',
          value: '21'
        },
        {
          label: '已持证审核通过',
          value: '22'
        },
        {
          label: '已持证审核未通过',
          value: '23'
        }
      ]
    }
  },

  filters: {
    certificateStateFilter(state) {
      const collect = ['未提交', '待审核', '审核通过', '审核未通过']
      return collect[state] || ''
    },

    certificateTypeFilter(type) {
      switch (type) {
        case 0:
          return '未报考';
        case 8:
          return '已报考本学科考试';
        case 9:
          return '已通过本学科笔试';
        case 6:
          return '已持本学科考试合格证明';
        case 2:
          return '持本学科证';
        case 1:
          return '已报考';
        case 3:
          return '未持证';
        case 4:
          return '已持非本学科证';
        case 5:
          return '已持本学科证';
        case 7:
          return '已持非本学科考试合格证明';
           case 10:
          return '已报考非本学科考试';
        case 11:    
          return '已通过非本学科笔试';
      }
    }
  }
}
