<template>
  <div class="workbench-report">
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="统计时间">
          <div class="noneIcon">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="~"
              :clearable="false"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="专员名称">
          <el-select
            v-model="searchData.userIdList"
            multiple
            collapse-tags
            clearable
            placeholder="请输入专员姓名(不选则查全部)"
          >
            <el-option
              v-for="(item, index) in OaPersonOption"
              :key="index"
              :label="item.personName"
              :value="item.userId"
            ></el-option>
          </el-select>
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
        <el-form-item
          label="OA所在部门"
          v-if="this.searchData.positionFlag !== 0"
        >
          <el-select v-model="searchData.orgCode" placeholder="请选择">
            <el-option
              v-for="(item, index) in orgList"
              :key="index"
              :label="item.orgName"
              :value="item.orgCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="search-btn"
            size="small"
            type="primary"
            @click="handleExport"
            >导 出
          </el-button>
          <el-button
            class="search-btn"
            size="small"
            type="primary"
            @click="handleSearch"
            >搜 索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tip-warpper">
      <div>
        报表信息
        <el-popover
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
      <!-- <div>
				更新时间：2020/04/12 12:00:00
			</div>
			<div>
				频率：天
			</div> -->
    </div>
    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        max-height="600"
        :row-style="rowStyle"
        :data="tableData"
        border
        style="width: 100%"
        class="data-table"
      >
        <!-- fixed='left' -->
        <el-table-column
          prop="commissionerName"
          label="专员姓名"
          fixed
          align="center"
          :render-header="renderHeaderFun"
        >
        </el-table-column>
        <el-table-column label="名单分配人数(总数）" align="center">
          <el-table-column
            prop="personChannelCount"
            label="个人渠道"
            align="center"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.personChannelCount | thousandthPlace }}
            </template>
          </el-table-column>
          <el-table-column
            prop="otherChannelCount"
            label="非个人渠道"
            width="100"
            align="center"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.otherChannelCount | thousandthPlace }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="S/A/B/C"
          width="150"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.scount | thousandthPlace }}/{{
              scope.row.acount | thousandthPlace
            }}/{{ scope.row.bcount | thousandthPlace }}/{{
              scope.row.ccount | thousandthPlace
            }}
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
          prop="interviewCount"
          label="到面人数/当天应面试人数"
          width="100"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.interviewCount | thousandthPlace }}/{{
              scope.row.curAppointInterviewCount | thousandthPlace
            }}
          </template>
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
        <el-table-column label="面试结果" align="center">
          <el-table-column
            prop="passInterviewCount"
            label="通过人数"
            align="center"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.passInterviewCount | thousandthPlace }}
            </template>
          </el-table-column>
          <el-table-column
            prop="unPassInterviewCount"
            label="不通过人数"
            align="center"
            width="100"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.unPassInterviewCount | thousandthPlace }}
            </template>
          </el-table-column>
          <el-table-column
            prop="secondInterviewCount"
            label="待二面人数"
            align="center"
            width="100"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.secondInterviewCount | thousandthPlace }}
            </template>
          </el-table-column>
          <el-table-column
            prop="absenceCount"
            label="面试缺席人数"
            align="center"
            width="110"
            :render-header="renderHeaderFun"
          >
            <template scope="scope">
              {{ scope.row.absenceCount | thousandthPlace }}
            </template>
          </el-table-column>
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
          prop="awaitTrainCount"
          label="待培训人数"
          align="center"
          width="100"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.awaitTrainCount | thousandthPlace }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trainCount"
          label="参培人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.trainCount | thousandthPlace }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trainRate"
          label="参培率"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.trainRate | transRate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="signCount"
          label="签约人数"
          align="center"
          :render-header="renderHeaderFun"
        >
          <template scope="scope">
            {{ scope.row.signCount | thousandthPlace }}
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
import dayjs from 'dayjs';
import Big from 'big.js';
import { buList } from '@/enum';
import axios from 'axios';
import {
  getEngageEfficiencyReport,
  getEngageEfficiencySumReport,
  exportEngageEfficiencyReport,
  queryOaPersono,
} from '../../api/statements';

const end = new Date();
const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7);

