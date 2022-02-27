module.exports = {
  buList: [
    {
      label: '1对1',
      value: '1'
    },
    {
      label: '少儿',
      value: '2'
    },
    {
      label: '陪练',
      value: '3'
    },
    {
      label: '优课',
      value: '5'
    }
  ],
  trialContentList: [
    {
      label: '基本信息',
      value: '基本信息'
    },
    {
      label: '教师资格证',
      value: '教师资格证'
    },
    {
      label: '个人视频',
      value: '个人视频'
    }
  ],
  timeTypeList: [
    {
      label: '兼职',
      value: '0'
    },
    {
      label: '全职',
      value: '1'
    },
    {
      label: '校招全职',
      value: '2'
    },
    {
      label: '公校兼职',
      value: '3'
    }
  ],
  pickerOptions: {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
    }, {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
    }]
  }
}
