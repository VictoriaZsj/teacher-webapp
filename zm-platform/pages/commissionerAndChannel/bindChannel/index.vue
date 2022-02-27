<template>
  <div class="bindChannel">
    <el-form
      :inline="true"
      :model="search_data"
      class="search-form"
      label-width="90px"
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
      <el-form-item label="渠道信息">
        <el-input
          v-model="search_data.channelKeyword"
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
      <el-form-item label="渠道创建时间">
        <el-date-picker
          v-model="channelCreatedTimes"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择日期范围"
          @change="handleTimesChange(1)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="最新绑定时间">
        <el-date-picker
          v-model="lastBindTimes"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择日期范围"
          @change="handleTimesChange(2)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          class="search-btn"
          type="normal"
          size="small"
          @click="openBindChannelDialog"
          v-if="permissionList.indexOf('tea:commissionerChannel:addbindChannel') !== -1"
          >新增绑定</el-button
        >
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
          <template scope="prop">
            <el-button
              v-if="
                prop.row.channelMobile && prop.row.channelMobile.indexOf('***') !== -1
              "
              type="text"
              size="small"
              @click="queryMobile(prop.row)"
              >点击查看手机号</el-button
            >
            <span v-else>{{ prop.row.channelMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channelCreatedTime"
          sortable
          align="center"
          label="渠道创建时间"
        ></el-table-column>
        <el-table-column prop="lastBindTime" sortable align="center" label="最新绑定时间">
        </el-table-column>
        <el-table-column
          prop="bindTeaCount"
          sortable
          align="center"
          label="绑定期间累计获得新讲师"
        >
          <template scope="prop">
            <el-button
              type="text"
              size="small"
              @click="openBindingTeacherDialog(prop.row)"
              >{{prop.row.bindTeaCount}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="80" v-if="permissionList.indexOf('tea:commissionerChannel:removeBind') !== -1">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleResetRelationship(scope.row)"
              type="text"
              >解绑</el-button
            >
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
    <!-- 新增绑定弹窗 -->
    <addBindChannelDialog @upPageList="getTableData" ref="addBindChannelDialog"></addBindChannelDialog>
    <!-- 查看绑定期间累计获得新讲师 -->
    <bindingTea ref="bindingTea"></bindingTea>
  </div>
</template>
<script>
import { listCommissionerChannelRelation, unbindCommissionerChannel } from 'api/commissionerAndChannel';
import getChannelType from 'api/action/getChannelType';
import { getMobileInfo } from 'api/select/getTeacherNum'; // 获取手机号
import addBindChannelDialog from './dialog/addBind'; // 新增绑定弹窗组件
import bindingTea from './dialog/bindingTea'; // 查看绑定期间累计获得新讲师

export default {
  components: {addBindChannelDialog, bindingTea},
  data() {
    return {
      channelCreatedTimes: [],
      lastBindTimes: [],
      channelType: [],
      search_data: {
        commissionerName: '',
        channelId: '',
        channelKeyword: '',
        channelType: '',
        channelCreatedStartTime: '',
        channelCreatedEndTime: '',
        lastBindStartTime: '',
        lastBindEndTime: '',
        pageNo: 1,
        pageSize: 10
      },
      table_data: [],
      table_data_total: 0,
      tableLoading: false,
    };
  },
  methods: {
    // 打开绑定期间累计获得新讲师
    openBindingTeacherDialog(row) {
      this.$refs.bindingTea.init(row.id);
    },
    // 打开新增绑定弹窗
    openBindChannelDialog() {
      this.$refs.addBindChannelDialog.init();
    },
    // 查询手机号
    queryMobile(row) {
      getMobileInfo(row.channelId).then(res => {
        row.channelMobile = `${res}`;
      }).catch(err => {
        err.message && this.$Message.error(err.message)
      })
    },
    // 解除绑定关系
    handleResetRelationship(row) {
      this.$confirm(`确定解绑专员："${ row.commissionerName }/${row.commissionerMobile || ''}" 与渠道："${row.channelName}/${row.channelMobile || ''}"？`, '解除绑定').then(() => {
        unbindCommissionerChannel({bindId: row.id}).then(({data: {code, msgContent, msgCode}}) => {
          if (code === 200 && msgCode === '200') {
            this.$Message.warning('解绑成功');
            this.getTableData();
          } else {
            this.$Message.warning(msgContent || '解绑失败');
          }
        })
      }).catch(() => {

      });
    },
    // 列表查询
    getTableData() {
      this.tableLoading = true;
      listCommissionerChannelRelation(this.search_data)
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
    handleTimesChange(type) {
      //type： 1 渠道创建时间 2 最新绑定时间
      let times = [];
      if (type === 1) times = this.channelCreatedTimes;
      if (type === 2) times = this.lastBindTimes;

      if (times[0] == null) {
        if (type === 1) {
          this.search_data.channelCreatedStartTime = '';
          this.search_data.channelCreatedEndTime = '';
        }

        if (type === 2) {
          this.search_data.lastBindStartTime = '';
          this.search_data.lastBindEndTime = '';
        }

      } else {
        let sDate = this.$DateTool.format(new Date(times[0]).getTime(), 'yyyy-MM-dd') + ' 00:00:00';
        let eDate = this.$DateTool.format(new Date(times[1]).getTime(), 'yyyy-MM-dd') + ' 23:59:59';
        if (type === 1) {
          this.search_data.channelCreatedStartTime = sDate;
          this.search_data.channelCreatedEndTime = eDate;
        }
        if (type === 2) {
          this.search_data.lastBindStartTime = sDate;
          this.search_data.lastBindEndTime = eDate;
        }
      }
    },
    handleReset(){
      this.search_data = {
        commissionerName: '',
        channelId: '',
        channelKeyword: '',
        channelType: '',
        channelCreatedStartTime: '',
        channelCreatedEndTime: '',
        lastBindStartTime: '',
        lastBindEndTime: '',
        pageNo: 1,
        pageSize: 10
      };
      this.channelCreatedTimes = [];
      this.lastBindTimes = [];
      this.getTableData();
    },
  },
  computed: {
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
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
