<template>
  <div class="bindChannel">
    <el-form
      :inline="true"
      :model="search_data"
      class="search-form"
    >
      <el-form-item label="专员">
        <el-input
          v-model="search_data.commissionerName"
          placeholder="请输入专员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道ID">
        <el-input
          v-model="search_data.channelId"
          placeholder="请输入渠道ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲师信息">
        <el-input
          v-model="search_data.teaKeyword"
          placeholder="请输入讲师名称/手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道信息">
        <el-input
          v-model="search_data.channelKeyWord"
          placeholder="请输入渠道名称/手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道类型">
        <el-select
          v-model="search_data.channelType"
          clearable
          placeholder="请选择渠道类型"
        >
          <el-option
            v-for="(item, index) in channelType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名时间">
        <el-date-picker
          v-model="signTimes"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择日期范围"
          @change="handleTimesChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  class="search-btn" type="normal" size="small" @click="handleReset">重置</el-button>
        <el-button
          class="search-btn"
          icon="search"
          type="normal"
          size="small"
          @click="getTableData"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
        :data="table_data"
        style="width: 100%"
      >
        <el-table-column
          prop="commissionerName"
          align="center"
          label="专员"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="teaName"
          align="center"
          label="讲师姓名"
        >
        </el-table-column>
        <el-table-column
          prop="teaMobile"
          align="center"
          label="讲师手机号"
        >
        </el-table-column>
        <el-table-column
          prop="channelId"
          align="center"
          label="渠道ID"
        >
        </el-table-column>
        <el-table-column
          prop="channelName"
          align="center"
          label="渠道名称"
        >
        </el-table-column>
        <el-table-column
          prop="channelTypeName"
          align="center"
          label="渠道类型"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="channelMobile"
          align="center"
          label="渠道手机号"
        >
        </el-table-column>
        <el-table-column
          prop="signTime"
          align="center"
          label="报名时间"
        ></el-table-column>
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
</template>
<script>
import { listBindAfterTeaRelation } from 'api/commissionerAndChannel';
import getChannelType from 'api/action/getChannelType';

export default {
  data() {
    return {
      signTimes: [],
      channelType: [],
      search_data: {
        commissionerName: '',
        channelId: '',
        channelKeyWord: '',
        channelType: '',
        signStartTime: '',
        signEndTime: '',
        pageNo: 1,
        pageSize: 10
      },
      table_data: [],
      table_data_total: 0,
      tableLoading: false,
    };
  },
  methods: {
    // 列表查询
    getTableData() {
      this.tableLoading = true;
      listBindAfterTeaRelation(this.search_data)
        .then((result) => {
          const { data, code, msgContent, msgCode } = result.data;
          if (code === 200 && msgCode === '200') {
            this.table_data = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message.warning(msgContent);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
      this.$emit('upStatistic');
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
    // 表单时间控件时间处理
    handleTimesChange() {
      if (this.signTimes[0] == null) {
        this.search_data.signStartTime = '';
        this.search_data.signEndTime = '';
      } else {
        let sDate = this.$DateTool.format(new Date(times[0]).getTime(), 'yyyy-MM-dd') + ' 00:00:00';
        let eDate = this.$DateTool.format(new Date(times[1]).getTime(), 'yyyy-MM-dd') + ' 23:59:59';
        this.search_data.signStartTime = sDate;
        this.search_data.signEndTime = eDate;
      }
    },
    handleReset(){
      this.search_data = {
        commissionerName: '',
        channelId: '',
        channelKeyWord: '',
        channelType: '',
        signStartTime: '',
        signEndTime: '',
        pageNo: 1,
        pageSize: 10
      };
      this.signTimes = [];
      this.getTableData();
    },
  },
  mounted() {
    getChannelType()
    .then((data) => {
      this.channelType = data;
    })
    .catch((err) => {
      this.$message.warning(err || '渠道选项获取失败，请刷新页面')
    });
    this.getTableData();
  }
}
</script>
