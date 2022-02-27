<template>
    <div>
      <div class="content">
        <div class="title">
          <span>操作时阶段：</span>
          <el-select style="width: 140px;" placeholder="请选择"
              v-model="search_data.type" @change="searchDataType">
            <el-option v-for="item in options"
              :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData" style="width:100%">
          <el-table-column align="center" prop="createdTime" label="操作时间">
          </el-table-column>
          <el-table-column align="center" prop="createdUser" label="操作人">
          </el-table-column>
          <el-table-column align="center" prop="teaStateStr" label="操作状态">
          </el-table-column>
          <el-table-column align="center" prop="teaPeriodStr" label="操作阶段">
          </el-table-column>
          <el-table-column align="center" prop="operateTypeStr" label="操作类型">
          </el-table-column>
          <el-table-column align="center" prop="operateDetail" label="操作详情">
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注">
          </el-table-column>
        </el-table>
        <div>
          <el-pagination @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="search_data.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="search_data.pageSize"
              layout="sizes, prev, pager, next"
              v-bind:total="total">
          </el-pagination>
        </div>
      </div>
    </div>
</template>
<script>
import fetch from '../../../src/utils/fetch';
export default {
  data () {
    return {
      total: 0,
      search_data: {
        pageNo: 1,
        pageSize: 10,
        "teaId": '',
        "type": ""
      },
      options: [
        { value: '', label: '全部' },
        { value: '1', label: '待分配管理' },
        { value: '2', label: '面试管理' },
        { value: '3', label: '培训管理' },
        { value: '4', label: '入职管理' },
        { value: '5', label: '试用期管理' },
        { value: '6', label: '转正管理' },
        { value: '7', label: '离职管理' },
        { value: '8', label: '回收站' }
      ],
      tableData: []
    }
  },
  filters:{
    transferBuFilter (val) {
      if(val == "1"){
        return "掌门1对1";
      }
      if(val == "2"){
        return "掌门少儿";
      }
      if(val == "3"){
        return "掌门陪练";
      }
      return "";
    },
    transferReasonTypeFilter (val) {
      if(val == "1"){
        return "员工离职";
      }
      if(val == "2"){
        return "名单分配";
      }
      if(val == "3"){
        return "其他";
      }
      return "";
    }
  },
  methods:{
    searchDataType (type) {
      this.search_data.type = type
      this.getAlllogs()
    },
    handleSizeChange (val) {
      this.search_data.pageSize = val
      this.getAlllogs()
    },
    handleCurrentChange (val) {
      this.search_data.pageNo = val
      this.getAlllogs()
    },
    transformDate(row, column) {
        return this.$DateTransform(row[column.property]);
    },
    getAlllogs () {
      let data = {
        pageNo: this.search_data.pageNo + '',
        pageSize: this.search_data.pageSize + '',
        "teaId": this.search_data.teaId,
        "type": this.search_data.type
      }
      fetch({
        url:'/api/bizCommon/getAllLogs',
        method: 'post',
        data
      }).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    getData (id) {
      this.search_data.teaId = id
      this.getAlllogs()
    }
  }
}
</script>
<style scoped media="screen">
  .content{
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    margin: -20px;
    background-color: white;
  }
  .control{
    text-align: right;
    padding-top: 20px;
    margin-top: 20px;
    background-color: #f4f5f5;
  }
  .title {
    padding: 5px;
    margin-bottom: 10px;
    background: #f4f5f5;
    text-align: right;
  }
</style>
