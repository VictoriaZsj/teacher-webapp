<template>
  <div class="workbench-funnel">
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="报名时间">
          <div class="noneIcon">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="~"
              clearable
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="专员名称">
          <el-input
            clearable
            v-model="searchData.key"
            placeholder="请输入专员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属BU">
          <el-select v-model="searchData.interviewerBu" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in buList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作性质">
          <el-select
            v-model="searchData.interviewerTimeType"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in timeTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            class="search-btn"
            size="small"
            type="primary"
            @click="handleSearch"
            >搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tip-warpper">
      <div>
        报表信息<el-popover
          placement="right"
          width="390"
          content=""
          popper-class="table-head-popper"
        >
          <div>
            <p>
              统计维度：以时间+招师专员为维度统计既定时间内专员处理过的老师的数据
            </p>
            <p>记录的是快照信息，当日有触发条件即+1</p>
          </div>
          <i slot="reference" class="iconfont icon-wen"></i>
        </el-popover>
      </div>
      <div>更新时间：{{ updateTime }}</div>
      <!--<div>
				频率：天
			</div> -->
    </div>

    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :row-style="rowStyle"
        :data="tableData"
        border
        style="width: 100%"
        class="data-table"
      >
        <el-table-column
          prop="commissionerName"
          label="专员名称"
          fixed
          align="center"
        ></el-table-column>
        <el-table-column
          label="分配名单数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.assignCount | thousandthPlace }}
          </template>
        </el-table-column>

        <el-table-column
          prop="appointInterviewCount"
          label="约面人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.appointInterviewCount | thousandthPlace }}
          </template>
        </el-table-column>
        <el-table-column
          prop="appointRate"
          label="约面率"
          width="100"
          align="center"
          :render-header="renderHeaderFun"
          >、
          <template scope="scope">
            {{ scope.row.appointRate | transRate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="interviewCount"
          label="到面人数"
          align="center"
          :render-header="renderHeaderFun"
        >
        </el-table-column>
        <el-table-column
          prop="interviewRate"
          label="到面率"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.interviewRate | transRate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="passInterviewCount"
          label="面试通过人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.passInterviewCount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="passRate"
          label="面试通过率"
          align="center"
          width="100"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.passRate | transRate }}
          </template>
        </el-table-column>

        <el-table-column
          prop="appointTrainCount"
          label="约培人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.appointTrainCount | thousandthPlace }}
          </template>
        </el-table-column>
        <el-table-column
          prop="appointTrainRate"
          label="约培率"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.appointTrainRate | transRate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trainPassCount"
          label="培训通过人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.trainPassCount | thousandthPlace }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trainPassRate"
          label="培训通过率"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.trainPassRate | transRate }}
          </template>
        </el-table-column>

        <el-table-column
          prop="entryCount"
          label="入职人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.entryCount }}
          </template>
        </el-table-column>
        <el-table-column
          prop="entryRate"
          label="入职率"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.entryRate | transRate }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.pageNum"
          :page-sizes="[10, 20, 30, 40, 100]"
          :page-size="searchData.pageSize"
          layout="sizes, prev, pager, next"
          v-bind:total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from '../../../src/components/date-picker/util.js';
import { buList } from '@/enum';
import fetch from '../../../src/utils/fetch';
import Big from 'big.js';

const end = new Date();
const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7);
let headTip = {
  分配名单数: '报名时间范围内，分配给专员的数量',

  约面人数: '分配名单数中，被预约面试的人数',

  约面率: '约面人数/名单分配人数*100%',
  到面人数: '约面人数中，面试结果不等于面试缺席的人数',
  到面率: '到面人数/约面人数*100%',
  面试通过人数: '到面人数中，面试结果等于通过',

  面试通过率: '面试通过人数/到面人数*100%',
  约培人数: '到面人数中，有被预约培训时间的人数',
  约培率: '约培人数/面试通过数*100%',
  培训通过人数: '约培人数中，培训结果=通过的人数',
  培训通过率: '培训通过人数/约培人数*100%',
  参培人数: '待培训人数中，有参培的人数',
  参培率: '参培人数/待培训人数*100%',
  入职人数: '参培人数中，有入职的人数',
  入职率: '签约人数/分配名单人数*100%',
};

