<template>
  <div>
    <div class="content">
      <el-table :data="table_data" style="width:100%">
        <el-table-column align="center" label="代理姓名" prop="agentName"  >
        </el-table-column>
        <el-table-column align="center" label="活动标题" prop="activeTitle">
        </el-table-column>
        <el-table-column align="center" label="代理手机号" prop="agentMobile">
        </el-table-column>
        <el-table-column align="center" label="讲师姓名" prop="teaName">
        </el-table-column>
        <el-table-column align="center" label="讲师手机号" prop="teaMobile">
        </el-table-column>
        <el-table-column align="center" label="讲师状态" prop="teaStatus">
        </el-table-column>
        <el-table-column align="center" label="讲师类型" prop="teaType">
        </el-table-column>
        <el-table-column align="center" label="报名时间" prop="applyTime">
        </el-table-column>
        <el-table-column align="center" label="入库/入职时间" prop="entryTime">
        </el-table-column>
        <el-table-column align="center" label="入库/入职截止时间" prop="entryEndTime">
        </el-table-column>
        <el-table-column align="center" label="入职/入库奖励（元）" prop="entryAward">
        </el-table-column>
        <el-table-column align="center" label="转正奖励（元）" prop="regularAward">
        </el-table-column>
        <el-table-column align="center" label="入职时长奖励（元）" prop="entryTimeAward">
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import queryEntryTea from '../../api/select/queryEntryTea'

export default {
    data() {
        return {
          table_data:[],
          table_data_total:0,
          search_data:{
            pageSize:10,
            pageNo:1
          }
        }
    },
    props:{
        id:"",
        month:"",
        state:"",
        viewState:false//false表示页面关闭，true表示页面展开
    },
    watch:{
      viewState (val) {
        if(!!val){
          this.getTableData();
        }
      }
    },
    methods:{
        getTableData () {
          let parm = {
            agentId:this.id,
            state:this.state,
            month:this.month
          };
          Object.assign(parm,this.search_data);
          queryEntryTea(parm).then(data => {
            this.table_data = data.list;
            this.table_data_total = data.total;
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
    mounted:function(){
      this.getTableData();
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
