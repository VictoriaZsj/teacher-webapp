<template>
  <div class="context">
    <el-form :inline="true" :model="search_data" style="overflow:visible;" class="search-form">
      <el-form-item label="讲师阶段">
        <el-select v-model="search_data.periodState" placeholder="请选择">
          <el-option
            v-for="(item,index) in periodState"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师">
        <el-input v-model="search_data.keyWord" placeholder="老师ID/手机号/姓名"></el-input>
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker
          v-model="operateDate"
          type="daterange"
          format="yyyy-MM-dd"
          @change="operateDateChange"
          placeholder="请选择操作日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预约日期">
        <el-date-picker
          v-model="trainDate"
          type="daterange"
          format="yyyy-MM-dd"
          @change="trainDateChange"
          placeholder="请选择预约日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="培训结果">
        <el-select v-model="search_data.trainResultType" placeholder="请选择">
          <el-option
            v-for="(item,index) in trainResultType"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资料审核状态">
        <el-select v-model="search_data.introduceState" placeholder="请选择">
          <el-option
            v-for="(item,index) in introduceState"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题">
        <el-input v-model="search_data.trainTheme" placeholder="培训主题名"></el-input>
      </el-form-item>
      <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>

      <div class="table-head">
        <span class="table-title">共{{table_data_total}}个老师</span>
      </div>
      <el-table :data="table_data" @sort-change="sortmethod" style="width:100%">
        <el-table-column align="center" label="老师ID" prop="teaId"></el-table-column>
        <el-table-column align="center" label="老师姓名" prop="teaName"></el-table-column>
        <el-table-column align="center" label="老师手机号" prop="mobile" width="80"></el-table-column>
        <el-table-column align="center" label="老师阶段" prop="periodStateStr"></el-table-column>
        <el-table-column align="center" label="培训类型" prop="trainTypeStr"></el-table-column>
        <el-table-column align="center" label="操作时间" prop="operateTime" sortable="custom" width="120"></el-table-column>
        <el-table-column align="center" label="预约培训时间" prop="appointTrainTime" sortable="custom"
                         width="120"></el-table-column>
        <el-table-column align="center" label="培训主题" prop="trainTheme"></el-table-column>
        <el-table-column align="center" label="培训结果" prop="trainResultTypeStr"></el-table-column>
        <el-table-column align="center" label="资料审核状态" prop="introduceStateStr"></el-table-column>
        <el-table-column align="center" label="操作记录" fixed="right">
          <template scope="scope">
            <el-button type="text" size="small" @click="viewOperateLog(scope.row.teaId)">操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40, 100, 500]"
                     :page-size="search_data.pageSize"
                     layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
      <el-dialog
        title="操作记录"
        size="small"
        v-model="viewOperateLogDialog"
        @close="closeViewOperateLogDialog">
        <Spin size="large" fix v-if="viewOperateLogLoading"></Spin>
        <el-table :data="view_operate_log_table_data" width="100%">
          <el-table-column align="center" label="老师阶段" prop="periodStateStr"></el-table-column>
          <el-table-column align="center" label="操作名称" prop="operateName"></el-table-column>
          <el-table-column align="center" label="详情" prop="detail"></el-table-column>
          <el-table-column align="center" label="备注" prop="remark"></el-table-column>
          <el-table-column align="center" label="操作人" prop="operateUserName"></el-table-column>
          <el-table-column align="center" label="操作时间" prop="operateTime" width="120"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import fetch from '@/utils/fetch';
  import getPartTimeTrainList from 'api/action/getPartTimeTrainList';
  import getTrainOperateLog from 'api/action/getTrainOperateLog';

  export default {
    name: "trainList",
    data() {
      return {
        search_data: {
          endAppointTrainTime: "",
          endOperateTime: "",
          introduceState: "",
          keyWord: "",
          periodState: "",
          sortField: "",
          sortType: "",
          startAppointTrainTime: "",
          startOperateTime: "",
          trainResultType: "",
          trainTheme: "",
          pageNo: 1,
          pageSize: 10
        },
        viewOperateLogDialog: false,
        tableLoading: true,
        viewOperateLogLoading: false,
        table_data: [],
        table_data_total: 0,
        operateDate: [],
        trainDate: [],
        view_operate_log_table_data: [],
        periodState: [],
        // trainType:[],
        trainResultType: [],
        introduceState: []
      };
    },
    methods: {
      sortmethod(val) {
        this.search_data.sortField = val.prop || '';
        this.search_data.sortType = val.order ? val.order.replace('ending','') : '';
        this.search();
      },
      viewOperateLog(teaId) {
        this.viewOperateLogDialog = true;
        this.viewOperateLogLoading = true;
        getTrainOperateLog({teaId})
          .then(data => {
            this.view_operate_log_table_data = data;
            this.viewOperateLogLoading = false;
          })
          .catch(message => {
            this.$Message({
              message: message
            });
            this.viewOperateLogLoading = false;
          });
      },
      closeViewOperateLogDialog() {
        this.view_operate_log_table_data = [];
      },
      operateDateChange(val) {
        this.dateChange('OperateTime', val);
      },
      trainDateChange(val) {
        this.dateChange('AppointTrainTime', val);
      },
      dateChange(target, val) {
        if (!val) {
          this.search_data['start' + target] = '';
          this.search_data['end' + target] = '';
        } else {
          let dateResult = val.split(' ');
          this.search_data['start' + target] = dateResult[0];
          this.search_data['end' + target] = dateResult[2];
        }
      },
      handleSizeChange(val) {
        this.search_data.pageNo = 1;
        this.search_data.pageSize = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.search_data.pageNo = val;
        this.search();
      },
      search() {
        getPartTimeTrainList(this.search_data)
          .then(data => {
            this.table_data = data.list;
            this.table_data_total = data.total;
          })
          .catch(message => {
            this.$Message({
              message: message
            });
          });
        this.tableLoading = false;
      }
    },
    created() {
      fetch({
        url: '/api/zm-teacher-recruit-web/biz/common/getPartInnerEnumDict',
        method: 'get',
        params: {groupCode: 'periodState'}
      }).then(data => {
        this.periodState = [{label: '全部', value: ''}, ...data.data];
      })
      fetch({
        url: '/api/zm-teacher-recruit-web/biz/common/getPartInnerEnumDict',
        method: 'get',
        params: {groupCode: 'trainType'}
      }).then(data => {
        this.trainType = [{label: '全部', value: ''}, ...data.data];
      })
      fetch({
        url: '/api/zm-teacher-recruit-web/biz/common/getPartInnerEnumDict',
        method: 'get',
        params: {groupCode: 'trainResultType'}
      }).then(data => {
        this.trainResultType = [{label: '全部', value: ''}, ...data.data];
      })
      fetch({
        url: '/api/zm-teacher-recruit-web/biz/common/getPartInnerEnumDict',
        method: 'get',
        params: {groupCode: 'introduceState'}
      }).then(data => {
        this.introduceState = [{label: '全部', value: ''}, ...data.data];
      })
    },
    mounted() {
      this.search();
    }
  };
</script>

<style lang="less" scoped>

</style>