export default {
  data() {
    return {
      total: 0,
      searchTime: [start, end],
      searchData: {
        userIdList: [],
        pageNo: 1,
        pageSize: 10,
        interviewerTimeType: '',
        interviewerBu: '',
        orgCode: '',
        positionFlag: '',
      },
      tableData: [],
      buList,
      orgList: [],
      OaPersonOption: [],
      timeTypeList: [
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
    };
  },
  filters: {
    transRate(val) {
      if (val === '--') {
        return val;
      }
      let bigV = Big(val);
      let per = bigV.times(100);
      if (('' + per).includes('.')) {
        per = per.toFixed(2);
      }
      return per + '%';
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
  async created() {
    let authInfo = this.$store.state.workbench.authInfo;
    // 获取专员
    await queryOaPersono().then(res => {
      if (res.data.code === '0') {
        this.OaPersonOption = res.data.data || [];
      } else {
        this.$message.warning(res.data.message);
      }
    });

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
              headTip[label].map(item => {
                return h('p', {}, item);
              })
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

      if (!params.userIdList.length) {
        params.userIdList = this.OaPersonOption.map(item => item.userId);
      }

      axios
        .all([
          getEngageEfficiencyReport(params),
          getEngageEfficiencySumReport(params),
        ])
        .then(res => {
          this.tableLoading = false;
          if (res[0].data.code !== '0') {
            this.$Message.error(res[0].data.message);
            return
          }
          if (res[1].data.code !== '0') {
            this.$Message.error(res[1].data.message);
            return
          }

          this.tableData = this.transformCols(res[0].data.data.list, res[1].data.data);
          this.total = res[0].data.data.total;

        })
        .catch(err => {
          this.tableLoading = false;
          if (err) {
            this.$Message.error(err);
          }
        });
    },
    // 导出表格
    handleExport() {
      let params = {
        ...this.searchData,
        startTime: new Date(this.searchTime[0]).format('yyyy-MM-dd 00:00:00'),
        endTime: new Date(this.searchTime[1]).format('yyyy-MM-dd 23:59:59'),
      };

      if (!params.userIdList.length) {
        params.userIdList = this.OaPersonOption.map(item => item.userId);
      }
      exportEngageEfficiencyReport(params).then(ret => {
        let blob = new Blob([ret.data], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let fileName = `工作台数据报表_${dayjs().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`;

        if('msSaveOrOpenBlob' in navigator){
          // Microsoft Edge and Microsoft Internet Explorer 10-11
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          let body = document.body || document.getElementsByTagName('body')[0];
          let link = document.createElement('a');
          link.style.display = 'none';
          link.setAttribute('download', fileName);
          link.href = objectUrl;
          body.appendChild(link);
          link.click();
          body.removeChild(link);
        }

        URL.revokeObjectURL(objectUrl);
      }).catch(err => {
        this.$Message.error(err)
      });
    },
    transformCols(column, objSum) {
      if (column && column.length) {
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
        cols.forEach(key => {
          totleCol[key] = objSum[key].sumValue;
          maxCol[key] = objSum[key].maxValue;
          averageCol[key] = objSum[key].averageValue;
        });

        return [...column, totleCol, averageCol, maxCol];
      } else {
        return [];
      }
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

let headTip = {
  专员姓名: ['招师专员取值：招师专员角色=招师专员，招师主管的专员'],
  个人渠道: [
    '个人渠道字段值取值---当前专员名下的老师，且老师推荐人=当前招师专员自己的',
  ],
  非个人渠道: [
    '非个人渠道字段值取值---当前专员名下的老师，且老师推荐人≠当前招师专员自己的',
  ],
  'S/A/B/C': ['既定时间下，招师专员名下，名单等级=S/A/B/C的数量'],
  约面人数: [
    '既定时间内：同一专员名下，且老师状态=待预约/待二面/面试缺席时，且专员成功预约面试时间的老师数量（招师跟进--约面面试时间）',
  ],
  '到面人数/当天应面试人数': [
    `到面人数：面试时间在当天，且面试结果=通过/不通过/待二面`,
    `当天应面试人数：预约面试时间=当天`,
  ],
  到面率: [
    '既定时间内，招师专员名下，当前到面数/面试时间在当天的老师数量*100%',
  ],
  通过人数: [
    '既定时间内，招师专员名下，面试时间在选定时间的老师，且面试结果=面试通过',
  ],
  不通过人数: [
    '既定时间内，招师专员名下，面试时间在选定时间的老师，且面试结果=面试不通过',
  ],
  待二面人数: [
    '既定时间内，招师专员名下，面试时间在选定时间的老师，且面试结果=待二面',
  ],
  面试缺席人数: [
    '既定时间内，招师专员名下，面试时间在选定时间的老师，且面试结果=面试缺席',
  ],
  面试通过率: ['既定时间内，招师专员名下，面试通过人数/到面人数*100%'],
  待培训人数: ['从bi报表中取值'],
  参培人数: ['从bi报表中取值'],
  参培率: ['从bi报表中取值'],
  签约人数: ['既定时间内，招师专员名下，签署合同成功的老师数量'],
  入职率: ['签约人数/名单分配人数*100%'],
};
</script>

<style scoped lang="less">
.workbench-report {
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
.data-table {
  border: 1px solid #d9d9d9;
  th {
    background: #f8f8f8;
  }
}
</style>
<style lang="less">
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
.workbench-report {
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
  .el-pagination {
    text-align: right;
  }
}
</style>
