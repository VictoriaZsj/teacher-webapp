<template>
    <div>
      <div class="content">
          <el-table :data="userDetailDataReserveRecords" style="width: 100%">
            <el-table-column align="center" label="跟进记录" width="180">
              <template scope="scope">
                跟进记录{{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" :formatter="transformDate" prop="createdTime" label="操作时间" width="200">
            </el-table-column>
            <el-table-column align="center" prop="operateResult" label="预约结果" width="180">
            </el-table-column>
            <el-table-column align="center" :formatter="transformDate" prop="nextAppointTime" label="下次预约计划" width="200">
            </el-table-column>
            <el-table-column align="center" :formatter="transformDate" prop="interviewTime" label="面试时间" width="200">
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注">
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>
<script>
export default {
  props:{
      userDetailDataReserveRecords:Array
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
