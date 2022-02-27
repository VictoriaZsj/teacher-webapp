<template>
  <div class="personal-report">
    <Spin size="large" fix v-if="tableLoading" style="z-index: 1001"></Spin>
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="所属BU">
          <el-select v-model="searchData.bu" multiple placeholder="请选择">
            <el-option label="1对1" value=1></el-option>
            <el-option label="少儿" value=2></el-option>
            <el-option label="陪练" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师性质">
          <el-select v-model="searchData.timeType" multiple placeholder="请选择">
            <el-option label="普通全职" value=1></el-option>
            <el-option label="校招全职" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称">
          <el-input v-model="searchData.channelName" placeholder="请输入"></el-input>
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
        <el-form-item>
          <el-button class="search-btn" size="small" type="normal"  @click="handleExport" v-if="checkPermission('report-channel-export')">导出excel</el-button>
          <el-button class="search-btn" size="small" type="normal" icon="search" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-warpper">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        @sort-change="handleSort">
        <el-table-column
          fixed='left'
          align="center"
          prop="channelName"
          label="渠道名称"
          width="150"
          >
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="rcrtMobile"
          label="代理手机号"
          width="120"
          >
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          label="代理人类型"
          width="120"
          >
          <template scope="scope">
              {{scope.row.isStorage | isStorageFilter}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          label="代理人是否入职"
          width="120"
          >
          <template scope="scope">
              {{scope.row.isEntry | isEntryFilter}}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="reg"
          label="报名人数"
          width="120"
          >
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="seniorRatio"
          label="高中占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="juniorRatio"
          label="初中占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="primaryRatio"
          label="小学占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="youngRatio"
          label="幼小占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="preschoolRatio"
          label="学前占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="ben1Ratio"
          label="一本占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="ben2Ratio"
          label="二本占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="certificationRatio"
          label="有教资占比"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="interviewRatio"
          label="到面率"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="passInterview"
          label="面试通过人数"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="finishTrain"
          label="参培人数"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="sign"
          label="签约人数"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="regularCnt"
          label="转正人数"
          width="120">
        </el-table-column>
        <el-table-column
          sortable
          align="center"
          prop="conversionsRatio"
          label="转化率"
          width="120">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="searchData.pageSize" layout="sizes, prev, pager, next" v-bind:total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import newReportControllerExport from '../../api/action/newReportControllerExport'
  export default {
    data() {
      return {
        searchData: {
          bu: [],
          timeType: [],
          channelName: '',
          date: [],
          startTime: '',
          endTime: '',
          pageSize: 10,
          pageNum: 1
        },
        total: 1,
        tableData: [],
        sort: '',
        sortType: '',
        tableLoading: false,
        isChange: false
      }
    },
    created() {
      this.getSourceData()
    },
    methods: {
      /**
       * 获取数据源
       */
      async getSourceData() {
        this.tableLoading = true
        if (!this.isChange) this.setDefaultDate()
        await this.$Fetch({
          url: '/api/report/fullTime/AgentReport',
          data: {
            bu: this.searchData.bu,
            timeType: this.searchData.timeType,
            channelName : this.searchData.channelName,
            startTime: this.searchData.startTime,
            endTime: this.searchData.endTime,
            sort: this.sort,
            sortType: this.sortType,
            pageSize: this.searchData.pageSize,
            pageNo: this.searchData.pageNum
          },
          method: 'post'
        })
          .then(res => {
            this.tableLoading = false
            const { code, data } = res
            if (code === '0'&& data) {
              this.tableData = data.list
              this.total = data.total
            }
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
        await this.getSourceData()
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
        let exportOptions = {
          'bu': this.searchData.bu.toString(),
          'timeType': this.searchData.timeType.toString(),
          'channelName': this.searchData.channelName,
          'startTime': this.searchData.startTime,
          'endTime': this.searchData.endTime,
          'reportType': 4
        }
        await newReportControllerExport(exportOptions)
      },
      /**
       * 排序
       */
      handleSort({ column, prop, order }) {
        this.sort = prop
        this.sortType = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
        this.$nextTick(() => this.getSourceData())
      },
      /**
       * 选择页面大小
       */
      handleSizeChange(pageSize) {
        this.searchData.pageSize = pageSize
        this.searchData.pageNum = 1
        this.$nextTick(() => this.getSourceData())
      },
      /**
       * 选择页号
       */
      handleCurrentChange(currentPage) {
        this.searchData.pageNum = currentPage
        this.$nextTick(() => this.getSourceData())
      },
      /**
       * 权限
       */
      checkPermission(PermissionName){
        return (this.$store.getters.permissionList || []).indexOf(PermissionName)>-1
      }
    },
    filters: {
        isStorageFilter(val) {
            if (val === '0') {
                return '外部代理';
            }
            if (val === '1') {
                return '内部代理';
            }
            return '';
        },
        isEntryFilter(val) {
            if (val === '0') {
                return '未入职';
            }
            if (val === '1') {
                return '已入职';
            }
            return '';
        }
    }
  }
</script>

<style scoped lang="less">
  .personal-report{
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    .search-warpper{
      margin: 20px 0 20px 10px;
    }
    .table-warpper{
      width: 100%;
      min-height: 500px;
      margin-top: 40px;
    }
  }
</style>
