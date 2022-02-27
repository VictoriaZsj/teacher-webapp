<template>
  <div class="workbench-report">
    <!--搜索区-->
    <div class="search-warpper">
      <el-form :inline="true" :model="searchData" label-width="100px">
				<el-form-item label="日期">
					<div class="noneIcon">
						<el-date-picker v-model="searchData.searchTime" type="daterange" range-separator="~" clearable format="yyyy-MM-dd" style="width: 200px;">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label="专员（企微）">
					<el-input clearable v-model="searchData.key" placeholder="专员姓名/工号/手机" style="width: 200px;"></el-input>
				</el-form-item>
        <!-- <el-form-item label="专员（跟进人）">
					<el-input clearable v-model="searchData.followerKey" placeholder="专员姓名/手机" style="width: 200px;"></el-input>
				</el-form-item> -->
        <el-form-item label="好友信息">
					<el-input clearable v-model="searchData.friendKey"  placeholder="昵称/外部联系人ID" style="width: 200px;"></el-input>
				</el-form-item>
        <el-form-item label="老师ID/手机号">
					<el-input clearable v-model="searchData.teaKey" placeholder="老师ID/手机号" style="width: 200px;"></el-input>
				</el-form-item>
				<el-form-item label="是否绑定tea_id">
					<el-select v-model="searchData.bindStatus" placeholder="请选择" style="width: 200px;">
						<el-option label="全部" value=""></el-option>
						<el-option label="已绑定" value="1"></el-option>
            <el-option label="未绑定" value="0"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="老师状态">
          <el-select collapse-tags v-model="searchData.teaStates" multiple placeholder="请选择老师状态" class='selectHeight' style="width: 200px;height:30px">
            <el-option label="待预约" value="0"></el-option>
            <el-option label="待面试" value="1"></el-option>
            <el-option label="待二面" value="10"></el-option>
            <el-option label="面试缺席" value="11"></el-option>
            <el-option label="待培训预约" value="2"></el-option>
            <el-option label="待培训通知" value="20"></el-option>
            <el-option label="培训延期" value="21"></el-option>
            <el-option label="培训缺席" value="22"></el-option>
            <el-option label="待入库" value="3"></el-option>
            <el-option label="待offer" value="30"></el-option>
            <el-option label="待入职" value="4"></el-option>
            <el-option label="待签合约" value="35"></el-option>
            <el-option label="试用期" value="5"></el-option>
            <el-option label="转正" value="40"></el-option>
            <el-option label="离职待交接" value="45"></el-option>
            <el-option label="离职已交接" value="46"></el-option>
            <el-option label="离职完成" value="6"></el-option>
            <el-option label="回收站" value="7"></el-option>
            <el-option label="已淘汰" value="50"></el-option>
					</el-select>
        </el-form-item>
				<el-form-item>
					<el-button class="search-btn" size="small" type="primary" @click="handleSearch">搜 索
					</el-button>
				</el-form-item>
			</el-form>
    </div>

    <!--报表信息-->
    <div class="tip-warpper">
			<div>
        报表信息
        <el-popover placement="right" width="390" content="" popper-class="table-head-popper">
					<div>
						<p>统计维度：加好友日期+外部联系人id（外部联系人去重，取最新的一条记录）</p>
					</div>
					<i slot="reference" class="iconfont icon-wen"></i>
				</el-popover>
			</div>
      <div class='export-btn'>
        <el-button type="primary" @click="doExport" :loading="exporting" size="small" >导出</el-button>
      </div>
		</div>

    <!--数据区-->
    <div class="table-warpper">
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" class="data-table" height="460">
        <el-table-column prop="jobNumber" label="专员工号" fixed align="center"></el-table-column>
        <el-table-column prop="commissionerName" label="专员（企微）" width="150" align="center"></el-table-column>
        <el-table-column prop="followerCommissionerName" label="专员（跟进人）" width="150" align="center"></el-table-column>
        <el-table-column prop="friendAddTime" label="加好友时间" align="center" width="160"></el-table-column>
        <el-table-column prop="friendNickname" label="好友昵称" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="friendExternalUserId" label="外部联系人ID" align="center" width='260'></el-table-column>
        <el-table-column prop="friendRemark" label="好友备注" align="center" width="200" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="friendRemarkMobiles" label="备注手机号" align="center"></el-table-column> -->
        <el-table-column prop="bindStatus" label="好友状态" align="center">
          <template slot-scope="{row}">
            {{ row.friendDeleteStatus === 1 ? '已删除' : '未删除' }}
          </template>
        </el-table-column>
        <el-table-column prop="friendDeleteTime" label="删除时间" width="160" align="center"></el-table-column>
        <el-table-column prop="" label="是否绑定tea_id" width="120" align="center">
          <template slot-scope="{row}">
            {{ row.bindStatus | bindStatusFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="bindTime" label="绑定时间" width="160" align="center"></el-table-column>
        <el-table-column prop="" label="绑定类型" align="center">
          <template slot-scope="{row}">
            {{ row.bindType | bindTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="teaId" label="tea_id" align="center" width="100px"></el-table-column>
        <el-table-column prop="byPhone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="completionRatio" label="信息完善度" align="center">
          <template slot-scope="{row}">
            {{row.completionRatio ? `${row.completionRatio}%` : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="teaStateDesc" label="老师状态" align="center"></el-table-column>
        <el-table-column prop="appointInterviewTime" label="约面时间（动作）" width="160" align="center"></el-table-column>
        <el-table-column prop="followAppointInterviewTimePeriodStr" label="约面跟进时长（分钟）" width="160" align="center"></el-table-column>
        <el-table-column prop="interviewResult" label="面试结果" align="center"></el-table-column>
        <el-table-column prop="appointTrainTime" label="约培时间（动作）" width="160" align="center"></el-table-column>
        <el-table-column prop="followAppointTrainTimePeriodStr" label="约培跟进时长（分钟）" width="160" align="center"></el-table-column>
        
       <el-table-column prop="trainTime"  width="160"  label="参培时间" align="center"> </el-table-column>
<el-table-column prop="followSignTime" label="合同签署成功时间" width="160" align="center"></el-table-column>
        <el-table-column prop="followSignTimePeriodStr" label="入职跟进时长（分钟）" width="160" align="center"></el-table-column>
        <el-table-column prop="channelName" label="当前推荐人" width="150" align="center"></el-table-column>
        <el-table-column prop="channelId" label="推荐人ID" align="center"></el-table-column>
      </el-table>
    </div>
    <div class='pagination-wrapper'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNo"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import fetchList from '../../api/select/commissionerFriendBindReport';
import exportReport from '../../api/select/commissionerFriendBindStatisticReportExport';

const startTime = dayjs().set('date', 1).format('YYYY-MM-DD')
const endTime = dayjs().set('date', dayjs().daysInMonth()).format('YYYY-MM-DD')
export default {
  data() {
    return {
      searchData: {
        searchTime: [
          startTime,
          endTime
        ],
        key: '',
        bindStatus: "",
        teaKey: '',
        friendKey: '',
        teaStates: [],
      },
      tableLoading: false,
      tableData: [],
      exporting: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  filters: {
    bindStatusFilter(value) {
      const invalid = value === undefined || value === null || value === ''
      return invalid ? '-' : value === 1 ? '是' : '否'
    },
    bindTypeFilter(value) {
      const invalid = value === undefined || value === null || value === ''
      return invalid ? '-' : value === 0 ? '系统绑定' : '人工绑定'
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSearch() {
      this.pagination.pageNo = 1;
      this.fetchData();
    },
    fetchData() {
      const { searchTime, key, bindStatus, teaKey, friendKey, teaStates } = this.searchData
      let sTime;
      let eTime;
      if (searchTime) {
        sTime = dayjs(searchTime[0]);
        eTime = dayjs(searchTime[1]);
        if (!sTime.isValid()) {
          sTime = dayjs(startTime);
        }
        if (!eTime.isValid()) {
          eTime = dayjs(endTime);
        }
      } else {
        sTime = dayjs(startTime)
        eTime = dayjs(endTime)
      }
      const params = {
        startTime: sTime.format('YYYY-MM-DD 00:00:00'),
        endTime: eTime.format('YYYY-MM-DD 23:59:59'),
        ...this.pagination,
        key,
        bindStatus,
        teaKey,
        friendKey,
        teaStates: teaStates.join(',')
      }
      // console.log(searchTime, params, 'sss');
      this.tableLoading = true;
      fetchList(params).then(result => {
        const { code, data, message } = result;
        if (code === '0') {
          this.tableData = data.list;
          this.pagination.total = data.total
          // this.pagination.total = 15
        } else {
          this.$Message.error(message);
        }
      }).catch(err => {
        this.$Message.error(err)
      }).finally(() => {
        this.tableLoading = false;
      })
    },
    doExport() {
      const { searchTime, key, bindStatus, teaKey } = this.searchData
      const params = {
        startTime: dayjs(searchTime ? searchTime[0] : startTime).format('YYYY-MM-DD 00:00:00'),
        endTime: dayjs(searchTime ? searchTime[1] : endTime).format('YYYY-MM-DD 23:59:59'),
        ...this.pagination,
        key,
        bindStatus,
        teaKey
      }
      this.exporting = true;
      exportReport(params).then(ret => {
        let blob = new Blob([ret], {type: 'application/vnd.ms-excel'});
        let objectUrl = URL.createObjectURL(blob);
        let fileName = `${dayjs().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`;

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
      }).finally(() => {
        this.exporting = false;
      })
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.handleSearch();
    },
    handleCurrentChange(page) {
      // console.log(page);
      this.pagination.pageNo = page;
      this.fetchData()
    }
  }
}
</script>

<style lang="less" scoped>
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
    .selectHeight{
      height:30px;
      .el-input{
      input{
        height:30px
      }
      }
     
    }
  }
  .table-warpper {
    width: 100%;
    min-height: 500px;
    padding: 0 20px;
  }
  .data-table {
    border: 1px solid #d9d9d9;
    th {
      background: #f8f8f8;
    }
  }
  .tip-warpper {
    display: flex;
    height: 44px;
    padding: 0 20px;
    align-content: center;
    color: #999999;
    font-size: 14px;
    justify-content: space-between;
    & > div {
      line-height: 44px;
      margin-right: 30px;
    }
    .iconfont {
      font-size: 14px;
    }
  }
  .pagination-wrapper {
    padding: 0 20px 0 0;
  }
}
</style>