export default {
  data() {
    return {
      total: 0,
      searchTime: [start, end],
      searchData: {
        curUserId: window.localStorage.getItem('ZM_USERID'),
        endTime: '',
        interviewerBu: '',
        interviewerTimeType: '',
        key: '',
        orgCode: '',
        pageNo: 1,
        pageSize: 10,
        positionFlag: 0,
        startTime: '',
      },
      tableData: [],
      buList,
      orgList: [],
      timeTypeList: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '全职',
          value: '1',
        },
        {
          label: '校招全职',
          value: '2',
        },
      ],
      tableLoading: true,
      updateTime: this.$DateTool.format(new Date(), 'yyyy/MM/dd hh:mm:ss'),
    };
  },
  filters: {
    transRate(val) {
      //   if (val === '--') {
      //     return val;
      //   }
      //   let bigV = Big(val);
      //   let per = bigV.times(100);
      //   if (('' + per).includes('.')) {
      //     per = per.toFixed(2);
      //   }
      return val + '%';
    },
    thousandthPlace(num) {
      let fnum = parseFloat(num);
      if (Number.isNaN(fnum)) {
        return fnum;
      } else {
        if (('' + fnum).includes('.')) {
          fnum = fnum.toFixed(2);
        }
        let floatArr = ('' + fnum).split('.');
        let reverseNum = floatArr[0].split('').reverse();
        let returnNum = '';
        reverseNum.forEach((n, i) => {
          if (i % 3 == 0) {
            returnNum += ',';
          }
          returnNum += n;
        });

        floatArr[0] = returnNum
          .replace(/(^,|,$)/, '')
          .split('')
          .reverse()
          .join('');

        return floatArr.join('.');
      }
    },
  },
  created() {
    let authInfo = this.$store.state.workbench.authInfo;
    if (authInfo.roleCode === undefined) {
      let fn = this.$store.watch(
        state => {
          return state.workbench.authInfo;
        },
        authInfo => {
          if (authInfo.roleCode !== undefined) {
            this.disposeAuthInfo(authInfo);
            this.handleSearch();
            fn();
          }
        }
      );
    } else {
      this.disposeAuthInfo(authInfo);
      this.handleSearch();
    }
  },
  methods: {
    rowStyle(row) {
      if (['总数', '平均值', '最高值'].includes(row.commissionerName)) {
        return {
          background: '#F8F8F8',
          fontWeight: 'bold',
        };
      }
    },
    disposeAuthInfo(info) {
      let { roleCode, orgDtoList } = info;
      let orgList = orgDtoList || [];
      if (roleCode === 2) {
        this.searchData.orgCode = orgList[0].orgCode;
      } else if (roleCode === 1) {
        orgList = [{ orgName: '全部', orgCode: '' }, ...orgList];
      }
      this.orgList = orgList;
      this.searchData.positionFlag = roleCode;
    },
    renderHeaderFun(h, { column, $index }) {
      const { label } = column;
      return h('span', {}, [
        h('span', {}, label),
        h(
          'el-popover',
          {
            props: {
              placement: 'right',
              width: '200',
              trigger: 'click',
              'popper-class': 'table-head-popper',
            },
          },
          [
            h(
              'div',
              {},
              headTip[label]
              //   headTip[label].map(item => {
              //     return h('p', {}, item);
              //   })
            ),
            h('i', { slot: 'reference', class: 'iconfont icon-wen' }, ''),
          ]
        ),
      ]);
    },
    // 搜索
    handleSearch($event, isExport = false) {
      this.tableLoading = true;
      let params = {
        ...this.searchData,
        startTime: new Date(this.searchTime[0]).format('yyyy-MM-dd 00:00:00'),
        endTime: new Date(this.searchTime[1]).format('yyyy-MM-dd 23:59:59'),
      };
      fetch({
        url: '/api/report/funnelDetailReport',
        method: 'post',
        data: params,
      })
        .then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list;
            this.total = res.data.total;
            this.tableLoading = false;
          }
        })
        .catch(err => {
          this.tableLoading = false;
          if (err) {
            this.$Message.error(err);
          }
        });
    },
    addApend(list) {
      if (list && list.length) {
        let totleCol = {
          commissionerName: '总数',
        };
        let averageCol = {
          commissionerName: '平均值',
        };
        let maxCol = {
          commissionerName: '最高值',
        };
        let cols = [
          'personChannelCount',
          'otherChannelCount',
          'appointInterviewCount',
          'interviewCount',
          'interviewRate',
          'curAppointInterviewCount',
          'passInterviewCount',
          'unPassInterviewCount',
          'secondInterviewCount',
          'absenceCount',
          'passRate',
          'awaitTrainCount',
          'trainCount',
          'trainRate',
          'signCount',
          'entryRate',
          'scount',
          'acount',
          'bcount',
          'ccount',
        ];
        let rateCols = ['interviewRate', 'passRate', 'trainRate', 'entryRate'];
        let len = list.length;
        cols.forEach(key => {
          let total = 0,
            max = 0;
          total = list.reduce((a, b) => {
            if (max < b[key]) {
              max = b[key];
            }
            let bigA = Big(a);
            return bigA.plus(b[key]);
          }, 0);
          if (rateCols.includes(key)) {
            totleCol[key] = '--';
          } else {
            totleCol[key] = total;
          }

          let bigT = Big(total);
          maxCol[key] = max;
          averageCol[key] = bigT.div(len);
        });

        return [...list, totleCol, averageCol, maxCol];
      } else {
        return [];
      }
    },
    // 查询权限
    checkPermission(PermissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(PermissionName) > -1
      );
    },
    handleCurrentChange(val) {
      this.searchData.pageNo = val;
      this.handleSearch();
    },
    handleSizeChange(val) {
      this.searchData.pageNo = 1;
      this.searchData.pageSize = val;
      this.handleSearch();
    },
  },
};
</script>

<style lang="less">
.workbench-funnel {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  .search-warpper {
    border-bottom: 1px solid #f0f0f0;
    margin: 15px 0 0 0px;
    padding: 0 20px 5px 15px;
    .search-btn {
      border-radius: 4px;
      width: 64px;
      background: #1d91fc;
    }
  }
  .table-warpper {
    width: 100%;
    min-height: 500px;
    padding: 0 20px;
    .data-table {
      border: 1px solid #d9d9d9;
      th {
        background: #f8f8f8;
      }
    }
  }
  .tip-warpper {
    display: flex;
    height: 44px;
    padding: 0 20px;
    align-content: center;
    color: #999999;
    font-size: 14px;
    & > div {
      line-height: 44px;
      margin-right: 30px;
    }
    .iconfont {
      font-size: 14px;
    }
  }
  .el-table .cell {
    word-break: break-all !important;
  }
  .icon-wen {
    font-size: 12px;
    color: #999;
    font-weight: normal;
    &:hover {
      color: #1d91fc;
    }
  }
  .el-table__header {
    .cell {
      color: #333;
      font-weight: bold;
      font-size: 12px;
    }
  }
  .el-table__body-wrapper {
    overflow-y: hidden;
  }
  .el-pagination {
    text-align: right;
  }
  .table-head-popper {
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    text-align: justify;
    &.el-popover .popper__arrow::after {
      border-right-color: rgba(0, 0, 0, 0.8);
      border-left-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
