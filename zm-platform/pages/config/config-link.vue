<style lang="less" scoped>
  .columnImg{
    width: 60px;
  }
  .copyText{
    position: fixed;
    top:-100px;
    left:0;
  }
</style>

<template>
    <div class="full-time-container" v-if="permission">
        <input class="copyText" type="text" id="copyText" >
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <el-button size="small" @click="add()" type="text">新增</el-button>
            </div>
            <el-table :data="table_data"  style="width:100%">
                <el-table-column prop="linkname" align="center" label="链接用途" >
                </el-table-column>
                <el-table-column prop="invitfriendpic" align="center" label="邀请好友图片" >
                  <template scope="scope" >
                    <img class="columnImg" :src="scope.row.invitfriendpic" :onerror="errorImg" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="recommendedpic" align="center" label="我的推荐图片" >
                  <template scope="scope" >
                    <img class="columnImg" :src="scope.row.recommendedpic" :onerror="errorImg" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="recommendedstrategypic" align="center" label="推荐攻略图片" >
                  <template scope="scope" >
                    <img class="columnImg" :src="scope.row.recommendedstrategypic" :onerror="errorImg" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="accumulatedincomepic" align="center" label="累计收益图片" >
                  <template scope="scope" >
                    <img class="columnImg" :src="scope.row.accumulatedincomepic" :onerror="errorImg" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="recommendedrulepic" align="center" label="推荐规则图片" >
                  <template scope="scope" >
                    <img class="columnImg" :src="scope.row.recommendedrulepic" :onerror="errorImg" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="degreeStr" align="center" label="操作" >
                  <template scope="scope" >
                      <el-button size="small" @click="edit(scope.row.id,scope.row)" type="text">编辑</el-button>
                      <el-button v-if="scope.row.status == '1'" size="small" @click="stop(scope.row.id)" type="text">停用</el-button>
                      <el-button v-if="scope.row.status == '0'" size="small" @click="start(scope.row.id)" type="text">启用</el-button>
                      <el-button size="small" @click="copy(scope.row.linkurl)" type="text">复制链接</el-button>
                  </template>
                </el-table-column>
            </el-table>


            <!--添加dialog-->
            <el-dialog :white="true" title="新增" v-model="configLinkSettingDialog" size="small" @close="cancelConfigLinkSettingDialog">
                <config-link-add :optiondata="optionData" :configLinkId="currentID" :viewState="configLinkSettingDialog"  :config-link-id="currentID" @confirm="confirmConfigLinkSettingDialog" @cancel="cancelConfigLinkSettingDialog"></config-link-add>
            </el-dialog>

        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import configLinkAdd from '../dialog/config_link_add';
import agentLinkList from '../../api/select/agentLinkList';
import updateAgentState from '../../api/action/updateAgentState';

const errImg = require('../../../src/images/error.png');
export default {
    data() {
        return {
          configLinkSettingDialog:false,
          currentID:"",
          optionData:{},
          table_data:[],
          errorImg: 'this.src="' + errImg + '";',
          tableLoading:false
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 查询
        search() {
            this.tableLoading = true;
            agentLinkList().then(data => {
              this.tableLoading = false;
              this.table_data = data;
            }).catch(message => {
              this.$Message({
                  message: message
              });
              this.tableLoading = false;
            });
        },
        add(){
          this.configLinkSettingDialog = true;
        },
        edit(id,item){
          this.currentID = id;
          this.optionData = item;
          this.configLinkSettingDialog = true;
        },
        stop(id){
          let parm = {
            id:id,
            status:0
          };
          updateAgentState(parm).then(data => {
            this.$Message({
                message: "停用成功"
            });
            this.search();
          }).catch(message => {
            this.$Message({
                message: message
            });
          });
        },
        start(id){
          let parm = {
            id:id,
            status:1
          };
          updateAgentState(parm).then(data => {
            this.$Message({
                message: "启用成功"
            });
            this.search();
          }).catch(message => {
            this.$Message({
                message: message
            });
          });
        },
        copy(link){
          var e = document.getElementById("copyText");
          e.value = link;
          e.select(); // 选择对象
          document.execCommand("Copy"); // 执行浏览器复制命令
        },
        confirmConfigLinkSettingDialog(){
          this.currentID = "";
          this.optionData = {};
          this.configLinkSettingDialog = false;
          this.search();
        },
        cancelConfigLinkSettingDialog(){
          this.currentID = "";
          this.optionData = {};
          this.configLinkSettingDialog = false;
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
      'config-link-add':configLinkAdd
    }
}
</script>
