<template>
    <div>
      <div class="content">
          <el-table :data="userDetailDataLeavingRecords" style="width:100%">
            <el-table-column align="center" prop="opreateTime" label="操作时间">
            </el-table-column>
            <el-table-column align="center" prop="opreateName" label="操作姓名">
            </el-table-column>
            <el-table-column align="center" label="操作说明" prop="remark">
            </el-table-column>
            <el-table-column align="center" prop="teaName" label="老师姓名">
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>
<script>
export default {
  props:{
    userDetailDataLeavingRecords:Array
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
