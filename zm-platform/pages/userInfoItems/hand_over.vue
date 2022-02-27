<template>
    <div>
      <div class="content">
          <el-table :data="userDetailDataHandsRecords" style="width:100%">
            <el-table-column align="center"  :formatter="transformDate" prop="createdTime" label="操作时间" width="200">
            </el-table-column>
            <el-table-column align="center" prop="createdUserText" label="操作人" width="180">
            </el-table-column>
            <el-table-column align="center" prop="transferBu" label="移交BU" width="200">
              <template scope="scope">
                {{scope.row.transferBu | transferBuFilter}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="toCommissionerIdText" label="移交对象" width="200">
            </el-table-column>
            <el-table-column align="center" label="移交原因" prop="transferReasonType">
              <template scope="scope">
                {{scope.row.transferReasonType | transferReasonTypeFilter}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="其他原因" prop="remark">
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>
<script>
export default {
  props:{
    userDetailDataHandsRecords:Array
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
      transformDate(row, column) {
          return this.$DateTransform(row[column.property]);
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
</style>
