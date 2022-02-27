<template>
  <div class="personal-report">
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="报名时间">
          <div class="noneIcon">
            <el-date-picker
              v-model="searchTime"
              type="datetimerange"
              :clearable="false"
              format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="search-btn"
            size="small"
            type="normal"
            @click="handleSearchOrExport($event, true)"
            v-if="checkPermission('report-partTime-personReport-export')"
          >导出excel</el-button>
          <el-button
            class="search-btn"
            size="small"
            type="normal"
            icon="search"
            @click="handleSearchOrExport"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-warpper table-warpper-popover-fix">
      <el-table :data="tableData" border @sort-change="sortChange">
        <el-table-column prop="ptTeaSchoolDistrict" sortable="custom" label="区域"></el-table-column>
        <el-table-column prop="enrollNum" sortable="custom" label="报名人数"></el-table-column>
        <el-table-column prop="videoUploadNum" sortable="custom" label="上传视频人数"></el-table-column>
        <el-table-column prop="checkNum" sortable="custom" label="已审核人数"></el-table-column>
        <el-table-column prop="checkPassNum" sortable="custom" label="录取人数"></el-table-column>
        <el-table-column prop="passRate" sortable="custom" label="录取率(%)"></el-table-column>
        <el-table-column prop="storageNum" sortable="custom" label="入库人数"></el-table-column>
        <el-table-column prop="threeDayAgoEnrollNum" sortable="custom" label="3天前报名人数"></el-table-column>
        <el-table-column prop="skipNum" sortable="custom" label="跑单人数"></el-table-column>
        <el-table-column prop="skipRate" sortable="custom" label="流失率(%)"></el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchData.pageSize"
          layout="sizes, prev, pager, next"
          v-bind:total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
const config = require('@config/index.js');
import { formatDate } from '../../../src/components/date-picker/util.js';
import fetch from '../../../src/utils/fetch';
export default {
  data() {
    return {
      total: 0,
      searchTime: [],
      searchData: {
        pageNo: 1,
        pageSize: 10,
        searchStartTime: '',
        searchEndTime: '',
        sort: '',
        sortType: '',
      },
      tableData: [],
    };
  },
  created() {
    // 默认选择一周内的数据
    const format = 'yyyy-MM-dd';
    let old = formatDate(
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      format
    );
    let start = formatDate(new Date(), format);
    this.searchTime[0] = `${old} 00:00:00`;
    this.searchTime[1] = `${start} 00:00:00`;
    this.handleSearchOrExport();
  },
  methods: {
    // 搜索
    handleSearchOrExport($event, isExport = false) {
      if (!this.searchTime[0]) {
        this.$Message.error('请选择报名时间段!');
        return;
      }
      let { pageNo, pageSize, sort, sortType } = this.searchData;
      let options = {
        sort,
        sortType,
        pageNo,
        pageSize,
        searchStartTime: formatDate(this.searchTime[0], 'yyyy-MM-dd HH:mm:ss'),
        searchEndTime: formatDate(this.searchTime[1], 'yyyy-MM-dd HH:mm:ss'),
      };
      // 导出
      if (isExport) {
        let BASE =
          process.env.NODE_ENV === 'development' ? config.dev.proxypath : '';
        open(
          `${BASE}/api/teacher-web/api/report/export?sort=${sort ||
            ''}&sortType=${sortType || ''}&pageNo=${pageNo ||
            ''}&pageSize=${pageSize ||
            ''}&searchStartTime=${options.searchStartTime ||
            ''}&searchEndTime=${options.searchEndTime || ''}&reportType=5`
        );
        return;
      }
      fetch({
        url: '/api/report/partTime/personReport',
        method: 'post',
        data: options,
      })
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
          this.$sdk.sendEvent({
            eventId: 'click_teacher_partTime_personReport',
            eventParam: options,
          });
        })
        .catch(err => {
          if (err) {
            this.$Message.error(err);
          }
        });
    },
    // 查询权限
    checkPermission(PermissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1
      );
    },
    // 字段排序
    sortChange(sort) {
      this.searchData.pageNo = 1;
      (this.searchData.sort = sort.prop),
        (this.searchData.sortType =
          sort.order === 'ascending' ? 'asc' : 'desc');
      this.handleSearchOrExport();
    },
    handleCurrentChange(val) {
      this.searchData.pageNo = val;
      this.handleSearchOrExport();
    },
    handleSizeChange(val) {
      this.searchData.pageNo = 1;
      this.searchData.pageSize = val;
      this.handleSearchOrExport();
    },
  },
};
</script>
<style scoped lang="less">
.personal-report {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  .search-warpper {
    margin: 20px 0 20px 10px;
    .noneIcon {
      .el-date-editor--datetimerange {
        i {
          display: none;
        }
      }
    }
  }
  .table-warpper {
    width: 100%;
    min-height: 500px;
    margin-top: 40px;
  }
}
</style>
<style lang="less">
</style>

