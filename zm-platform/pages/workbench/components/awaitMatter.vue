<template>
  <div class="await-matter">
    <div class="search">
      <el-date-picker
        class="date"
        v-model="date"
        type="daterange"
        placeholder="选择日期范围"
        @change="handleDateChange"
      >
      </el-date-picker>
      <el-button type="primary" class="search-btn" @click="handleSearch"
        >查询</el-button
      >
    </div>
    <div class="tab" :class="{ 'first-tab': activeTab === '1' }">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === item.value }"
        @click="handleClick(item)"
      >
        {{ item.label }}
      </div>
    </div>

    <div
      style="
            padding-top: 40px;
            color: #ccc;
            height: 70%;
            width: 100%;
            text-align: center;
          "
      v-show="!hasData"
    >
      <img src="~zm-images/no-content.png" />
      <p>暂无数据</p>
    </div>

    <div
      v-if="activeTab == '1'"
      style="padding: 0 20px; height: 70%; overflow: scroll"
      v-show="hasData"
    >
      <template>
        <div class="todo-tip">
          <div class="all-report" @click="searchImproveInfo('clear')">全部</div>
          未绑定:
          <span @click="searchImproveInfo('unbind')">{{
            unBindCount || '0'
          }}</span>
        </div>
        <el-table
          max-height="266"
          :data="tableData"
          stripe
        >
          <el-table-column
            :prop="item.prop"
            :type="item.type"
            align="center"
            :label="item.label"
            :width="item.width ? item.width : 100"
            :show-overflow-tooltip="item.tooltip"
            v-for="(item, i) in config1"
            :key="i"
          >
            <template scope="scope">
              <el-button
                size="mini"
                v-if="item.prop == 'mobile' && scope.row.mobile == ''"
                type="text"
                @click="getMobileFromReportPhone(scope.row)"
                class="detailsBtn"
              >
                {{ scope.row.queryPhoneKey ? '点击查看手机号' : '-' }}
              </el-button>

              <el-tooltip
                class="item"
                effect="light"
                placement="right"
                v-if="item.prop == 'link'"
              >
                <span slot="content">{{ scope.row[item.prop] }}</span>
                <span class="detailsBtn">
                  {{
                    scope.row[item.prop]
                      ? scope.row[item.prop].slice(0, 20) + '...'
                      : scope.row[item.prop]
                  }}
                </span>
              </el-tooltip>

              <span v-if="item.prop == 'mobile' && scope.row.mobile">{{
                scope.row.mobile
              }}</span>

              <span v-if="item.prop === 'bindStatus'">{{
                scope.row.bindStatus | bindStatusFilter
              }}</span>

              <span
                v-if="
                  item.prop != 'mobile' &&
                    item.prop != 'link' &&
                    item.prop != 'bindStatus'
                "
                >{{
                  item.prop == 'completionRatio'
                    ? (scope.row[item.prop] || '0') + '%'
                    : scope.row.ifnull
                    ? scope.row[item.prop] || scope.row.ifnull
                    : scope.row[item.prop]
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div
      v-if="activeTab == '2'"
      style="padding: 0 20px; height: 70%; overflow: scroll"
    >
      <template>
        <el-table
          max-height="286"
          :data="tableData"
          stripe
        >
          <el-table-column
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? item.width : 100"
            v-for="(item, i) in config2"
            :key="i"
          >
            <template scope="scope">
              <el-button
                size="mini"
                v-if="item.prop == 'mobile' && scope.row.mobile == ''"
                type="text"
                @click="getReferMobile(scope.row)"
                class="detailsBtn"
                >点击查看手机号
              </el-button>
              <el-tooltip
                class="item"
                effect="light"
                placement="right"
                v-if="item.prop == 'link'"
              >
                <span slot="content">{{ scope.row[item.prop] }}</span>
                <span class="detailsBtn"
                  >{{
                    scope.row[item.prop]
                      ? scope.row[item.prop].slice(0, 20) + '...'
                      : scope.row[item.prop]
                  }}
                </span>
              </el-tooltip>
              <span v-if="item.prop == 'mobile' && scope.row.mobile">{{
                scope.row.mobile
              }}</span>
              <span v-if="item.prop != 'mobile' && item.prop != 'link'">{{
                item.prop == 'completionRatio'
                  ? scope.row[item.prop] + '%'
                  : scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div v-show="activeTab" style="margin-right: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="sizes, prev, pager, next"
        v-bind:total="total"
      ></el-pagination>
      <br />
    </div>
  </div>
</template>
<script>
import authMixins from './mixins/auth';

import getTeacherSecretInfo from '../../../api/select/getTeacherSecretInfo'; // 获取手机号
import getImproveInfoFromReportPhone from '../../../api/select/improveInfoFromReportPhone';

const start = new Date().getTime() - 1000 * 3600 * 24 * 7;

const end = new Date();
export default {
  name: 'AwaitMatter',
  mixins: [authMixins],
  data() {
    return {
      tableData: [],
      todoList: [],
      value1: 1,
      value2: new Date(2016, 9, 10, 18, 40),
      tipType: 'normal',
      hasData: null,
      defaultDate: [
        this.$DateTool.format(start, 'yyyy-MM-dd') + ' 00:00:00',
        this.$DateTool.format(end, 'yyyy-MM-dd') + ' 23:59:59',
      ],
      config1: [
        // {
        //   type: 'index',
        //   width: 50,
        // },
        {
          prop: 'friendAddTime',
          label: '加好友日期',
          width: 200,
        },
        {
          prop: 'friendNickname',
          label: '好友昵称',
          width: 130,
          ifnull: '-',
        },
        {
          prop: 'friendRemark',
          label: '好友备注',
          ifnull: '-',
          width: 200,
          tooltip: true,
        },
        {
          prop: 'mobile',
          label: '手机号',
          width: 120,
        },
        {
          prop: 'bindStatus',
          label: '是否绑定TeaID',
          width: 120,
        },
        {
          prop: 'completionRatio',
          label: '信息完善度',
        },
        {
          prop: 'teaStateDesc',
          label: '老师状态',
          ifnull: '-',
        },
      ],
      config2: [
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'weChat',
          label: '微信号',
        },
        {
          prop: 'mobile',
          label: '手机号',
          width: 150,
        },
        {
          prop: 'nowCommissionerName',
          label: '当前专员',
        },
        {
          prop: 'infoCommissionerName',
          label: '完善信息专员',
        },
        {
          prop: 'link',
          label: '专属链接',
          width: 200,
        },
        {
          prop: 'completionRatio',
          label: '信息完善度',
        },
        {
          prop: 'isInterviewStr',
          label: '是否可约面',
        },
        {
          prop: 'teaStateStr',
          label: '老师状态',
        },
        {
          prop: 'reason',
          label: '异常原因',
        },
      ],

      notCompleteCount: 0,
      unBindCount: 0,
      date: '',
      params: {
        startTime: this.$DateTool.format(start, 'yyyy-MM-dd') + ' 00:00:00',
        endTime: this.$DateTool.format(end, 'yyyy-MM-dd') + ' 23:59:59',
        pageNo: 1,
        pageSize: 10,
      },
      // url: '/api/dataView/commissioner/getImproveInfo',
      total: 0,
      activeTab: null,
      tools: ['search', 'date'],
    };
  },
  computed: {
    tabs() {
      if (
        !this.checkPermission('tea:workbench:infoFitStatus') &&
        this.checkPermission('tea:workbench:exceptionData')
      ) {
        this.activeTab = '2';
        return [
          {
            label: '异常数据',
            value: '2',
          },
        ];
      } else if (
        !this.checkPermission('tea:workbench:exceptionData') &&
        this.checkPermission('tea:workbench:infoFitStatus')
      ) {
        this.activeTab = '1';
        return [
          {
            label: '信息完善情况',
            value: '1',
          },
        ];
      } else if (
        this.checkPermission('tea:workbench:exceptionData') &&
        this.checkPermission('tea:workbench:infoFitStatus')
      ) {
        this.activeTab = '1';
        return [
          {
            label: '信息完善情况',
            value: '1',
          },
          {
            label: '异常数据',
            value: '2',
          },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {
    activeTab() {
      this.tableData = [];
    },
  },
  filters: {
    bindStatusFilter(value) {
      const isnull = value === null || value === '' || value === undefined;
      return isnull ? '-' : value === 0 ? '否' : '是';
    },
  },
  methods: {
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    handleDateChange(val) {
      let times = typeof val === 'string' ? val.split('-') : [];
      if (times.length > 5) {
        this.params.startTime = `${times[0]}-${times[1]}-${times[2]} 00:00:00`;
        this.params.endTime = `${times[3]}-${times[4]}-${times[5]} 23:59:59`;
      }
    },
    // 获取手机号信息
    getReferMobile(row) {
      /**
       * 因 SEM-1635 改成getMobileInfo接口.
       */
      try {
        console.log('row222:', row);
        row.mobile = '正在查询...';

        getTeacherSecretInfo({ teaId: row.teaId, infoType: 'mobile' })
          .then(mobile => {
            row.mobile = mobile;
            console.log('---333------->', mobile);
            // row.currentRow = true;
          })
          .catch(err => {
            row.mobile = '';
            err && this.$Message.error(err);
          });
      } catch (err) {
        row.mobile = '';
        this.$Message.error(err);
        console.log('---------->', err);
      }
    },
    getMobileFromReportPhone(row) {
      const { queryPhoneKey } = row;
      if (!queryPhoneKey) {
        return;
      }
      row.mobile = '正在查询...';
      getImproveInfoFromReportPhone(queryPhoneKey).then(({ code, data }) => {
        if (code === '0') {
          row.mobile = data;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.params.pageNo = 1;
      this.handleSearch();
    },
    handleCurrentChange(currentPage) {
      this.params.pageNo = currentPage;
      this.handleSearch();
    },
    handleClick(item) {
      let url = '';
      if (item.value === this.activeTab) {
        return;
      } else {
        this.activeTab = item.value;
        this.params.pageNo = 1;
        this.handleSearch();
      }
    },
    handleSearch() {
      if (this.activeTab === '2') {
        this.searchTeaRegExceptionInfo();
      } else {
        this.searchImproveInfo();
      }
    },
    searchTeaRegExceptionInfo() {
      this.$Fetch({
        url: '/api/dataView/commissioner/getTeaRegExceptionInfo',
        method: 'post',
        data: this.params,
      })
        .then(result => {
          let { data, code, message } = result;

          if (code === '0') {
            this.hasData = data;
            this.tableData = data.list;
            this.tableData.forEach(item => {
              this.$set(item, 'mobile', '');
            });
            this.total = data.total;
          } else {
            this.$Message.error(message);
          }
        })
        .catch(err => {
          this.$Message.error(err);
        });
    },
    searchImproveInfo(type) {
      const data = {...this.params};

      type && (this.params.pageNo = 1);

      if (type === 'clear') {
        delete data.bindStatus;
        delete data.completionRatioFlag;
      } else if (type === 'unbind') {
        data.bindStatus = 0;
      } else if (type === 'unfinish') {
        data.completionRatioFlag = '1';
      }

      this.$Fetch({
        url: '/api/dataView/commissioner/getImproveInfoFromReport',
        method: 'post',
        data,
      })
        .then(result => {
          const { code, data, message } = result;
          if (code === '0') {
            const { list, total } = data.teaImproveInfoFromReportItemPageInfo;
            this.hasData = data;
            this.tableData = list.map(item => {
              this.$set(item, 'mobile', '');
              return item;
            });
            this.total = total;
            this.notCompleteCount = data.notCompleteCount;
            this.unBindCount = data.unBindCount;
          } else {
            this.$Message.error(message);
          }
        })
        .catch(err => {
          this.$Message.error(err);
        });
    },
  },
  mounted() {
    this.handleSearch();
  },
};
</script>
<style lang="less">
.await-matter {
  height: 100%;
  .search {
    position: absolute;
    top: -60px;
    right: 0;
    display: flex;
    align-items: center;
    .search-btn {
      margin-right: 10px;
      height: 32px;
      padding: 8px 15px;
      border-radius: 4px;
    }
  }
  .content {
    height: 83%;
  }

  .todo-tip {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px 15px 0;
    font-size: 14px;
    margin-right: 10px;
    .all-report {
      font-size: 14px;
      color: #1d91fc;
      cursor: pointer;
      margin-right: 10px;
    }
    span {
      font-weight: 500;
      color: #1d91fc;
      margin-left: 5px;
      font-size: 15px;
      cursor: pointer;
    }
  }

  .todo-container {
    padding: 10px 20px 20px;
  }
  .tab {
    padding: 10px 20px 20px;
    display: flex;
    margin-bottom: 20px;
    &.first-tab {
      padding: 10px 20px 0;
    }
    .tab-item {
      cursor: pointer;
      position: relative;
      margin-right: 33px;
      font-size: 14px;
      color: #4a4a4a;
      &.active {
        color: #1d91fc;
        &::after {
          position: absolute;
          content: '';
          height: 2px;
          width: 80%;
          background: #1d91fc;
          bottom: -8px;
          left: 10%;
        }
      }
    }
  }
}
</style>
