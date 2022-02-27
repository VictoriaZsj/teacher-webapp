<style lang="less" scoped>

</style>

<template>
    <div class="full-time-container" v-if="permission">
      <el-form :inline="true" :model="search_data" class="search-form" style="overflow:visible;">
            <el-form-item label="结算月份">
                <el-date-picker :editable="false" v-model="month"  type="month"  placeholder="选择月"></el-date-picker>
            </el-form-item>
            <el-form-item label="代理姓名">
                <el-input v-model="search_data.agentName" placeholder="代理姓名"></el-input>
            </el-form-item>
            <el-form-item label="选择状态">
              <el-select v-model="search_data.state" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="待审核" value="1"></el-option>
                  <el-option label="待支付" value="2"></el-option>
                  <el-option label="已支付" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
              <el-button size="small" :loading="batchAuditLoading" @click="audits()" type="text">批量审核</el-button>
              <el-button size="small" :loading="batchPayLoading" @click="pays()" type="text">批量支付</el-button>
            </div>
            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
              <el-table-column align="center" type="selection" width="55">
              </el-table-column>
                <el-table-column prop="month" align="center" label="结算月份" >
                </el-table-column>
                <el-table-column prop="agentName" align="center" label="代理姓名" >
                </el-table-column>
                <el-table-column prop="state" align="center" label="状态" >
                  <template scope="scope" >
                    {{scope.row.state|stateFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="entryPeople" align="center" label="入职/入库人数" >
                </el-table-column>
                <el-table-column prop="award" align="center" label="代理奖励（元）" >
                </el-table-column>
                <el-table-column align="center" label="操作" >
                  <template scope="scope" >
                    <el-button size="small" @click="seeInstore(scope.row.agentId,scope.row.month,scope.row.state)" type="text">查看入库名单</el-button>
                    <el-button v-if="scope.row.state == 1" size="small" @click="audit(scope.row.agentId,scope.row.month)" type="text">审核</el-button>
                    <el-button v-if="scope.row.state == 2" size="small" @click="pay(scope.row.agentId,scope.row.month)" type="text">支付</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>

            <!--添加dialog-->
            <el-dialog :white="true" title="查看入库名单" v-model="storeDialog" size="large" >
                <in-store-list :viewState="storeDialog"  :id="currentID" :state="currentState" :month="currentMonth"></in-store-list>
            </el-dialog>

        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import inStoreList from '../dialog/in_store_list';
import queryAgentAward from '../../api/select/queryAgentAward'//支付
import auditAgentAward from '../../api/action/auditAgentAward'//审核
import payAgentAward from '../../api/action/payAgentAward'//支付



export default {
    data() {
        return {
          batchAuditLoading:false,
          batchPayLoading:false,
          tableLoading:false,
          table_data:[],
          table_data_total:0,
          storeDialog:false,
          currentID:'',
          currentMonth:'',
          currentState:'',
          selectName: [],
          month:'',
          search_data:{
            month:'',
            agentName:'',
            state:''
          }
        }
    },
    filters:{
      stateFilter(val){
        if(val == "1"){
          return "待审核";
        }
        if(val == "2"){
          return "待支付";
        }
        if(val == "3"){
          return "已支付";
        }
      }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        selectTable(val) {
            let ids = [];
            val.forEach((value) => {
                let p = {
                  agentId:value.agentId.toString(),
                  month:value.month,
                  state:value.state
                };
                ids.push(p);
            });
            this.selectName = ids;
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
        getTableData(){
          if(!!this.month){
            let y = this.month.getFullYear();
            let m = this.month.getMonth()+1;
            let date = "";
            if(m >= 10){
              date = "" + y + m;
            }else{
              date = "" + y + + "0" +m;
            }
            this.search_data.month = date;
          }else{
            this.search_data.month = "";
          }
          this.tableLoading = true;
          queryAgentAward(this.search_data).then(data => {
            this.tableLoading = false;
            this.table_data = data.list;
            this.table_data_total = data.total;
          }).catch(message => {
            this.tableLoading = false;
            this.$Message({
                message
            });
          });
        },
        // 查询
        search() {
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        seeInstore(id,month,state){
          this.currentID = id;
          this.currentMonth = month;
          this.currentState = state;
          this.storeDialog = true;
        },
        setParms(needState,state){
          let p = [];
          for(let i = 0; i < this.selectName.length; i++){
            if(this.selectName[i].state == needState){
              let item = {
                "agentId":this.selectName[i].agentId,
              	"state":state,
              	"month":this.selectName[i].month
              };
              p.push(item);
            }
          }
          return p;
        },
        audits(){
          if(this.selectName.length == 0){
            this.$Message({
                message: "请选择数据"
            });
            return;
          }
          let parm = this.setParms(1,2);
          if(parm.length == 0){
            this.$Message({
                message: "没有符合条件的数据"
            });
            return;
          }
          this.$MessageBox.confirm(`确定要审核吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.batchAuditLoading = true;
            auditAgentAward(parm).then(data => {
              this.batchAuditLoading = false;
              this.$Message({
                  message: "操作成功"
              });
              this.getTableData();
            }).catch(message => {
              this.batchAuditLoading = false;
              this.$Message({
                  message: message
              });
            });
          }).catch(message => {
            this.operationsState = false;
          });
        },
        pays(){
          if(this.selectName.length == 0){
            this.$Message({
                message: "请选择数据"
            });
            return;
          }
          let parm = this.setParms(2,3);
          if(parm.length == 0){
            this.$Message({
                message: "没有符合条件的数据"
            });
            return;
          }
          this.$MessageBox.confirm(`确定要支付吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.batchPayLoading = true;
            payAgentAward(parm).then(data => {
              this.batchPayLoading = false;
              this.$Message({
                  message: "操作成功"
              });
              this.getTableData();
            }).catch(message => {
              this.batchPayLoading = false;
              this.$Message({
                  message: message
              });
            });
          }).catch(message => {
            this.operationsState = false;
          });
        },
        audit(id,month){
          let parm = [{
          	"agentId":id,
          	"state":"2",
          	"month":month
          }];
          this.$MessageBox.confirm(`确定要审核吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            auditAgentAward(parm).then(data => {
              this.$Message({
                  message: "操作成功"
              });
              this.getTableData();
            }).catch(message => {
              this.$Message({
                  message: message
              });
            });
          }).catch(message => {
            this.operationsState = false;
          });
        },
        pay(id,month){
          let parm = [{
          	"agentId":id,
          	"state":"3",
          	"month":month
          }];
          this.$MessageBox.confirm(`确定要支付吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            payAgentAward(parm).then(data => {
              this.$Message({
                  message: "操作成功"
              });
              this.getTableData();
            }).catch(message => {
              this.$Message({
                  message: message
              });
            });
          }).catch(message => {
            this.operationsState = false;
          });
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
      this.search();
    },
    components:{
      'in-store-list':inStoreList
    }
}
</script>
