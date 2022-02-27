
<template>
  <div class="full-time-container" v-if="permission">
      <el-form :inline="true" :model="search_data" class="search-form">
        <el-form-item label="讲师">
          <el-input v-model="search_data.teaNameOrMobile" placeholder="姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="渠道">
          <el-input v-model="search_data.channelNameOrMobile" placeholder="姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="招师跟进人">
          <el-input v-model="search_data.commissionerNameOrMobile" placeholder="姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="" class="wid-400">
          <el-date-picker
            v-model="searchActDateArea"
            clearable
            :editable="false"
            type="daterange"
            range-separator="  -  "
            placeholder="请选择日期范围"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="chooseActDate">
          </el-date-picker>
          <!-- </el-date-picker>
            <el-date-picker :editable="false" v-model="searchActDateArea" type="daterange" align="right" placeholder="选择日期" @change="chooseActDate">
            </el-date-picker> -->
        </el-form-item>
        <el-form-item label="渠道性质">
          <el-select v-model="search_data.channelType" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="内部代理" value="1"></el-option>
            <el-option label="外部代理" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师状态">
          <el-select v-model="search_data.teaState" placeholder="请选择">
            <el-option v-for="(item, i) of teaStateOption" :key="i" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-tooltip class="item" effect="dark" :disabled="clipboardData!=null" content="当前账户不是专员" placement="top">
            <el-button type="normal"
              v-clipboard:copy="clipboardData"
              v-clipboard:success="clipboardSuccessHandler"
              v-clipboard:error="clipboardErrorHandler"
              style="width: 100px;" :class="clipboardData!=null ? 'search-btn' :  'search-btn bu-disable'" size="small">我的邀请链接</el-button>
          </el-tooltip>
          <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="context-body">
        <div class="table-head">
          共 {{table_data_total}} 个招师
        </div>
        <el-table :data="table_data"  style="width:100%">
          <el-table-column prop="teaName" align="center" label="讲师姓名" >
          </el-table-column>
          <el-table-column prop="teaMobile" align="center" label="讲师手机" >
          </el-table-column>
          <el-table-column prop="channelName" align="center" label="渠道名称" >
          </el-table-column>
          <el-table-column prop="channelTypeName" align="center" label="渠道性质" >
          </el-table-column>
          <el-table-column prop="channelMobile" align="center" label="渠道手机号" >
          </el-table-column>
          <el-table-column prop="commissionerName" align="center" label="跟进人" >
          </el-table-column>
          <el-table-column prop="commissionerMobile" align="center" label="跟进人手机" >
          </el-table-column>
          <el-table-column prop="teaStateName" align="center" label="讲师状态" >
          </el-table-column>
          <el-table-column prop="regFromName" align="center" label="来源" >
          </el-table-column>
          <el-table-column prop="teaSignTime" width="120" align="center" label="报名时间" >
          </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
        </el-pagination>
      </div>

      <!--loading 效果-->
      <div>
        <loading-com ref="loadingComRef"></loading-com>
      </div>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import getTurnIntroduction from '../../api/select/queryTurnIntroduction';
import LoadingCom from '../ui/loading-com.vue'; // loading效果
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
    data() {
      return {
        searchActDateArea:[], // 搜索起止日期
        searchDate: [], // 起止日期
        search_data:{
          teaNameOrMobile:'', // 讲师
          channelNameOrMobile: '', // 渠道
          commissionerNameOrMobile: '', // 招师跟进人
          channelType: '', // 渠道性质
          pageSize: 10,
          pageNo: 1,
          teaState: '', // 老师状态
          startTime: '',
          endTime: ''
        },
        table_data:[],
        table_data_total:0,
        teaStateOption: [ // 老师状态list
          {label: '全部', value: ''},
          {label: '待预约', value: '0'},
          {label: '待面试', value: '1'},
          {label: '待二面', value: '10'},
          {label: '面试缺席', value: '11'},
          {label: '待预约培训', value: '2'},
          {label: '待培训通知', value: '20'},
          {label: '培训延期', value: '21'},
          {label: '培训不通过', value: '22'},
          {label: '待入库', value: '3'},
          {label: '待offer', value: '30'},
          {label: '待入职', value: '4'},
          {label: '待签合同', value: '35'},
          {label: '已入职', value: '5'},
          {label: '转正', value: '40'},
          {label: '离职待交接', value: '45'},
          {label: '离职已交接', value: '46'},
          {label: '离职完成', value: '6'},
          {label: '回收站', value: '7'},
          {label: '已淘汰', value: '50'},
        ],
        clipboardData: null,
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
      chooseActDate() {
        if (this.searchActDateArea[0] == null) {
          this.search_data.startTime = "";
          this.search_data.endTime = "";
        } else {
          this.search_data.startTime = new Date(this.searchActDateArea[0]).getTime();
          this.search_data.endTime = new Date(this.searchActDateArea[1]).getTime();
        }
      },
      // 查询
      search() {
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      getTableData(){
        if (this.$refs.loadingComRef) {
          this.$refs.loadingComRef.progressState = true;
        }
        getTurnIntroduction(this.search_data).then(data => {
          if (this.$refs.loadingComRef) {
            this.$refs.loadingComRef.progressState = false;
          }
          this.table_data = data.records;
          this.table_data_total = data.total;
        }).catch(message => {
          if (this.$refs.loadingComRef) {
            this.$refs.loadingComRef.progressState = false;
          }
          this.$Message({
              message: message
          });
        });
      },
      clipboardSuccessHandler(e){
        if(e.text) {
          this.$Message.success("复制成功");
        } else {
          this.$Message.error("复制失败 请稍后再试");
        }
      },
      clipboardErrorHandler(e) {
        this.$Message.warning("复制失败请稍后再试");
      },
      async getClipboardData(){
        let res = await this.$Fetch({
          url: `/api/zm-teacher-recruit-web/api/turnIntroduction/checkCommissioner`,
          method: 'post'
        });
        if(res && res.msgCode==='200' && res.data) this.clipboardData = res.data.commissionerUrl && res.data.commissionerId ? res.data.commissionerUrl : null;
      },
  },
  computed: {
      permission: function () {
        return this.$store.getters.permission;
      }
  },
  mounted() {
    this.getClipboardData();
    this.search();
  },
  components:{
    LoadingCom
  }
}
</script>
<style lang="less" scoped>
.wid-400 {
  width: 400px;
}
.bu-disable {
  color: #bfcbd9;
  cursor: not-allowed;
  background-image: none;
  background-color: #eef1f6;
  border-color: #d1dbe5;
}
</style>
