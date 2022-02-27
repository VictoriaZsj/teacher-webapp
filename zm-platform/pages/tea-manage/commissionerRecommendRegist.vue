
<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="渠道">
        <el-input v-model="search_data.channelNameOrMobile" clearable placeholder="渠道名称/手机号"></el-input>
      </el-form-item>
      <el-form-item label="招师专员">
        <el-input v-model="search_data.commissionerNameOrMobile" clearable placeholder="招师专员/手机号"></el-input>
      </el-form-item>
      <el-form-item label="渠道性质">
        <el-select v-model="search_data.channelType" clearable placeholder="请选择渠道性质">
          <el-option v-for="item in channelTypeOption" :key="item.val" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="wid-400">
        <el-date-picker
          v-model="search_data.searchActDateArea"
          type="daterange"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="  -  "
          placeholder="请选择日期范围"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button ID="preTrainingSearchBtn" class="search-btn" icon="search" type="normal" size="small" @click="search">搜索</el-button>
    </el-form>
    <div class="context-body">
      <div class="table-head">
        共 {{table_data_total}} 个渠道
      </div>
      <el-table :data="table_data"  style="width:100%">
        <el-table-column prop="channelName" align="center" label="渠道名称" >
        </el-table-column>
        <el-table-column prop="channelMobile" align="center" label="渠道手机号" >
        </el-table-column>
        <el-table-column prop="channelType" align="center" label="渠道性质" >
          <template scope="scope" >
            {{channelTypeOption[ scope.row.channelType ? Number(scope.row.channelType) : ''].label || '--'}}
          </template>
        </el-table-column>
        <el-table-column prop="commissionerName" align="center" label="专员名称" >
        </el-table-column>
        <el-table-column prop="commissionerMobile" align="center" label="专员手机号" >
        </el-table-column>
        <el-table-column prop="channelSignTime" align="center" label="注册时间" >
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
    </div>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>
<script>
import fetch from '../../../src/utils/fetch';

export default {
  data() {
    return {
      search_data: {
        pageSize: 10,
        pageNo: 1,
        searchActDateArea: [],
        channelNameOrMobile: '',
        commissionerNameOrMobile: '',
        channelType: '',
      },
      channelTypeOption: [{
        label: '全部',
        value: '',
      },{
        label: '内部代理',
        value: 1,
      },{
        label: '外部代理',
        value: 2,
      }],
      table_data: [],
      table_data_total: 0,
    }
  },
  mounted() {
    this.search();
  },
  methods: {
    checkPermission(permissionName) {
      return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
    },
    // 查询
    search() {
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    async getTableData(){
      let data = JSON.parse(JSON.stringify(this.search_data));
      for (let key in data) if (!data[key] && data[key] !== 0 && data[key] !== false) delete data[key];
      delete data.searchActDateArea;
      if(this.search_data.searchActDateArea.length && this.search_data.searchActDateArea[0]) {
        data.startTime = this.search_data.searchActDateArea[0].getTime();
        data.endTime = this.search_data.searchActDateArea[1].getTime();
      }
      let res = await this.$Fetch({
        url: `/api/zm-teacher-recruit-web/api/turnIntroduction/commissionerRelations`,
        method: 'post',
        data,
      });
      if(res && res.msgCode==='200') {
        this.table_data = res.data.records;
        this.table_data_total = res.data.total;
      }
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
  computed: {
    permission: function () {
      return this.$store.getters.permission;
    }
  }
}
</script>
<style lang="less" scoped>
.el-date-editor--daterange {
  width: 320px;
}
</style>
