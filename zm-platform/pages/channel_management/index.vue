<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form" label-width="110px">
      <el-form-item label="渠道信息">
        <el-input v-model="search_data.channelKeyword" placeholder="输入渠道名称/ID"></el-input>
      </el-form-item>
      <el-form-item label="渠道类型">
        <el-select v-model="search_data.channelType" placeholder="选择渠道类型">
          <el-option label="全部" value=""></el-option>
          <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in channelType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="search_data.mobile" :maxlength="11" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="跟进人">
        <el-input v-model="search_data.follower" placeholder="输入跟进人"></el-input>
      </el-form-item>
      <el-form-item label="下次投放时间">
        <el-date-picker v-model="search_data.nextPutTime" type="date" placeholder="选择下次投放时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="是否长期合作">
        <el-select v-model="search_data.isPersistence" placeholder="选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="绑定招师专员">
        <el-input v-model="search_data.commissionerName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="是否绑定招师专员">
        <el-select v-model="search_data.bindCommissionerState" placeholder="选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" value="YES"></el-option>
          <el-option label="否" value="NO"></el-option>
        </el-select>
      </el-form-item>

      <el-button class="search-btn" type="normal" size="small" @click="edit('')">新增</el-button>
      <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
    </el-form>
    <div class="context-body">
      <p>共{{table_data_total}}个渠道的统计</p>
      <br>
      <el-table :data="table_data" style="width:100%">
        <el-table-column prop="id" align="center" label="渠道ID"></el-table-column>
        <el-table-column prop="teaName" align="center" label="渠道名称"></el-table-column>
        <el-table-column prop="channelType" align="center" label="渠道类型">
          <template scope="scope">
            <span>{{channelType.length>0?channelType.find(item => item.value == scope.row.channelType).label:''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" align="center" label="手机号">
          <template scope="scope">
            <el-button type="text" @click="getReferMobile(scope.row)"
                  class="detailsBtn" v-if="scope.row.mobile&&!scope.row.currentRow">点击查看手机号</el-button>
            <span v-show="scope.row.currentRow">{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nextPutTime" align="center" label="下次投放时间">
          <template scope="scope">
            <span>{{scope.row.nextPutTime|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="follower" align="center" label="跟进人"></el-table-column>
        <el-table-column prop="commissionerName" align="center" label="绑定招师专员"></el-table-column>
        <el-table-column prop="createdTime" align="center" label="创建时间">
          <template scope="scope">
            <span>{{scope.row.createdTime|timeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template scope="scope">
            <el-button size="small" type="text" @click="lookLink(scope.row)"
                       v-if="scope.row.fulltimeConfigId||scope.row.parttimeEntryConfigId||scope.row.schoolFulltimeConfigId">
              查看链接
            </el-button>
            <el-button size="small" type="text" @click="setSign(scope.row)">配置报名页</el-button>
            <el-button size="small" type="text" @click="edit(scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="changeLog(scope.row)">变更记录</el-button>
            <el-button size="small" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="search_data.pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="table_data_total"
      ></el-pagination>
    </div>
    <edit ref="editDialog" @successBack="search" :channel-type="channelType" :editRow="editRow"></edit>
    <show-link ref="showLinkDialog"></show-link>
    <sign ref="signDialog" @successBack="search"></sign>
    <div>
    <el-dialog title="查看变更记录" v-model="showChangeLog" >
        <el-table :data="gridData">
          <el-table-column property="operatorTime" label="操作时间" ></el-table-column>
          <el-table-column property="operatorName" label="操作人" ></el-table-column>
          <el-table-column property="sourceName" label="操作名称"></el-table-column>
          <el-table-column property="changeContent" label="详情"></el-table-column>
        </el-table>
        <el-pagination
        style="text-align:center"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="dialog_pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="dialog_pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="dialog_total"
      ></el-pagination>
    </el-dialog>
    </div>


  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>

</template>

<script>
  import edit from './components/edit.vue';
  import showLink from './components/showLink.vue';
  import sign from './components/sign.vue';
  import getChannelType from './../../api/action/getChannelType';
  import {getTeacherDetailInfo, getMobileInfo} from 'api/select/getTeacherNum'; // 获取手机号
  import {getNotAttrWithEmpty} from '../../../src/utils/assist';

  export default {
    components: {
      edit,
      showLink,
      sign,
    },
    data() {
      return {
        gridData:[],
        dialog_pageNo:1,
        dialog_pageSize:10,
        dialog_total:0,
        editRow:{},
        requestTeaSecretState:false,//表示是否在请求教师信息
        requestTeaSecretTime:10,
        requestTeaSecretInterval:null,
        channelType: [],
        showChangeLog:false,
        // 搜素字段
        search_data: {
          teaName: '',
          channelKeyword: '',
          channelType: '',
          mobile: '',
          nextPutTime: '',
          follower: '',
          isPersistence: '',
          commissionerName: '',
          bindCommissionerState: '',
          pageNo: 1,
          pageSize: 10,
        },
        table_data: [],
        table_data_total: 0,
      };
    },
    filters: {
      dateFilter(val) {
        return val ? `${val.slice(0, 10)}` : '-';
      },
      timeFilter(val) {
        return val ? `${val.slice(0, 10)} ${val.slice(11, 19)}` : '-';
      },
    },
    created() {
      getChannelType()
        .then((data) => {
          this.channelType = data;
        })
        .catch((err) => {
        });
    },
    methods: {
      changeLog(row){
        this.showChangeLog=true;
        this.getDialogTableData(row.id)
      },
      getReferMobile(row){

        // if(this.requestTeaSecretState){
        //   this.$Message({
        //     message:"请等待上次查询完成"
        //   });
        //   return;
        // }
        // if(this.requestTeaSecretTime < 5){
        //   this.$Message({
        //     message:"单次查询间隔为5秒钟"
        //   });
        //   return;
        // }

        // this.requestTeaSecretTime = 0;
        // this.requestTeaSecretState = true;
        let elementList = document.querySelectorAll(".detailsBtn");
        for(let i = 0; i < elementList.length; i++){
          elementList[i].innerText = "点击查看手机号";
        }
        // let parm = {
        //   channelId:row.id
        // };
        row.mobile= "正在查询...";
        getMobileInfo(row.id).then(ret => {
          row.mobile = ret;
          row.currentRow = true;
        }).catch(err => {
          err.message && this.$Message.error(err.message)
        })
        /**
         * 因 SEM-1631 问题, 弃用
         */
        // getTeacherDetailInfo(parm).then(data => {
        //  row.mobile = data.mobile;
        //  row.currentRow=true;
        // }).catch(message => {
        //   row.mobile='消息不存在';
        //   row.currentRow=true;
        //   this.$Message({
        //     message
        //   });
        // });
      },
      // 获取表单数据
      getTableData() {
        const nextPutTime = this.search_data.nextPutTime
          ? +new Date(this.search_data.nextPutTime)
          : '';
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/api/agentMember/search',
          data: getNotAttrWithEmpty({
            ...this.search_data,
            nextPutTime,
          }),
          method: 'post',
        })
          .then(res => {
            if (res.msgCode === '200') {
              this.table_data = res.data.records;
              this.table_data_total = res.data.total;
            } else {
              this.$Message.error(res.msgContent);
            }
          })
          .catch(err => {
            this.$Message({
              type: 'error',
              message: err,
            });
          });
      },
      getDialogTableData(id){
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/api/channelLog/listLog',
          data: getNotAttrWithEmpty({
            "channelId": id,
            "pageNo": this.dialog_pageNo,
            "pageSize": this.dialog_pageSize,
          }),
          method: 'post',
        })
          .then(res => {
            if (res.msgCode === '200') {
              this.gridData = res.data.list;
              this.dialog_total = res.data.total;
            } else {
              this.$Message.error(res.msgContent);
            }
          })
          .catch(err => {
            this.$Message({
              type: 'error',
              message: err,
            });
          });
      },
      handleSizeChange2(pageSize) {
        this.dialogData.pageSize = pageSize;
        this.dialogData.pageNo = 1;
        this.getDialogTableData();
      },
      handleCurrentChange2(currentPage) {
        this.dialogData.pageNo = currentPage;
        this.getDialogTableData();
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
      search() {
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      edit(row) {
        this.$refs.editDialog.show(row);
        if(row){
          let parm = {
            channelId:row.id
          };
          getTeacherDetailInfo(parm).then(data => {
            this.editRow=data;
          }).catch(message => {

            this.$Message({
              message
            });
          });
        }


      },
      lookLink(row) {
        this.$refs.showLinkDialog.show(row);
      },
      setSign(row) {
        this.$refs.signDialog.show(row);
      },
      del(id) {
        this.$MessageBox.confirm(`确定删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.deleteFun(id);
          })
          .catch(() => {
          });
      },
      deleteFun(teacherChannelId) {
        this.$Fetch({
          url: '/api/zm-teacher-recruit-web/api/agentMember/removeTeacherChannel',
          method: 'post',
          data: {
            teacherChannelId,
          },
        })
          .then(res => {
            if (res.msgCode === '200') {
              this.$Message.success('渠道删除成功');
              this.search();
            } else {
              this.$Message.error(res.msgContent);
            }
          })
          .catch(err => {
            this.$Message({
              type: 'error',
              message: err,
            });
          });
      },
    },
    computed: {
      permission: function () {
        return this.$store.getters.permission;
      },
    },
    mounted() {
      this.search_data.teaName = this.$route.query.currChannelName || this.$route.query.preChannelName || '';
      this.getTableData();
    },
  };
</script>
<style >
  .el-dialog__body{
    background-color: #ffffff;
  }
</style>
