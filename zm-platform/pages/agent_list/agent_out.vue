<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
            <el-form-item label="关键词">
                <el-input v-model="search_data.keyWord" placeholder="输入代理姓名或手机号"></el-input>
            </el-form-item>
            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>
        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <el-button type="text" size="small" @click="agentAddSetting()">新增</el-button>
            </div>

            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column prop="pId" align="center" label="ID" width="60">
                </el-table-column>
                <el-table-column prop="teaName" align="center" label="代理名称" width="120">
                </el-table-column>
                <el-table-column align="center" label="代理类型" width="200">
                    <template scope="scope" >
                        {{getTypeText(scope.row.agentType)}}
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" align="center" label="手机号" width="100">
                </el-table-column>
                <el-table-column prop="agencySchool" align="center" label="代理学校" width="100">
                </el-table-column>
                <el-table-column align="center" label="是否入库" width="100">
                    <template scope="scope" >
                        {{scope.row.readyAt | getReadyAtText}}
                    </template>
                </el-table-column>
                <el-table-column prop="bankName" align="center" label="银行卡开户行" width="100">
                </el-table-column>
                <el-table-column prop="bankAccount" align="center" label="银行卡信息" width="100">
                </el-table-column>
                <el-table-column prop="createTime" align="center" label="录入时间" width="200">
                </el-table-column>
                <el-table-column align="center" label="代理的老师类型" width="100">
                    <template scope="scope" >
                        {{scope.row.timeType | getTimeType}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="300">
                    <template scope="scope" >
                        <el-button size="small" @click="viewAgentLink(scope.row.teaName,scope.row.agentType,scope.row.mobile)" type="text">查看链接</el-button>
                        <el-button size="small" @click="changeAgent(scope.row.pId)" type="text">修改</el-button>
                        <el-button size="small" @click="delAgent(scope.row.pId)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>

            <!--新增dialog-->
            <el-dialog :title="agent_title" v-model="agentAddDialog" size="small" @close="cancelAgentAdd">
                <agent-add :tea-id="teaId" :viewState="agentAddDialog"  @confirm="confirmAgentAdd" @cancel="cancelAgentAdd"></agent-add>
            </el-dialog>
            <!--查看代理链接-->
            <el-dialog title="查看代理链接" v-model="agentLinkDialog" size="small" @close="closeAgentLinkDialog">
              <div class="agentUrlPanel">
                <el-row v-show="currentUserAgentType.indexOf('0') != -1">
                  <el-col :span="6">1对1兼职代理链接</el-col>
                  <el-col :span="18">
                    {{getAgentUrl(0)}}
                  </el-col>
                </el-row>
                <el-row v-show="currentUserAgentType.indexOf('2') != -1">
                  <el-col :span="6">1对1全职代理链接</el-col>
                  <el-col :span="18">
                    {{getAgentUrl(2)}}
                  </el-col>
                </el-row>
                <el-row v-show="currentUserAgentType.indexOf('3') != -1">
                  <el-col :span="6">少儿兼职代理链接</el-col>
                  <el-col :span="18">
                    {{getAgentUrl(3)}}
                  </el-col>
                </el-row>
                <el-row v-show="currentUserAgentType.indexOf('4') != -1">
                  <el-col :span="6">少儿全职代理链接</el-col>
                  <el-col :span="18">
                    {{getAgentUrl(4)}}
                  </el-col>
                </el-row>
                <el-row v-show="currentUserAgentType.indexOf('5') != -1">
                  <el-col :span="6">陪练代理链接</el-col>
                  <el-col :span="18">
                    {{getAgentUrl(5)}}
                  </el-col>
                </el-row>
              </div>
            </el-dialog>

        </div>

    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>

const agentDomain = ENV.agentDomain;
const agentPeilianDomain = ENV.agentPeilianDomain;
const _aesKey = ENV.aesKey;

import agent_add from './agent_add';
import agentMember from '../../api/select/agentMember'
import deleteOperatingAgent from '../../api/action/deleteOperatingAgent'
var CryptoJS = require("crypto-js");
var aesKey = CryptoJS.enc.Utf8.parse(_aesKey);


export default {
    data() {
        return {
            // 搜素字段
            search_data: {
                isInternal:"0",
                keyWord: '',//string
                pageNo: 0,//number
                pageSize: 10,//number
                // sortField:"updated_time",
                // sortType:"desc"
            },
            agent_title:"新增",
            teaId:null,
            agentAddDialog:false,
            currentUserAgentType:'',
            currentUserName:'',
            currentUserTel:'',
            // 初始table数据
            table_data: [],
            agentLinkDialog:false,
            tableLoading: true,
            table_data_total:0,
            selectName:[]
        }
    },
    filters:{
      getReadyAtText(val){
        if(val){
          return "已入库";
        }
        if(!val){
          return "未入库";
        }
        return "";
      },
      getTimeType(val){
        if(val == "0"){
          return "兼职";
        }
        if(val == "1"){
          return "全职";
        }
        if(val == "2"){
          return "校招全职";
        }
        if(val == "3"){
          return "公校兼职";
        }
        if(val == "4"){
          return "全职学科班主任";
        }
        return "";
      }
    },
    methods: {
        getTypeText(val){
          let text = "";
          let typeList = val.toString().split(',');
          let len = typeList.length;
          if(len > 0){
            for(let i = 0; i < len; i++){
              let itemVal = this.getTeaTypeByNumber(typeList[i]);
              if(itemVal){
                text = text + itemVal + ",";
              }
            }
            text = text.substring(0,text.length-1);
          }
          return text;
        },
        getTeaTypeByNumber(val){
          if(val == "0"){
            return "1对1兼职";
          }
          if(val == "2"){
            return "1对1全职";
          }
          if(val == "3"){
            return "少儿兼职";
          }
          if(val == "4"){
            return "少儿全职";
          }
          if(val == "5"){
            return "陪练代理链接";
          }
          return "";
        },
        //查看代理链接
        viewAgentLink (name,type,tel) {
          this.agentLinkDialog = true;
          this.currentUserAgentType = type.toString();
          this.currentUserName = name;
          this.currentUserTel = tel;
        },
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 获取表单数据
        getTableData() {
          this.tableLoading = true;
          agentMember(this.search_data).then(data => {
            this.table_data = data.list;
            this.table_data_total = data.total;
            this.tableLoading = false;
          }).catch(message => {
            this.$Message({
                message
            });
            this.tableLoading = false;
          });
        },
        closeAgentLinkDialog () {
          this.agentLinkDialog = false;
        },
        handleSizeChange(pageSize) {
            this.search_data.pageSize = pageSize;
            this.search_data.pageNo = 0;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
            this.search_data.pageNo = currentPage;
            this.getTableData();
        },
        // 转化时间格式
        transformDate(row, column) {
            return this.$DateTransform(row[column.property]);
        },
        selectTable(val) {
            let ids = [];
            val.forEach((value) => {
                ids.push(value.teaId.toString());
            });
            this.selectName = ids;
        },
        //删除代理
        delAgent (id) {
          this.$MessageBox.confirm(`确定删除吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteOperatingAgent({agentId:id}).then(data => {
              this.$Message({
                  message:"删除成功"
              });
              this.getTableData();
            }).catch(message => {
              this.$Message({
                  message
              });
            });
          }).catch(message => {
            this.operationsState = false;
          });
        },
        // 查询
        search() {
            this.search_data.pageNo = 0;
            this.getTableData();
        },
        changeAgent(id){
          this.teaId = id;
          this.agent_title = "修改";
          this.agentAddDialog = true;
        },
        //完成新增后
        confirmAgentAdd(){
          this.agentAddDialog = false;
          this.getTableData();
        },
        //取消新增后
        cancelAgentAdd(){
          this.agentAddDialog = false;
        },
        agentAddSetting () {
          this.teaId = null;
          this.agent_title = "新增";
          this.agentAddDialog = true;
        },
        aesEscape(tel){
          var encrypPwd = CryptoJS.AES.encrypt(tel, aesKey, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                      });
          return encodeURIComponent(encrypPwd.toString());
        },
        getAgentUrl(type,name){
          let url = "";
          switch (type) {
            case 0:
              url = agentDomain + "mobile/teacher-register?from="+encodeURIComponent(this.currentUserName);
              break;
            case 2:
              url = agentDomain + "mobile/teacher-register?wechat_account=zmforum&from="+encodeURIComponent(this.currentUserName);
              break;
            case 3:
              url = agentPeilianDomain + "teacher-register/kid?from="+encodeURIComponent(this.currentUserName)+"&requestInfo="+this.aesEscape(this.currentUserTel);
              break;
            case 4:
              url = agentDomain + "mobile/teacher-register?wechat_account=zmforum&from="+encodeURIComponent(this.currentUserName);
              break;
            case 5:
              url = agentPeilianDomain + "teacher-register/peilian/?from="+encodeURIComponent(this.currentUserName)+"&requestInfo="+this.aesEscape(this.currentUserTel);
              break;
            default:

          }
          return url;
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        this.getTableData();
    },
    components:{
      'agent-add':agent_add
    }
}
</script>
<style scoped="">
  .agentUrlPanel{

  }
  .el-row{
    padding: 5px;
  }
  .agentUrlPanel .el-row:after{
    content: '';
    display: block;
    clear: both;
  }
</style>
