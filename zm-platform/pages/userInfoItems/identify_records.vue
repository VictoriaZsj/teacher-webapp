<template>
    <div>
      <div class="content">
          <el-table :data="userDetailDataIdentifyRecords" style="width:100%">
            <el-table-column align="center" prop="operateTime" label="操作时间" width="200">
            </el-table-column>
            <el-table-column align="center" prop="operateName" label="操作人" width="180">
            </el-table-column>
            <el-table-column align="center" prop="operateTypeVal" label="操作类型" width="200">
            </el-table-column>
            <el-table-column align="center" label="操作结果" >
              <template scope="scope">
                {{scope.row.operateResultVal}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark">
            </el-table-column>
          </el-table>
      </div>
    </div>
</template>
<script>
export default {
  props:{
    userDetailDataIdentifyRecords:Array
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
