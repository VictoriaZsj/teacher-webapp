<style lang="less" scoped>

</style>

<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
            <el-form-item label="活动链接">
                <el-select v-model="search_data.linkid" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in act_link_data" :key="index" :label="item.linkname" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动标题">
                <el-input v-model="search_data.activitytitle" placeholder="输入活动标题"></el-input>
            </el-form-item>
            <el-form-item label="活动时间段">
                <el-date-picker :editable="false" v-model="searchActDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseActDate" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动状态">
                <el-select multiple v-model="search_data.statusArray" placeholder="请选择">
                    <el-option label="未开始" value="0"></el-option>
                    <el-option label="进行中" value="1"></el-option>
                    <el-option label="已结束" value="2"></el-option>
                    <el-option label="已关闭" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <el-button size="small" @click="add()" type="text">创建活动</el-button>
            </div>
            <el-table :data="table_data"  style="width:100%">
                <el-table-column prop="id" align="center" label="活动ID" >
                </el-table-column>
                <el-table-column prop="linkTitle" align="center" label="活动链接" >
                </el-table-column>
                <el-table-column prop="activitytitle" align="center" label="活动标题" >
                </el-table-column>
                <el-table-column prop="activitystarttime" align="center" label="活动开始时间" >
                </el-table-column>
                <el-table-column prop="activityendtime" align="center" label="活动结束时间" >
                </el-table-column>
                <el-table-column prop="registAgentNum" align="center" label="报名代理人数" >
                </el-table-column>
                <el-table-column prop="registTeacherNum" align="center" label="报名讲师人数" >
                </el-table-column>
                <el-table-column prop="databaseNum" align="center" label="入库人数" >
                </el-table-column>
                <el-table-column prop="status" align="center" label="活动状态" >
                  <template scope="scope" >
                      {{scope.row.status | statueFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="活动配置" >
                  <template scope="scope" >
                      <el-button size="small" @click="setting(scope.row.id,'act',scope.row)" type="text">配置</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="奖励配置" >
                  <template scope="scope" >
                      <el-button size="small" @click="setting(scope.row.id,'reward',scope.row)" type="text">配置</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="分享配置" >
                  <template scope="scope" >
                      <el-button size="small" @click="setting(scope.row.id,'share',scope.row)" type="text">配置</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="操作" >
                  <template scope="scope" >
                      <el-button v-if="scope.row.status == 0 || scope.row.status == 1" size="small" @click="stop(scope.row.id,3)" type="text">停用</el-button>
                      <el-button v-if="scope.row.status == 3" size="small" @click="stop(scope.row.id,1)" type="text">启用</el-button>
                      <el-button size="small" @click="view(scope.row.id)" type="text">查看数据</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>

            <!--添加dialog-->
            <el-dialog :white="true" title="活动配置" v-model="actSettingDialog" size="small" @close="cancelactSettingDialog">
                <act-setting :viewState="actSettingDialog" :itemdata="itemdata" :config-link-id="currentID" @confirm="confirmactSettingDialog" @cancel="cancelactSettingDialog"></act-setting>
            </el-dialog>

            <el-dialog :white="true" title="分享配置" v-model="shareSettingDialog" size="small" @close="cancelshareSettingDialog">
                <share-setting :viewState="shareSettingDialog"  :config-link-id="currentID" @confirm="confirmshareSettingDialog" @cancel="cancelshareSettingDialog"></share-setting>
            </el-dialog>

            <el-dialog :white="true" class="el-dialog-fixed1000" title="奖励配置" v-model="rewardConfigDialog" size="small" @close="cancelRewardConfigDialog">
                <reward-setting :viewState="rewardConfigDialog"  :config-link-id="currentID" @confirm="confirmaRewardConfigDialog" @cancel="cancelRewardConfigDialog"></reward-setting>
            </el-dialog>

        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import shareSetting from '../dialog/share_setting';
import actSetting from '../dialog/act_setting';
import rewardSetting from '../dialog/reward_setting';

import agentLinkList from '../../api/select/agentLinkList';
import agentActivityList from '../../api/select/agentActivityList';
import updateActivtyState from '../../api/action/updateActivtyState';

export default {
    data() {
        return {
          searchActDateArea:[],
          actSettingDialog:false,
          shareSettingDialog:false,
          rewardConfigDialog:false,//奖励配置
          currentID:"",
          itemdata:{},
          search_data:{
            linkid:'',
            activitytitle:'',
            statusArray:[],
            activitystarttime:'',
            activityendtime:''
          },
          act_link_data:[],
          table_data:[],
          table_data_total:0,
          tableLoading:false,
          pickerOptions: {
              shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                  }
              }, {
                  text: '最近一个月',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                  }
              }, {
                  text: '最近三个月',
                  onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                  }
              }]
          },
        }
    },
    filters:{
      statueFilter(val){
        if(val == "0"){
          return "未开始"
        }
        if(val == "1"){
          return "进行中"
        }
        if(val == "2"){
          return "已结束"
        }
        if(val == "3"){
          return "已关闭"
        }
        return ""
      }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
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
        getLinkList() {
            agentLinkList().then(data => {
              this.act_link_data = data;
            }).catch(message => {
              this.$Message({
                  message: message
              });
            });
        },
        chooseActDate() {
            if(this.searchActDateArea[0] == null){
                this.search_data.activitystarttime = "";
                this.search_data.activityendtime = "";
            }else{
              let sDate = new Date(this.searchActDateArea[0]).getTime();
              let eDate = new Date(this.searchActDateArea[1]).getTime();
              this.search_data.activitystarttime = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00";
              this.search_data.activityendtime = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59";

            }
        },
        setting(id,type,data){
          switch (type) {
            case "act":
              this.currentID = id;
              this.itemdata = data;
              this.actSettingDialog = true;//活动配置
              break;
            case "reward":
              this.currentID = id;
              this.itemdata = data;
              this.rewardConfigDialog = true;//奖励配置
              break;
            case "share":
              this.currentID = id;
              this.itemdata = data;
              this.shareSettingDialog = true;//分享配置
              break;
            default:
          }
        },
        // 查询
        search() {
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        getTableData(){
          this.tableLoading = true;
          agentActivityList(this.search_data).then(data => {
            this.tableLoading = false;
            this.table_data = data.list;
            this.table_data_total = data.total;
          }).catch(message => {
            this.tableLoading = false;
            this.$Message({
                message: message
            });
          });
        },
        add(){
          this.actSettingDialog = true;
        },
        actSetting(id){
          this.currentID = id;
          this.actSettingDialog = true;
        },
        stop(id,statue){
          let parm = {
            id:id,
            status:statue
          };
          updateActivtyState(parm).then(data => {
            this.$Message({
                message:"操作成功"
            });
          }).catch(message => {
            this.$Message({
                message:message
            });
          });
        },
        start(id){
          let parm = {
            id:id,
            status:1
          };
          updateActivtyState(parm).then(data => {
            this.$Message({
                message:"操作成功"
            });
          }).catch(message => {
            this.$Message({
                message:"1对1个数溢出"
            });
          });
        },
        view(id){
          this.$router.push("/config/recomend",);
          this.$router.push({ name: '招师代理-代理推荐数据',  query: { id: id } })
        },
        confirmactSettingDialog(){
          this.actSettingDialog = false;
          this.currentID = "";
          this.getTableData();
        },
        cancelactSettingDialog(){
          this.actSettingDialog = false;
          this.currentID = "";
          this.itemdata = null;
        },
        confirmshareSettingDialog(){
          this.shareSettingDialog = false;
          this.currentID = "";
        },
        cancelshareSettingDialog(){
          this.shareSettingDialog = false;
          this.currentID = "";
        },
        confirmaRewardConfigDialog(){
          this.rewardConfigDialog = false;
        },
        cancelRewardConfigDialog(){
          this.rewardConfigDialog = false;
          this.currentID = "";
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
      this.getLinkList();
      this.search();
    },
    components:{
      'act-setting':actSetting,
      'share-setting':shareSetting,
      'reward-setting':rewardSetting
    }
}
</script>
