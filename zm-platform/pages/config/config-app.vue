<style lang="less" scoped>

</style>

<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form" style="overflow:visible;">
            <el-form-item label="活动链接">
                <el-select v-model="search_data.linkid" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in act_link_data" :key="index" :label="item.linkname" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <el-button size="small" @click="add()" type="text">创建配置</el-button>
            </div>
            <el-table :data="table_data"  style="width:100%">
                <el-table-column prop="appName" align="center" label="app名称" >
                  <template scope="scope" >
                      {{scope.row.app | appFilter}}
                  </template>

                </el-table-column>
                <el-table-column prop="linkTitle" align="center" label="链接名称" >
                </el-table-column>
                <el-table-column prop="url" align="center" label="url" width="600" >
                </el-table-column>
                <el-table-column prop="title" align="center" label="标题" >
                </el-table-column>
                <el-table-column prop="agentType" align="center" label="类型" >
                </el-table-column>

                <el-table-column prop="degreeStr" align="center" label="操作" >
                  <template scope="scope" >
                      <el-button size="small" @click="update(scope.row)" type="text">修改</el-button>
                      <el-button size="small" @click="del(scope.row.id,1)" type="text">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>

            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination> -->

            <!--添加dialog-->
            <el-dialog :white="true" title="新增配置" v-model="actSettingDialog" size="small" @close="cancelactSettingDialog">
                <app-config :viewState="actSettingDialog" :itemdata="itemdata" :currentID="currentID" @confirm="confirmactSettingDialog" @cancel="cancelactSettingDialog"></app-config>
            </el-dialog>



        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import appConfig from '../dialog/app_config';
import { appAgentList } from '../../../src/data/index.js';

import agentLinkList from '../../api/select/agentLinkList';
import findAgentAppConfigList from '../../api/select/findAgentAppConfigList';
import delAgentAppConfig from '../../api/action/delAgentAppConfig';

export default {
    data() {
        return {
          actSettingDialog:false,
          shareSettingDialog:false,
          rewardConfigDialog:false,//奖励配置
          currentID:"",
          itemdata:{},
          search_data:{
            linkid:'',
            activitystarttime:'',
            activityendtime:''
          },
          act_link_data:[],
          table_data:[],
          table_data_total:0,
          tableLoading:false,
        }
    },
    filters:{
      appFilter(val){
        let _val = "";
        for(let i = 0; i < appAgentList.length; i++){
          if(appAgentList[i].value == val){
            _val = appAgentList[i].label;
          }
        }
        return _val;
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
        // 查询
        search() {
            this.search_data.pageNo = 1;
            this.getTableData();
        },
        getTableData(){
          this.tableLoading = true;
          findAgentAppConfigList(this.search_data).then(data => {
            this.tableLoading = false;
            this.table_data = data;
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
        update(data){
          this.itemdata = data;
          this.currentID = data.id;
          this.actSettingDialog = true;
        },
        del(id){
          let parm = {
            id:id
          };

          this.$MessageBox.confirm(`确定要删除吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delAgentAppConfig(parm).then(data => {
              this.$Message({
                  message:"操作成功"
              });
              this.getTableData();
            }).catch(message => {
              this.$Message({
                  message:message
              });
            });

          }).catch(message => {
            this.operationsState = false;
          });


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
      'app-config':appConfig,
    }
}
</script>
