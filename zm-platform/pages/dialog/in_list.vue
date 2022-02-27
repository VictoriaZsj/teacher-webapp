<template>
  <div>
    <div class="content">
      <el-table :data="table_data" style="width:100%">
        <el-table-column v-for="(item,index) in tableTitle"
                         :key="index"
                         :align="item.align"
                         :label="item.label"
                         :min-width="item.width"
                         :prop="item.prop">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize"
                     layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  const tableTitle = [
    {prop: "agentName", label: "渠道名称", width: "100px", align: 'center'},
    {prop: "activeTitle", label: "活动名称", width: "150px", align: 'center'},
    {prop: "teaName", label: "讲师名称", width: "80px", align: 'center'},
    {prop: "teaMobile", label: "讲师手机号", width: "100px", align: 'center'},
    {prop: "teaStatus", label: "讲师状态", width: "80px", align: 'center'},
    {prop: "teaType", label: "讲师类型", width: "100px", align: 'center'},
    {prop: "applyTime", label: "报名时间", width: "125px", align: 'center'},
    {prop: "entryTime", label: "入库/入职时间", width: "125px", align: 'center'},
    {prop: "entryEndTime", label: "奖励截止时间", width: "125px", align: 'center'},
    {prop: "signContractTime", label: "签合同时间", width: "100px", align: 'center'},
    {prop: "entryAward", label: "入库/入职奖励(元)", width: "100px", align: 'center'},
    {prop: "regularAward", label: "转正奖励(元)", width: "100px", align: 'center'},
    {prop: "entryTimeAward", label: "入职时长奖励(元)", width: "100px", align: 'center'},
  ];

  export default {
    data() {
      return {
        tableTitle,
        table_data: [],
        table_data_total: 0,
        search_data: {
          pageSize: 10,
          pageNo: 1
        }
      }
    },
    props: {
      id: "",
      month: "",
      state:"",
      viewState: false//false表示页面关闭，true表示页面展开
    },
    watch: {
      viewState(val) {
        if (!!val) {
          this.getTableData();
        }
      }
    },
    methods: {
      getTableData() {
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/channelRec/agent/queryEntryTea',
          method: 'post',
          data: {agentId: this.id, month: this.month, ...this.search_data,state:this.state}
        }).then(data => {
          if (data.msgCode === '200') {
            this.table_data = data.data.records;
            this.table_data_total = data.data.total;
          } else {
            this.$Message.error({
              message: data.msgContent
            });
            this.table_data = [];
            this.table_data_total = 0;
          }
        }).catch(message => {
          this.$Message({
            message: message
          });
        });
      },
      handleSizeChange(pageSize) {
        this.search_data.pageSize = pageSize;
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      handleCurrentChange(currentPage) {
        this.search_data.pageNo = currentPage;
        this.getTableData();
      },
    },
    mounted: function () {
      this.getTableData();
    }
  }
</script>
<style scoped>
  .content {
    max-height: 400px;
    overflow-y: auto;
  }

  .control {
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }

  .el-row {
    padding: 10px;
  }

  .el-row div:first-child {
    line-height: 30px;
  }

  .el-row:after {
    content: '';
    display: table;
    clear: both;
  }
</style>
