<template>
    <div>
      <div class="content">
        <el-table :data="tableData" style="width:100%">
            <el-table-column align="center" prop="createdTime" label="操作时间" />
            <el-table-column align="center" prop="operateTypeStr" label="操作类型" />
            <el-table-column align="center" prop="operateDetail" label="操作结果" />
            <el-table-column align="center" prop="remark" label="操作备注" />
            <el-table-column align="center" prop="createdUser" label="操作人" />
            <el-table-column align="center" label="操作">
                <template scope="scope">
                    <el-button style="font-size: 12px;" v-if="!!scope.row.id"
                        @click="seeMore(scope)" type="text">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
    </div>
</template>
<script>
import fetch from '../../../src/utils/fetch';
export default {
  data () {
    return {
        tableData: []
    }
  },
  methods:{
    getRecruitLogsUsing (id) {
        this.tableData = []
        fetch({
            url:'/api/bizCommon/getRecruitLogs',
            method: 'post',
            data: {
              teaId: id // 7726571
            }
        }).then((res) => {
            this.tableData = res.data.list
        })
    },
    seeMore (scope) {
        this.$emit('open-this-dialog', scope.row.id) // 58004 // 476 // 868 scope.row.id
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
