import basicMessage from '../userInfoItems/basic_message'
import writtenRecord from '../userInfoItems/written_record'
import handOver from '../userInfoItems/hand_over'
import operationRecordMix from '../userInfoItems/operation_record_mix'
import historyRecordMixin from '../full_times_dir/historyRecordMixin'
import applicationRecordMixin from '../full_times_dir/applicationRecordMixin'
import resumePl from '../dialog/resume_pl'
import preview from '../dialog/preview'
import teaMesAudit from '../dialog/tea_mes_audit'
import getProvinces from '../../api/select/getProvinces'
import getReviewList from '../../api/select/getReviewList'
import basicInfo from '../../api/select/basicInfo'
import testInfo from '../../api/select/testInfo'
import getReserveRecords from '../../api/select/getReserveRecords'
import getInterviewRecords from '../../api/select/getInterviewRecords'
import getEduBack from '../../api/select/getEduBack'
import getSubject from '../../api/select/getSubject'
import salaryAnPay from '../../api/select/salaryAnPay'
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo'

export default {
  mixins: [historyRecordMixin, applicationRecordMixin],
  data() {
    return {
      basesubjectlist: [],

      // 个人信息弹出框控制
      userDetailDialog: false,

      // 个人信息弹出框tab索引
      userDetailTabNumber: 'first',

      // 个人信息弹出框用户ID
      userDetailId: '',

      // 用户密文ID
      cipherTId: '',

      // 个人信息弹出框用户名
      userDetailName: '',

      // 个人信息弹出框用户手机号
      userDetailMobile: '',

      // 个人信息弹出框-基本信息
      userDetailData: {},

      // 教育背景
      eduBackData: {},
      salaryAnPaylData: {},
      teaPersonalInfoData: {},

      // 个人信息弹出框-笔试信息
      userDetailDataPlus: [],

      // 个人信息弹出框-预约记录
      userDetailDataReserveRecords: [],

      // 个人信息糖醋狂-移交记录
      userDetailDataHandsRecords: [],

      // 个人信息弹出框-面试记录
      userDetailDataReviewRecords: [],

      // 个人信息弹出框-培训记录
      userDetailDataTrainingRecords: [],

      // 个人信息弹出框-实名记录
      userDetailDataIdentifyRecords: [],
      proData:[],
      bu: '',
      previewDialog: false,
      previewData: {},

      //修改状态dialog
      teaAuditSettingDialog: false,
      auditData: [],
      auditTeaId: '',
      teaCheckState: null,
    }
  },
  components: {
    basicMessage,
    writtenRecord,
    operationRecordMix,
    handOver,
    resumePl,
    preview,
    teaMesAudit
  },
  watch:{
    userDetailTabNumber (val) {
      switch (val) {
        case "first":
          this.selectTableText = "个人基本信息-基本信息"
          break;
        case "second":
          this.selectTableText = "个人基本信息-笔试信息"
          break;
        case "third":
          this.selectTableText = "个人基本信息-预约记录"
          break;
        case "four":
          this.selectTableText = "个人基本信息-移交记录"
          break;
        case "five":
          this.selectTableText = "个人基本信息-面试记录"
          break;
        case "six":
          this.selectTableText = "个人基本信息-培训记录"
          break;
        case "seven":
          this.selectTableText = "个人基本信息-入职记录"
          break;
        case "eight":
          this.selectTableText = "个人基本信息-个人介绍审核记录"
          break;
        case "nine":
          this.selectTableText = "个人基本信息-试用期管理记录"
          break;
        case "ten":
          this.selectTableText = "个人基本信息-转正管理记录"
          break;
        case "eleven":
          this.selectTableText = "个人基本信息-离职记录"
          break;
        case "twelve":
          this.selectTableText = "个人基本信息-回收站记录"
          break;
        case "historyRecord":
          this.selectTableText = "个人基本信息-历史记录"
          break;
        case "operationRecordMix":
          this.selectTableText = "个人基本信息-操作记录"
          break;
        default:

      }
    }
  },
  mounted() {
    this.getProData()
  },
  methods: {
    openThisDialog (id) {
      this.$refs.applicationRecordDialog.dialogVisible = true
      this.$refs.applicationRecordDialog.getEvaluationUsing(id)
    },
    uploadSuccess (list) {
      // 上传成功后获取个人介绍里面的视频字段赋值
      this.$refs.basicMessageEle.teaPersonalInfoData.teaVideoUrl = list[0].fileUrl
    },
    getProData () {
      getProvinces().then(data => {
        this.proData = data;
      }).catch(message => {
        this.$Message({
          message
        });
      })
    },
    // 点击用户名查看详情
    userDetail({teaId, isRealName, mobile, teaBu, interviewStateStr, trainTime, cipherTId}) {
      this.userDetailDialog = true
      this.userDetailId = teaId
      this.cipherTId = cipherTId
      this.bu = teaBu
      this.userDetailName = isRealName
      this.userDetailMobile = mobile
      this.userDetailInterviewStateStr = interviewStateStr
      this.userDetailTrainTime = trainTime
      basicInfo({teaId: cipherTId}).then(data => {
        this.userDetailData = data
      }).catch(message => {
        this.$Message({
          message
        })
      })
      getEduBack({teaId}).then(_data => {
        getSubject({bu:teaBu}).then(data => {
          this.eduBackData = _data
          this.$refs.basicMessageEle.basesubject = data.children
        }).catch(message => {
          this.$Message({
            message:"基础科目获取异常"
          })
          this.basesubjectlist = []
        });
      }).catch(message => {
        console.log("error:",message)
      });
      salaryAnPay({teaId}).then(data => {
        this.salaryAnPaylData = data
      }).catch(message => {
        this.salaryAnPaylData = null
        console.log("error:",message)
      })
      getTeaPersonalInfo({teaId}).then(data => {
        this.teaPersonalInfoData = data
      }).catch(message => {
        this.teaPersonalInfoData = null
        console.log("error:",message)
      })
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailDialog = false
      this.userDetailTabNumber = 'first'
      this.userDetailData = {}
      this.eduBackData = {}
      this.userDetailDataPlus = []
      this.userDetailDataReserveRecords = []
      this.userDetailDataHandsRecords = []
      this.userDetailDataReviewRecords = []
      this.userDetailDataTrainingRecords = []
      this.userDetailDataIdentifyRecords = []
      this.historyRecord = []
    },
    confirmUserDetailDialog() {
      // this.getTableData()
      this.closeUserDetailDialog()
    },
    // 用户详情tab键
    userDetailTab(tab, event) {
      if (tab.name==="first") {
        testInfo({teacherId:this.userDetailId}).then(data => {
          this.userDetailDataPlus = data
        }).catch(message => {
          this.$Message({
            message
          })
        });
      }
      if (tab.name==="second") {
        getReserveRecords({teacherId:this.userDetailId}).then(data => {
          this.userDetailDataReserveRecords = data
        }).catch(message => {
          this.$Message({
            message
          })
        })
      }
      if (tab.name==="four") {
        getInterviewRecords({teaId:this.userDetailId}).then(data => {
          this.userDetailDataReviewRecords = data
        }).catch(message => {
          this.$Message({
            message
          })
        })
      }
      if (tab.name ==='historyRecord') {
        this.handleGetTeacherHistoryRecord(this.userDetailId)
      }
      if (tab.name ==='operationRecordMix') {
        this.$refs.operationRecordMix.getData(this.userDetailId)
      }
      if (tab.name ==='applicationRecord') {
        this.$refs.applicationRecordRef.getRecruitLogsUsing(this.userDetailId)
      }
    },
    teaAudit (teaId, checkState) {
      this.auditTeaId = teaId
      getReviewList({teaId:teaId}).then(data => {
        this.teaAuditSettingDialog = true
        this.auditData = data
        this.teaCheckState = checkState
      }).catch(message => {
        this.teaAuditSettingDialog = true
      });
    },
    openThisDialog (id) {
      this.$refs.applicationRecordDialog.dialogVisible = true
      this.$refs.applicationRecordDialog.getEvaluationUsing(id)
    },
    confirmPreviewDialog (data) {
      this.previewData = data
      this.previewDialog = true
      this.$nextTick(() => {
        this.$refs.resumePl.getHeaderUrl(data.teaId)
      })
    },
    cancelPreviewDialog () {
      this.previewDialog = false
    },
    confirmTeaAuditSettingDialog () {
      this.teaAuditSettingDialog = false
      this.auditTeaId = ""
      //重新请求教师资料数据
      getTeaPersonalInfo({teaId:this.userDetailId}).then(data => {
        this.teaPersonalInfoData = data
      }).catch(message => {
        this.teaPersonalInfoData = null
      })
    },
    teaAudit (teaId,checkState) {
      this.auditTeaId = teaId;
      getReviewList({teaId:teaId}).then(data => {
        this.teaAuditSettingDialog = true
        this.auditData = data;
        this.teaCheckState = checkState
      }).catch(message => {
        this.teaAuditSettingDialog = true
      });
    },
    cancelTeaAuditSettingDialog () {
      this.auditTeaId = ""
      this.teaAuditSettingDialog = false
    },
  }
}
