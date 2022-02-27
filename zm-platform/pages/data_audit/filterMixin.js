export default {
  computed: {
    getUrl() {
      let url = []
      const certificateType = this.introduceShowObj.certificateType
      const teacherFiles = this.introduceShowObj.teacherFiles || []
      teacherFiles.map(file => {
        file.fileType === '8' && (certificateType === 8|| certificateType === 10) &&(url.push(file.ossPath))
        file.fileType === '12' && (certificateType === 9|| certificateType === 11) && (url.push(file.ossPath))
        file.fileType === '11' && (certificateType === 6 || certificateType === 7) && (url.push(file.ossPath))
        file.fileType === '7' && (certificateType === 2|| certificateType ===5|| certificateType === 4) && (url.push(file.ossPath))
      })
      return url
    },
    getTeachingUrl() {
      let url = []
      const teacherFile = this.introduceShowObj.teacherFiles || []
      teacherFile.map(file => {
        file.fileType === '9' && (url.push(file.ossPath))
      })
      return url
    },
    getAwardUrl() {
      let url = []
      const teacherFilesAward = this.introduceShowObj.teacherFiles || []
      teacherFilesAward.map(file => {
        file.fileType === 'award' && (url.push(file.ossPath))
      })
      return url
    },
    getIdcardUrl() {
      let url = []
      const teacherFilesId = this.introduceShowObj.teacherFiles || []
      teacherFilesId.map(file => {
        file.fileType === 'idcard' && (url.push(file.ossPath))
      })
      return url
    },
  },
  filters: {
    periodFilter(value) {
      let filterValue = ''
      switch (value) {
        case '0':
          filterValue = '预备期'
          break;
        case '1':
          filterValue = '面试期'
          break;
        case '2':
          filterValue = '培训期'
          break;
        case '3':
          filterValue = '入职期'
          break;
        case '4':
          filterValue = '试用期'
          break;
        case '5':
          filterValue = '转正/入库'
          break;
        case '6':
          filterValue = '离职期'
          break;
        case '7':
          filterValue = '回收站'
          break;
      }
      return filterValue
    },
    timeTypeFilter(value) {
      let filterValue = ''
      switch(value) {
        case '0':
          filterValue = '兼职'
          break;
        case '1':
          filterValue = '全职'
          break;
        case '2':
          filterValue = '校招全职'
          break;
        case '3':
          filterValue = '公校兼职'
          break;
      }
      return filterValue
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
          return '已通过非本学科笔试'
      }
    },
    certificateTypefilterImg(type) {
      switch (type) {
        case 8:
          return '准考证图：';
        case 10:
          return '准考证图：';
        case 9:
          return '笔试成绩截图：';
        case 11:
          return '笔试成绩截图：';
        case 6:
          return '合格证截图：';
        case 7:
          return '合格证截图：';
        case 2:
          return '资格证书：';
        case 5:
          return '资格证书：';
        case 4:
          return '资格证书：';
      }
    },
    certificateYearFilter(num) {
      if (!num) return
      return String(num).slice(0, 4)
    }
  }
}
