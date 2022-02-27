<template>
    <div>
      <div class="content">
          <el-table :data="userIntroductionAuditRecords" style="width: 100%">
            <el-table-column align="center" prop="createdAt" label="操作时间" width="200">
            </el-table-column>
            <el-table-column align="center" prop="reviewer" label="审核人" width="180">
            </el-table-column>
            <el-table-column align="center" prop="checkStateStr" label="审核结果" width="200">
            </el-table-column>
            <el-table-column align="center" prop="reviewMark" label="备注">
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>
<script>
export default {
  props:{
      userIntroductionAuditRecords:Array
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
