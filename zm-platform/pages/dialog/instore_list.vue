<template>
  <div>
    <el-table :data="table_data" style="width:100%">
        <el-table-column prop="timeTypeStr" align="center" label="代理姓名" >
        </el-table-column>
        <el-table-column prop="grade" align="center" label="参于活动" >
        </el-table-column>
        <el-table-column prop="subject" align="center" label="员工姓名" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="讲师类型" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="状态" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="报名时间" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="入库/入职截止时间" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="入职时间" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="入职/入库奖励（元）" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="转正奖励（元）" >
        </el-table-column>
        <el-table-column prop="degreeStr" align="center" label="入职时长奖励（元）" >
        </el-table-column>

    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
    </el-pagination>
  </div>
</template>
<script>
import modifyInterviewState from '../../api/action/modifyInterviewState'

export default {
    data() {
        return {
            table_data:[]
        }
    },
    props:{
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      }
    },
    methods:{
    },
    mounted:function(){

    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
    }
    .control{
      text-align: right;
      padding-top: 20px;
      background-color: white;
    }
    .el-row{
        padding: 10px;
    }
    .el-row div:first-child{
        line-height: 30px;
    }
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
</style>
