<template>
  <div class="personal-report">
    <Spin size="large" fix v-if="tableLoading" style="z-index: 1001"></Spin>
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="所属BU">
          <el-select v-model="searchData.bu" multiple  placeholder="请选择">
            <el-option label="1对1" value="1"></el-option>
            <el-option label="少儿" value="2"></el-option>
            <el-option label="陪练" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师性质">
          <el-select v-model="searchData.timeType" multiple placeholder="请选择">
            <el-option label="普通全职" value="1"></el-option>
            <el-option label="校招全职" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="searchData.date"
            type="daterange"
            range-separator="-"
            placeholder="选择日期"
            @change="handleSelectDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="老师资格证">
          <el-select v-model="searchData.teaCertificate" placeholder="请选择">
            <!-- <el-option label="全部" value=""></el-option>
            <el-option label="没有" value="0"></el-option>
            <el-option label="有" value="1"></el-option> -->
            <el-option v-for="(item, index) in teaCerOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn" size="small" type="normal"  @click="handleExport" v-if="checkPermission('report-gradesuject-export')">导出excel</el-button>
          <el-button class="search-btn" size="small" type="normal" icon="search" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="checkbox-group">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedQuota" @change="handleCheckedQuotaChange">
        <el-checkbox v-for="(quota, index) in quotaList" :label="quota" :key="index">{{quota}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="table-warpper" v-if="enrollment && tableData1.headers">
      <div class="table-title">报名人数</div>
      <report-table :headers="tableData1.headers" :merge-header="tableData1.mergeHeader" :rows="tableData1.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="befInterviewed && tableData2.headers">
      <div class="table-title">待面人数</div>
      <report-table :headers="tableData2.headers" :merge-header="tableData2.mergeHeader" :rows="tableData2.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="arriInterviewed && tableData3.headers">
      <div class="table-title">到面人数</div>
      <report-table :headers="tableData3.headers" :merge-header="tableData3.mergeHeader" :rows="tableData3.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="ratioInterviewed && tableData4.headers">
      <div class="table-title">到面率</div>
      <report-table :headers="tableData4.headers" :merge-header="tableData4.mergeHeader" :rows="tableData4.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="rateEnrollment && tableData5.headers">
      <div class="table-title">录取率</div>
      <report-table :headers="tableData5.headers" :merge-header="tableData5.mergeHeader" :rows="tableData5.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="trainingNum && tableData6.headers">
      <div class="table-title">参培人数</div>
      <report-table :headers="tableData6.headers" :merge-header="tableData6.mergeHeader" :rows="tableData6.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="trainingRate && tableData7.headers">
      <div class="table-title">参培率</div>
      <report-table :headers="tableData7.headers" :merge-header="tableData7.mergeHeader" :rows="tableData7.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="recruitsNum && tableData8.headers">
      <div class="table-title">入职人数</div>
      <report-table :headers="tableData8.headers" :merge-header="tableData8.mergeHeader" :rows="tableData8.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="entryRate && tableData9.headers">
      <div class="table-title">入职率</div>
      <report-table :headers="tableData9.headers" :merge-header="tableData9.mergeHeader" :rows="tableData9.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="correctNum && tableData10.headers">
      <div class="table-title">转正人数</div>
      <report-table :headers="tableData10.headers" :merge-header="tableData10.mergeHeader" :rows="tableData10.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="correctRate && tableData11.headers">
      <div class="table-title">转正率</div>
      <report-table :headers="tableData11.headers" :merge-header="tableData11.mergeHeader" :rows="tableData11.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="turnoveNum && tableData12.headers">
      <div class="table-title">离职人数</div>
      <report-table :headers="tableData12.headers" :merge-header="tableData12.mergeHeader" :rows="tableData12.rows"></report-table>
    </div>
    <div class="table-warpper" v-if="turnoveRate && tableData13.headers">
      <div class="table-title">离职率</div>
      <report-table :headers="tableData13.headers" :merge-header="tableData13.mergeHeader" :rows="tableData13.rows"></report-table>
    </div>
  </div>
</template>

<script>
  const quotaOptions = ['报名人数', '待面人数', '到面人数', '到面率', '录取率', '参培人数', '参培率', '入职人数', '入职率', '转正人数', '转正率', '离职人数', '离职率']
  import reportTable from '../component/reportTable'
  import newReportControllerExport from '../../api/action/newReportControllerExport'
  import getTeaCerListService from '../../api/select/getTeaCerListService'; // 获取教师资格状态列表

  export default {
    components: {
      reportTable
    },
    data() {
      return {
        teaCerOptions: [], // 教师资格状态列表
        searchData: {
          bu: [],
          timeType: [],
          date: [],
          startTime: '',
          endTime: '',
          teaCertificate: ''
        },
        exportOptions: {},
        checkAll: false,
        quotaList: quotaOptions,
        checkedQuota: [],
        isIndeterminate: true,
        tableData1: [],
        tableData2: [],
        tableData3: [],
        tableData4: [],
        tableData5: [],
        tableData6: [],
        tableData7: [],
        tableData8: [],
        tableData9: [],
        tableData10: [],
        tableData11: [],
        tableData12: [],
        tableData13: [],
        enrollment: false, // 报名人数checked
        befInterviewed: false, // 待面人数checked
        arriInterviewed: false, // 到面人数checked
        ratioInterviewed: false, // 到面率checked
        rateEnrollment: false, // 录取率checked
        trainingNum: false, // 参培人数checked
        trainingRate: false, // 参培率checked
        recruitsNum: false, // 入职人数checked
        entryRate: false, // 入职率checked
        correctNum: false, // 转正人数checked
        correctRate: false, // 转正率checked
        turnoveNum: false, // 离职人数checked
        turnoveRate: false, // 离职率checked
        indexType: 0,
        reportTypeIndex: [],
        tableLoading: false,
        isChange: false
      }
    },
    created () {
      this.setDefaultDate();
      // 获取教师资格状态列表
      this.getTeaCerList();
    },
    methods: {
      // 从后端获取教师资格状态列表
        getTeaCerList() {
          getTeaCerListService([{
        "bizCategory": "common",
        "dictCode": "TEACHER_CERTIFICATE"
      }]).then(res => {
          this.teaCerOptions = [...[{
              label: '全部',
              value: ''
          }],...res.children];
          }).catch(message => {
          this.$Message({
              message
          });
          })
      },
      /**
       * 获取数据源
       */
      async getSourceData(indexType) {
        this.tableLoading = true
        await this.$Fetch({
          url: '/api/report/fullTime/gradeSujectReport',
          data: {
            'bu': this.searchData.bu,
            'timeType': this.searchData.timeType,
            'startTime': this.searchData.startTime,
            'endTime': this.searchData.endTime,
            'indexType': indexType,
            teaCertificate: this.searchData.teaCertificate
          },
          method: 'post'
        })
          .then(res => {
            const { code, data } = res
            this.tableLoading = false
            if (code === '0'&& data) {
              if (indexType === 1) this.tableData1 = data
              if (indexType === 2) this.tableData2 = data
              if (indexType === 3) this.tableData3 = data
              if (indexType === 4) this.tableData4 = data
              if (indexType === 5) this.tableData5 = data
              if (indexType === 6) this.tableData6 = data
              if (indexType === 7) this.tableData7 = data
              if (indexType === 8) this.tableData8 = data
              if (indexType === 9) this.tableData9 = data
              if (indexType === 10) this.tableData10 = data
              if (indexType === 11) this.tableData11 = data
              if (indexType === 12) this.tableData12 = data
              if (indexType === 13) this.tableData13 = data
            }
            this.$sdk.sendEvent({
              eventId: 'click_teacher_fullTime_gradeSujectReport',
              eventParam: {
                'bu': this.searchData.bu,
                'timeType': this.searchData.timeType,
                'startTime': this.searchData.startTime,
                'endTime': this.searchData.endTime,
                'indexType': indexType,
                teaCertificate: this.searchData.teaCertificate
              }
            });
          })
          .catch(err => {
            this.$Message({
              type: 'error',
              message: err
            })
            this.tableLoading = false
          })
      },
      /**
       * 搜索操作
       */
      async handleSearch() {
        if (!this.checkedQuota.length) {
          this.$Message({
            type: 'warning',
            message: '请选择报表类型！'
          })
          return
        }
        await this.handleBatchApply()
      },
      /**
       * 设置默认日期
       */
      setDefaultDate () {
        this.searchData.date = []
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        let firstDay = (new Date(year, month, 1)).getDate()
        let lastDay = (new Date(year, month + 1, 0)).getDate()
        let formateMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
        let formateFirstDay = firstDay < 10 ? `0${firstDay}` : firstDay
        let startTime = `${year}-${formateMonth}-${formateFirstDay}`
        let endTime = `${year}-${formateMonth}-${lastDay}`
        this.searchData.date.push(startTime)
        this.searchData.date.push(endTime)
        this.searchData.startTime = startTime
        this.searchData.endTime = endTime
      },
      /**
       * 选择日期
       */
      handleSelectDate (date) {
        this.isChange = true
        let dateArray = date.split('-')
        this.searchData.startTime = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`
        this.searchData.endTime = `${dateArray[3]}-${dateArray[4]}-${dateArray[5]}`
      },
      /**
       * 导出操作
       */
      async handleExport() {
        if (!this.checkedQuota.length) {
          this.$Message({
            type: 'warning',
            message: '请选择报表类型！'
          })
          return
        }
        await this.handleBatchExpor()
      },

      /**
       * 全选
       */
      async handleCheckAllChange() {
        let indexType = 1
        this.checkedQuota = this.checkAll ? quotaOptions : []
        this.isIndeterminate = false
        this.handleCheckedTable(this.checkedQuota)
        if (this.checkAll) await this.handleBatchApply()
        // this.fillDownloadUrl()
        this.handleBatchPushIndexType()
      },
      /**
       * 单选
       */
      async handleCheckedQuotaChange(value) {
        let checkedCount = value.length
        this.checkedQuota = value
        this.checkAll = checkedCount === this.quotaList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.quotaList.length
        await this.handleCheckedTable(value)
        // this.fillDownloadUrl()
        this.handleBatchPushIndexType()
      },
      /**
       * 控制表格显示
       */
      async handleCheckedTable(value) {
        this.enrollment = value.indexOf('报名人数') > -1
        if (this.enrollment) this.indexType = 1
        this.befInterviewed = value.indexOf('待面人数') > -1
        if (this.befInterviewed) this.indexType = 2
        this.arriInterviewed = value.indexOf('到面人数') > -1
        if (this.arriInterviewed) this.indexType = 3
        this.ratioInterviewed = value.indexOf('到面率') > -1
        if (this.ratioInterviewed) this.indexType = 4
        this.rateEnrollment = value.indexOf('录取率') > -1
        if (this.rateEnrollment) this.indexType = 5
        this.trainingNum = value.indexOf('参培人数') > -1
        if (this.trainingNum) this.indexType = 6
        this.trainingRate = value.indexOf('参培率') > -1
        if (this.trainingRate) this.indexType = 7
        this.recruitsNum = value.indexOf('入职人数') > -1
        if (this.recruitsNum) this.indexType = 8
        this.entryRate = value.indexOf('入职率') > -1
        if (this.entryRate) this.indexType = 9
        this.correctNum = value.indexOf('转正人数') > -1
        if (this.correctNum) this.indexType = 10
        this.correctRate = value.indexOf('转正率') > -1
        if (this.correctRate) this.indexType = 11
        this.turnoveNum = value.indexOf('离职人数') > -1
        if (this.turnoveNum) this.indexType = 12
        this.turnoveRate = value.indexOf('离职率') > -1
        if (this.turnoveRate) this.indexType = 13
        if (this.indexType) await this.getSourceData(this.indexType)
      },
      /**
       * 批量调接口
       */
      async handleBatchApply() {
        if (this.enrollment) await this.getSourceData(1)
        if (this.befInterviewed) await this.getSourceData(2)
        if (this.arriInterviewed) await this.getSourceData(3)
        if (this.ratioInterviewed) await this.getSourceData(4)
        if (this.rateEnrollment) await this.getSourceData(5)
        if (this.trainingNum) await this.getSourceData(6)
        if (this.trainingRate) await this.getSourceData(7)
        if (this.recruitsNum) await this.getSourceData(8)
        if (this.entryRate) await this.getSourceData(9)
        if (this.correctNum) await this.getSourceData(10)
        if (this.correctRate) await this.getSourceData(11)
        if (this.turnoveNum) await this.getSourceData(12)
        if (this.turnoveRate) await this.getSourceData(13)
      },
      /**
       * 批量导出报表
       */
        handleBatchExpor() {
            let exportOptions = {
                'bu': this.searchData.bu.toString(),
                'timeType': this.searchData.timeType.toString(),
                'commissionerName': this.searchData.commissionerName,
                'startTime': this.searchData.startTime,
                'endTime': this.searchData.endTime,
                'reportType': 3,
                'indexType': this.reportTypeIndex.toString(),
                teaCertificate: this.searchData.teaCertificate
            };
            newReportControllerExport(exportOptions);
        },
      handleBatchPushIndexType() {
        this.reportTypeIndex = []
        if (this.enrollment) this.reportTypeIndex.push(1)
        if (this.befInterviewed) this.reportTypeIndex.push(2)
        if (this.arriInterviewed) this.reportTypeIndex.push(3)
        if (this.ratioInterviewed) this.reportTypeIndex.push(4)
        if (this.rateEnrollment) this.reportTypeIndex.push(5)
        if (this.trainingNum) this.reportTypeIndex.push(6)
        if (this.trainingRate) this.reportTypeIndex.push(7)
        if (this.recruitsNum) this.reportTypeIndex.push(8)
        if (this.entryRate) this.reportTypeIndex.push(9)
        if (this.correctNum) this.reportTypeIndex.push(10)
        if (this.correctRate) this.reportTypeIndex.push(11)
        if (this.turnoveNum) this.reportTypeIndex.push(12)
        if (this.turnoveRate) this.reportTypeIndex.push(13)
      },
      /**
       * 权限
       */
      checkPermission(PermissionName){
        return (this.$store.getters.permissionList || []).indexOf(PermissionName)>-1
      }
    }
  }
</script>

<style scoped lang="less">
  .personal-report{
    width: 100%;
    min-height: 200px;
    background-color: #fff;
    .search-warpper{
      margin: 20px 0 20px 10px;
    }
    .checkbox-group{
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      margin: 20px 0 20px 10px;
      .el-checkbox{
        margin-right: 10px;
      }
    }
    .table-warpper{
      padding: 20px 0;
      background-color: #fff;
      .table-title{
        width: 200px;
        font-size: 18px;
        color: #333333;
        margin-left: 10px;
    }
    }
  }
</style>
