export default {
  computed: {
    teacherFilePath() {
      const { teacherFiles } = this.teaPersonalInfoData
      return teacherFiles && teacherFiles[0] && teacherFiles[0].ossPath
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
    },

    certificateClassFilter(num) {
      if (!num) return
      const index = String(num).split('')[9]
      const collect = [
        '幼儿园',
        '小学',
        '初级中学',
        '高级中学',
        '中等职业学校',
        '中等职业学校实习指导',
        '高等学校'
      ]
      if (collect[index]) return `${collect[index - 1]}教师资格`
    },

    certificateYearFilter(num) {
      if (!num) return
      return String(num).slice(0, 4)
    }
  }
}
