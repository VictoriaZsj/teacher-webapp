<template>
  <div class="change-recommender">
    <div class="search-form">
      <el-form :inline="true">
        <el-form-item label="讲师">
          <el-input
            v-model="searchParam.nameOrMobile"
            @keyup.enter.native="search"
            placeholder="支持姓名/手机号"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="变更时间">
          <el-date-picker
            v-model="searchParam.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleChange"
            align="right">
          </el-date-picker>
          <button class="btn" @click.stop="search()">查询</button>
          <router-link class="btn" tag="button" to="/change_recommender" >返回</router-link>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border>
        <el-table-column
          label="变更时间"
          prop="changeTime"
          align="center">
        </el-table-column>
        <el-table-column
          label="讲师姓名"
          align="center">
          <template scope="scope">
            <router-link :to="{name: '渠道管理-渠道招师数据', query: {teaName: scope.row.teaName}}">
              {{scope.row.teaName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="讲师手机号"
          prop="teaMobile"
          align="center">
        </el-table-column>
        <el-table-column
          label="变更后渠道名称"
          align="center">
          <template scope="scope">
            <router-link
              :to="{name: '招师代理-渠道管理', query: {currChannelName: scope.row.currChannelName, preChannelName: ''}}">
              {{scope.row.currChannelName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="变更后渠道类型"
          prop="currChannelType"
          align="center">
        </el-table-column>
        <el-table-column
          label="变更后渠道手机号"
          prop="currChannelMobile"
          align="center">
        </el-table-column>
        <el-table-column
          label="变更前渠道名称"
          align="center">
          <template scope="scope">
            <router-link
              :to="{name: '招师代理-渠道管理', query: {currChannelName: '', preChannelName: scope.row.preChannelName}}">
              {{scope.row.preChannelName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="变更前渠道类型"
          prop="preChannelType"
          align="center">
        </el-table-column>
        <el-table-column
          label="变更前渠道手机号"
          prop="preChannelMobile"
          align="center">
        </el-table-column>
        <el-table-column
          label="变更原因"
          prop="changeReason"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          v-for="(item,index) in tableTitle"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width">
        </el-table-column> -->
        <el-table-column
          label="变更证明"
          align="center">
          <template scope="scope">
            <el-button
              v-for="(logFile, index) in scope.row.logFiles"
              :key="index"
              size="small"
              type="text"
              @click="downloadLogFile(logFile.fileId);return false;"
            >{{logFile.fileName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="变更人"
          prop="operator"
          align="center"></el-table-column>
      </el-table>
      <el-pagination
        :current-page="searchParam.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchParam.pageSize"
        layout="sizes,prev, pager, next"
        @size-change="sizeChange"
        @current-change="currentChange"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import editRecommender from './editRecommender'
  const tableTitle = [
    {prop: "changeTime", label: "变更时间", width: "", align: 'center'},
    {prop: "teaName", label: "讲师姓名", width: "80px", align: 'center'},
    {prop: "teaMobile", label: "讲师手机号", width: "100px", align: 'center'},
    {prop: "currChannelName", label: "变更后渠道名称", width: "", align: 'center'},
    {prop: "currChannelType", label: "渠道类型", width: "", align: 'center'},
    {prop: "currChannelMobile", label: "渠道手机号", width: "", align: 'center'},
    {prop: "preChannelName", label: "变更前渠道名称", width: "", align: 'center'},
    {prop: "changeReason", label: "变更原因", width: "", align: 'center'},
    // {prop: "entryTime", label: "变更结果", width: "", align: 'center'},
    // {prop: "logFiles", label: "变更证明", width: "", align: 'center'},
    // {prop: "operator", label: "变更人", width: "", align: 'center'},
  ]
  export default {
    name: 'changeRecommender',
    data() {
      return {
        tableTitle: [...tableTitle],
        tableData: [],
        total: 1,
        searchParam: {
          pageNo: 1,
          pageSize: 10,
          nameOrMobile: '',
          time: '',
          startTime: '',
          endTime: '',
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    components: {
      editRecommender
    },
    created() {
      this.getChangeLog()
    },
    methods: {
      getChangeLog() {
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/change-recommender/query/change-log",
          data: { ...this.searchParam },
          method: "post"
        })
          .then(res => {
            const {code, data} = res
            if (code === 200) {
              const {list, totalCount, totalPage} = data
              this.total = totalCount
              this.tableData = list.length ? list : []
            }
          })
      },
      handleChange(date) {
        let targetIndex = date.indexOf('至')
        let startTime = date.substring(0, targetIndex)
        let endTime = date.substring(targetIndex+1)
        this.searchParam = {...this.searchParam, startTime, endTime}
      },
      search() {
        this.getChangeLog()
      },
      sizeChange(val) {
        this.searchParam.pageSize = val
        this.searchParam.pageNo = 1
        this.search()
      },
      currentChange(val) {
        this.searchParam.pageNo = val
        this.search()
      },
      handleChangeRecommender() {
        this.recommenderDialog = true
      },
      handleCancel() {
        this.recommenderDialog = false
      },
      downloadLogFile(fileId) {
        this.$Fetch({
          url: "/api/zm-teacher-recruit-web/api/change-recommender/file/download",
          data: { fileId },
          method: "post"
        })
          .then(res => {
            const {code, data} = res
            if (code === 200) {
              const {url} = data
              window.open(url)
              // var a = document.createElement('a');          // 创建一个a节点插入的document
              // var event = new MouseEvent('click')           // 模拟鼠标click点击事件
              // a.download = '图片名字.jpeg'
              // a.referrer="no-referrer|origin|unsafe-url"                // 设置a节点的download属性值
              // a.href = url                                // 将图片的src赋值给a节点的href
              // a.dispatchEvent(event)

            }
          })
      }
    },
  }
</script>

<style lang="less" scoped>
  .change-recommender{
    min-height: 560px;
    padding: 20px;
    background-color: #fff;
    .search-form{
      .btn{
        width: 90px;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
        outline: none;
        border: 1px solid #409eff;
        border-radius: 5px;
        color: #606266;
        margin-left: 20px;
        &:hover{
          cursor: pointer;
        }
      }
    }
    .notify{
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
  }

</style>
