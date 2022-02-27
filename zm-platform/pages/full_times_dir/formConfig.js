const teaBuList = [
  { label: "全部", value: "" },
  { label: "1对1", value: "1" },
  { label: "少儿", value: "2" },
  { label: "陪练", value: "3" },
  { label: "优课", value: "5" },
];

const timeTypeList = [
  { label: "全部", value: "" },
  { label: "全职", value: "1" },
  { label: "校招全职", value: "2" },
];

const interviewStateList = [
  { label: "全部", value: "" },
  { label: "待预约", value: "0" },
  { label: "待面试", value: "1" },
  { label: "待二面", value: "10" },
  { label: "面试缺席", value: "11" },
  { label: "待培训预约", value: "2" },
  { label: "待培训通知", value: "20" },
  { label: "培训延期", value: "21" },
  { label: "培训缺席", value: "22" },
];

const fixedSalaryStateList = [
  { label: "全部", value: "" },
  { label: "未定薪", value: "0" },
  { label: "定薪待审核", value: "1" },
  { label: "已定薪", value: "2" },
];

const followUpResultList = [
  { label: "全部", value: "" },
  { label: "【预约面试】", value: "1" },
  { label: "【淘汰】", value: "2" },
  { label: "【待跟进-再次联系】", value: "3" },
  { label: "【待跟进-N次联系不上】", value: "4" },
  { label: "【主动放弃】", value: "5" },
];

const wxBindStatusList = [
  { label: "全部", value: null },
  { label: "已绑定", value: 1 },
  { label: "未绑定", value: 2 },
];

const normalSchoolList = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
]

const schoolLevelList = [
  '985',
  '211',
  '一本',
  '二本A',
  '二本B',
  '三本',
  '专科',
  '其他',
]

const default_interview_form_list = [
  {"text":"关键字","type":"input","value":"keyWord"},
  {"text":"所属BU","type":"select","value":"teaBu"},
  {"text":"工作性质","type":"select","value":"timeType"},
  {"text":"老师类型","type":"select","value":"teaType"},
  {"text":"教资情况","type":"select","value":"certificateSituation"},
  {"text":"面试时间","type":"date","value":"startInterviewTime"},
  {"text":"定薪状态","type":"select","value":"fixedSalaryState"},
  {"text":"院校等级","type":"select","value":"schoolLevel"},
]

const default_interview_table_list = [
  {"text":"姓名","type":"input","value":"name"},
  {"text":"微信号","type":"input","value":"teaWeixin"},
  {"text":"邮箱","type":"input","value":"email"},
  {"text":"名单等级","type":"select","value":"teacherLevel"},
  {"text":"老师状态","type":"input","value":"interviewStateStr"},
  {"text":"跟进备注","type":"input","value":"followUpRemarks"},
  {"text":"下次跟进时间","type":"input","value":"followUpTimeNext"},
  {"text":"报名时间","type":"input","value":"applyTime"},
  {"text":"面试时间","type":"input","value":"interviewTime"},
  {"text":"培训时间","type":"input","value":"trainTime"},
  {"text":"跟进人","type":"input","value":"followPerson"},
  {"text":"推荐人手机号","type":"input","value":"teaReferMobile"},
  {"text":"推荐人姓名","type":"input","value":"teaReferName"},
]

const default_training_form_list = [
  {"text":"关键字","type":"input","value":"keyWord"},
  {"text":"所属BU","type":"select","value":"teaBu"},
  {"text":"工作性质","type":"select","value":"timeType"},
  {"text":"老师状态","type":"select","value":"teacherState"},
  {"text":"offer状态","type":"select","value":"offerState"},
  {"text":"培训主题","type":"input","value":"trainTheme"},
  {"text":"培训结果","type":"select","value":"trainResultType"},
  {"text":"定薪状态","type":"select","value":"fixedSalaryState"}
]

const default_training_table_list = [
  {"text":"姓名","type":"input","value":"name"},
  {"text":"所属BU","type":"select","value":"teaBu"},
  {"text":"第一擅长科目","type":"select","value":"subject"},
  {"text":"年级偏好","type":"select","value":"grade"},
  {"text":"资料完善状态","type":"select","value":"infoStateStr"},
  {"text":"教师资格证","type":"select","value":"teacherLicenseStateStr"},
  {"text":"培训主题","type":"input","value":"trainTheme"},
  {"text":"培训结果","type":"select","value":"trainResultTypeStr"},
  {"text":"offer状态","type":"select","value":"offerStateStr"},
  {"text":"排课状态","type":"select","value":"recommendStateStr"},
  {"text":"求职状态","type":"input","value":"jobState"},
  {"text":"跟进人","type":"input","value":"followPerson"},
  {"text":"推荐人手机号","type":"input","value":"teaReferMobile"},
  {"text":"推荐人姓名","type":"input","value":"teaReferName"}
]

const default_entry_form_list = [
  {"text":"关键字","type":"input","value":"content"},
  {"text":"所属BU","type":"select","value":"bu"},
  {"text":"工作性质","type":"select","value":"timeType"},
  {"text":"老师类型","type":"select","value":"teaType"},
  {"text":"老师状态","type":"select","value":"state"},
  {"text":"入职资料审核状态","type":"select","value":"entryState"},
  {"text":"电子签约状态","type":"select","value":"econtractState"},
  {"text":"教师资格证","type":"select","value":"certificateType"},
  {"text":"年级偏好","type":"select","value":"grade"},
  {"text":"第一擅长科目","type":"select","value":"subject"},
  {"text":"职位类型","type":"select","value":"positionType"}
]


const default_entry_table_list = [
  {"text":"姓名","type":"input","value":"teaName"},
  {"text":"邮箱","type":"input","value":"email"},
  {"text":"是否可签约","type":"select","value":"canSign"},
  {"text":"所属BU","type":"select","value":"bu"},
  {"text":"教师资格证","type":"select","value":"teacherLicenseStateStr"},
  {"text":"工作性质","type":"select","value":"timeType"},
  {"text":"电子签约状态","type":"select","value":"econtractStateText"},
  {"text":"第一擅长科目","type":"select","value":"subject"},
  {"text":"年级偏好","type":"select","value":"grade"},
  {"text":"最高学历","type":"select","value":"edu"},
  {"text":"所属学校","type":"input","value":"schoolName"},
  {"text":"入职资料审核状态","type":"select","value":"entryState"}
]

export {
  // teaBuList,
  // timeTypeList,
  // interviewStateList,
  // fixedSalaryStateList,
  // followUpResultList,
  // wxBindStatusList,
  // normalSchoolList,
  // schoolLevelList,
  default_interview_form_list,
  default_interview_table_list,
  default_training_form_list,
  default_training_table_list,
  default_entry_form_list,
  default_entry_table_list,
}