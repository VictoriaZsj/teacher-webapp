<style lang="less" scoped></style>

<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="所属BU">
        <el-select v-model="search_data.bu" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="1对1" value="1"></el-option>
          <el-option label="少儿" value="2"></el-option>
          <el-option label="陪练" value="3"></el-option>
          <el-option label="优课" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作性质">
        <el-select v-model="search_data.timetype" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="兼职" value="0"></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
          <el-option label="公校兼职" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称">
        <el-input
          v-model="search_data.agentName"
          placeholder="输入渠道名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道手机号">
        <el-input
          v-model="search_data.agentMobile"
          placeholder="输入渠道手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲师姓名">
        <el-input
          v-model="search_data.teaName"
          placeholder="输入讲师姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="讲师手机号">
        <el-input
          v-model="search_data.teaMobile"
          placeholder="输入讲师手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="报名时间">
        <el-date-picker
          :editable="false"
          v-model="signDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseSignDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          :editable="false"
          v-model="searchInworkDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseInworkDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          :editable="false"
          v-model="searchInstoreDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseInstoreDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="渠道类型">
        <el-select
          v-model="search_data.agentType"
          clearable
          placeholder="请选择"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="(item, index) in channelType"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道活动名称">
        <el-input
          v-model="search_data.activeTitle"
          placeholder="输入渠道活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="签合同时间">
        <el-date-picker
          :editable="false"
          v-model="signContractTimeStr"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseSignContractTimeStr"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-button
        id="preTrainingSearchBtn"
        class="search-btn"
        icon="search"
        type="normal"
        size="small"
        @click="search"
        >查询</el-button
      >
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div class="table-head">
        <span
          >共 {{ agentCount }} 名代理，推荐 {{ teaCount }} 人，入职/入库
          {{ entryCount }} 人</span
        >
        <el-button
          size="small"
          type="text"
          v-if="permissionList.indexOf('tea:config:teaData:downloadPage') !== -1"
          @click="handleExportDialog('showExportList')"
          >查看导出结果</el-button
        >
        <el-button
          size="small"
          type="text"
          v-if="permissionList.indexOf('tea:config:teaData:exprotbutton') !== -1"
          @click="handleExportDialog('startExport')"
          >导出</el-button
        >
      </div>
      <el-table :data="table_data" style="width:100%">
        <el-table-column
          prop="agentName"
          align="center"
          label="渠道名称"
        ></el-table-column>
        <el-table-column prop="agentType" align="center" label="渠道类型">
          <template scope="scope">{{
            channelType.length > 0
              ? channelType.find(item => item.value == scope.row.agentType)
                  .label
              : ''
          }}</template>
        </el-table-column>
        <el-table-column prop="agentMobile" align="center" label="渠道手机号">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click="
                getReferMobile(
                  $event,
                  scope.row.teaId,
                  'referMobile',
                  scope.row
                )
              "
              class="detailsBtn"
              v-if="scope.row.agentMobile && !scope.row.currentRow"
              >点击获取手机号</el-button
            >
            <span v-show="scope.row.currentRow">{{
              scope.row.agentMobile
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="teaName"
          align="center"
          label="讲师姓名"
        ></el-table-column>
        <el-table-column
          prop="teaMobile"
          align="center"
          label="讲师手机号"
        ></el-table-column>
        <el-table-column
          prop="teaState"
          align="center"
          label="讲师状态"
        ></el-table-column>
        <el-table-column
          prop="regTime"
          align="center"
          label="报名时间"
        ></el-table-column>
        <el-table-column
          prop="sendTrainEmailTime"
          align="center"
          label="入库/入职时间"
        ></el-table-column>
        <el-table-column
          prop="signContractTime"
          align="center"
          label="签合同时间"
        ></el-table-column>
        <el-table-column
          prop="activeTitle"
          align="center"
          label="渠道活动名称"
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
    <!--导出弹窗-->
    <el-dialog
      :title="`导出${isDownloadList ? '列表' : ''}`"
      v-model="exprotFile.visible"
      @close="exprotFile.visible = false"
      class="chanle-export-dialog"
      width="600"
    >
      <el-row v-if="!isDownloadList">
        <p class="mt10">
          注意：由于数据量较大，所以下载速度会比较慢，点击【导出】后，系统会自动下载，下载完成后，在列表页点击【查看导出结果】即可下载已导出的表格
        </p>
        <p class="mt10">导出上限：5W</p>
      </el-row>
      <el-row v-else>
        <el-table class="" :data="exprotFile.tableData">
          <el-table-column prop="updatedTime" label="导出时间" align="center">
          </el-table-column>
          <el-table-column
            prop="fileName"
            label="导出表格名称"
            align="left"
            width="200"
          >
          </el-table-column>
          <el-table-column prop="createdBy" label="下载状态" align="center">
            <template scope="scope">
              {{ scope.row.state == 1 ? '成功' : '下载中...' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template scope="scope">
              <span v-if="scope.row.state === 0">
                下载中...
              </span>
              <el-button
                style="font-size: 12px;"
                v-if="scope.row.state === 1"
                @click="disciplineDetail(scope.row)"
                type="text"
                >下载</el-button
              >
            </template>
          </el-table-column>
          <template slot="empty">
            <p class="t-l">当前无已导出表格，</p>
            <p class="t-l">
              请点击<span class="c-blue">【导出】</span>按钮，进行导出
            </p>
          </template>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="asyncHandleSizeChange"
            @current-change="asynchHandleCurrentChange"
            :current-page="exprotFile.pageNo"
            :page-size="exprotFile.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, prev, pager, next, sizes, jumper"
            v-bind:total="exprotFile.total"
          ></el-pagination>
        </div>
      </el-row>
      <div slot="footer" class="dialog-footer" v-if="!isDownloadList">
        <el-button @click="exprotFile.visible = false">关 闭</el-button>
        <el-button type="primary" @click="handleExportAsync"
          >后台下载</el-button
        >
      </div>
    </el-dialog>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import queryAgentData from '../../api/select/queryAgentData';
import { getVilidAttrWithEmpty } from '../../../src/utils/assist';
import getChannelType from './../../api/action/getChannelType';
import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo'; // 获取手机号

export default {
  data() {
    return {
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      currentID: '',
      tableLoading: false,
      table_data: [],
      table_data_total: 0,
      agentCount: 0,
      entryCount: 0,
      teaCount: 0,
      channelType: [],
      search_data: {
        bu: '',
        activeId: '',
        timetype: '',
        agentName: '', //代理姓名
        activeTitle: '', //活动标题
        agentMobile: '', //代理手机号
        teaName: '', //讲师姓名
        teaMobile: '', //讲师手机号
        applyTimeStart: '',
        applyTimeEnd: '',
        readAtStart: '',
        readAtEnd: '',
        entryTimeStart: '',
        entryTimeEnd: '',
        activeTitle: '', //渠道活动名称
        agentType: '', //渠道类型
        signContractStartTime: '',
        signContractEndTime: '',
        pageSize: 10,
        pageNo: 1,
      },
      isDownloadList: false,
      exprotFile: {
        visible: false,
        tableData: [],
        pageNo: 0,
        pageSize: 10,
        total: 0,
      },
      signDateArea: [],
      searchInworkDateArea: [],
      searchInstoreDateArea: [],
      signContractTimeStr: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    getChannelType()
      .then(data => {
        this.channelType = data;
      })
      .catch(err => {});
  },
  methods: {
    // 获取手机号信息
    getReferMobile(e, teaID, type, row) {
      let parm = {
        teaId: teaID,
        infoType: type,
      };
      e.target.innerText = '正在查询...';
      getTeacherSecretInfo(parm)
        .then(data => {
          row.agentMobile = data;
          row.currentRow = true;
        })
        .catch(message => {
          e.target.innerText = '信息不存在';
          row.currentRow = true;
          this.$Message({
            message,
          });
        });
    },
    handleExportDialog(type) {
      if (type === 'showExportList') {
        this.isDownloadList = true;
        this.resetDownloadData();
        this.getDownloadList();
      } else {
        this.isDownloadList = false;
      }

      this.exprotFile.visible = true;
    },
    asyncHandleSizeChange(pageSize) {
      this.exprotFile.pageSize = pageSize;
      this.exprotFile.pageNo = 1;
      this.getDownloadList();
    },
    asynchHandleCurrentChange(currentPage) {
      this.exprotFile.pageNo = currentPage;
      this.getDownloadList();
    },
    getDownloadList() {
      const { pageNo, pageSize } = this.exprotFile;
      this.$Fetch({
        url:
          '/api/zm-teacher-recruit-web/channelRec/agent/agentAward/exportFileList',
        method: 'post',
        data: {
          exportSource: 1,
          pageNo,
          pageSize,
        },
      })
        .then(data => {
          if (data.msgCode === '200') {
            this.exprotFile.tableData = data.data.records;
            this.exprotFile.total = data.data.total;
          } else {
            this.$Message.error({
              message: data.msgContent,
            });
          }
        })
        .catch(message => {
          this.$Message.error(message);
        });
    },
    disciplineDetail(row) {
      window.location.href = row.fileOssUrl;
    },
    handleExportAsync() {
      this.exprotFile.visible = false;
      this.$Fetch({
        url:
          '/api/zm-teacher-recruit-web/channelRec/agent/agentData/exportAsync',
        method: 'post',
        data: getVilidAttrWithEmpty(this.search_data),
      })
        .then(res => {
          if (res.msgCode === '200') {
            this.$Message.success('导出成功');
          } else {
            this.$Message.warning(res.msgContent);
          }
        })
        .catch(error => {
          this.$Message.error('请联系技术人员');
        });
    },
    resetDownloadData() {
      this.exprotFile.tableData = [];
      this.exprotFile.total = 0;
      this.exprotFile.pageNo = 1;
      this.exprotFile.pageSize = 10;
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
    chooseSignDate() {
      if (this.signDateArea[0] == null) {
        this.search_data.applyTimeStart = '';
        this.search_data.applyTimeEnd = '';
      } else {
        let sDate = new Date(this.signDateArea[0]).getTime();
        let eDate = new Date(this.signDateArea[1]).getTime();
        this.search_data.applyTimeStart =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.applyTimeEnd =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    getTableData() {
      this.tableLoading = true;
      let options = getVilidAttrWithEmpty(this.search_data);
      this.$Fetch({
        url: '/api/zm-teacher-recruit-web/channelRec/agent/queryAgentData',
        method: 'post',
        data: options,
      }).then(result => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == 200) {
          this.agentCount = data.agentCount;
          this.entryCount = data.entryCount;
          this.teaCount = data.teaCount;

          this.table_data = data.agentDataList.list;
          // 置空返回为null的渠道活动名称
          if (this.table_data && this.table_data.length) {
            for (let i = 0; i < this.table_data.length; i++) {
              if (
                this.table_data[i].activeTitle &&
                this.table_data[i].activeTitle === 'null'
              ) {
                this.table_data[i].activeTitle = '';
              }
              if (
                this.table_data[i].agentMobile &&
                this.table_data[i].agentMobile === 'null'
              ) {
                this.table_data[i].agentMobile = '';
              }
            }
          }
          this.table_data_total = data.agentDataList.total;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
          this.$Message({
            message: message,
          });
        }
        this.$sdk.sendEvent({
          eventId: 'click_teacher_agent_queryAgentData',
          eventParam: this.searchParam,
        });
      });
    },
    chooseInworkDate() {
      if (this.searchInworkDateArea[0] == null) {
        this.search_data.entryTimeStart = '';
        this.search_data.entryTimeEnd = '';
      } else {
        let sDate = new Date(this.searchInworkDateArea[0]).getTime();
        let eDate = new Date(this.searchInworkDateArea[1]).getTime();
        this.search_data.entryTimeStart =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.entryTimeEnd =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    chooseInstoreDate() {
      if (this.searchInstoreDateArea[0] == null) {
        this.search_data.readAtStart = '';
        this.search_data.readAtEnd = '';
      } else {
        let sDate = new Date(this.searchInstoreDateArea[0]).getTime();
        let eDate = new Date(this.searchInstoreDateArea[1]).getTime();
        this.search_data.readAtStart =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.readAtEnd =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    chooseSignContractTimeStr() {
      if (this.signContractTimeStr[0] == null) {
        this.search_data.signContractStartTime = '';
        this.search_data.signContractEndTime = '';
      } else {
        let sDate = new Date(this.signContractTimeStr[0]).getTime();
        let eDate = new Date(this.signContractTimeStr[1]).getTime();
        this.search_data.signContractStartTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.signContractEndTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    // 查询
    search() {
      this.search_data.pageNo = 1;
      this.getTableData();
    },
  },
  computed: {
    permission: function() {
      return this.$store.getters.permission;
    },
    permissionList: function () {
      return this.$store.getters.permissionList || [];
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.search_data.activeId = this.$route.query.id;
    }
    this.search_data.teaName = this.$route.query.teaName || '';
    this.search();
  },
  components: {},
};
</script>
<style lang="less">
.chanle-export-dialog {
  font-size: 12px;
  .el-dialog__footer,
  .el-dialog__body {
    background: #fff;
  }
  .mt10 {
    margin-top: 10px;
  }
}
</style>
