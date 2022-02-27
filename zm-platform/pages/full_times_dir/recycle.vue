<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="所属BU">
        <el-select v-model="search_data.teaBu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="1对1" value="1"></el-option>
          <el-option label="少儿" value="2"></el-option>
          <el-option label="陪练" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因">
        <el-select v-model="search_data.recycleReasonType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="预约跑单" value="8"></el-option>
          <el-option label="面试不通过" value="10"></el-option>
          <el-option label="面试缺席" value="11"></el-option>
          <el-option label="个人介绍不通过" value="20"></el-option>
          <el-option label="试用期跑单" value="21"></el-option>
          <el-option label="试用期主动离职" value="27"></el-option>
          <el-option label="试用期被动离职" value="28"></el-option>
          <el-option label="转正管理主动离职" value="127"></el-option>
          <el-option label="转正管理被动离职" value="128"></el-option>
          <el-option label="预约跑单" value="0"></el-option>
          <el-option label="试用期离职" value="601"></el-option>
          <el-option label="转正管理离职" value="605"></el-option>
          <el-option label="修改状态已离职" value="206"></el-option>
          <el-option label="已淘汰" value="250"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input
          v-model="search_data.keyWord"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>

      <el-form-item label="面试时间">
        <el-date-picker
          :editable="false"
          v-model="searchInterviewDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseInterviewDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="培训时间">
        <el-date-picker
          :editable="false"
          v-model="searchtrainDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseTrainDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名时间">
        <el-date-picker
          :editable="false"
          v-model="searchEnrollDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseEnrollDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否黑名单">
        <el-select v-model="search_data.blackName" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-button
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
        <span class="table-title">共{{ table_data_total }}个老师</span>
        <el-button
          size="small"
          @click="exportExcel()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:recycle:export')"
          >导出Excel</el-button
        >
        <el-button
          size="small"
          @click="teaStatueSetting()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:recycle:modifyState')"
          >修改状态</el-button
        >
      </div>
      <el-table
        :data="table_data"
        @selection-change="selectTable"
        style="width:100%"
      >
        <el-table-column align="center" type="selection" width="55" fixed>
        </el-table-column>
        <el-table-column align="center" label="姓名" width="120" fixed>
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="userDetail(scope.row)"
              >{{ scope.row.name }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" width="195">
          <template scope="scope">
            <span
              @click="getTeaSecret($event, scope.row.teaId, 'email')"
              class="detailsBtn"
              >点击查看信息</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="mobile" align="center" label="电话" width="140">
          <template scope="scope">
            <span
              @click="getTeaSecret($event, scope.row.teaId, 'mobile')"
              class="detailsBtn"
              >点击查看信息</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="qq" align="center" label="QQ" width="120">
          <template scope="scope">
            <span
              @click="getTeaSecret($event, scope.row.teaId, 'qq')"
              class="detailsBtn"
              >点击查看信息</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="teaBu" align="center" label="所属BU" width="180">
          <template scope="scope">
            {{ scope.row.teaBu | teaBuFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operateResultStr"
          align="center"
          label="原因"
          width="180"
        >
        </el-table-column>
        <el-table-column
          v-if="search_data.teaBu == '3'"
          prop="majorTeacher"
          align="center"
          label="是否主课老师"
          width="180"
        >
          <template scope="scope">
            {{ scope.row.majorTeacher | majorTeacherFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timeTypeStr"
          align="center"
          label="工作性质"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="grade"
          align="center"
          label="报名年级"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="subject"
          align="center"
          label="报名科目"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="degreeStr"
          align="center"
          label="最高学历"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="teaSchool"
          align="center"
          label="学校"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="followPerson"
          align="center"
          label="跟进人"
          width="185"
        >
        </el-table-column>
        <el-table-column
          prop="enterCoolTime"
          align="center"
          label="入库时间"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="lifeTime" align="center" label="生命周期">
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template scope="scope">
            <el-button
              v-if="scope.row.blackName == 0"
              size="small"
              @click="recoverySetting(scope.row.teaId)"
              type="text"
              >恢复至状态</el-button
            >
            <el-button
              v-if="scope.row.blackName == 0"
              size="small"
              @click="releaseAccountSetting(scope.row.teaId)"
              type="text"
              >释放账号</el-button
            >
            <el-button
              v-if="scope.row.blackName == 0"
              size="small"
              @click="addToBlackList(scope.row.teaId, scope.row.name)"
              type="text"
              >加入黑名单</el-button
            >
            <el-button
              v-if="scope.row.blackName == 1"
              size="small"
              @click="releaseFromBlackList(scope.row.teaId, scope.row.name)"
              type="text"
              >移出黑名单</el-button
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
      >
      </el-pagination>
      <el-dialog
        :title="userDetailName"
        v-model="userDetailDialog"
        size="large"
        @close="closeUserDetailDialog"
      >
        <el-tabs
          v-model="userDetailTabNumber"
          @tab-click="userDetailTab"
          class="order_dialog_body rder_dialog_bodys"
        >
          <el-tab-pane label="基本信息/简历" name="first">
            <basic-message
              ref="basicMessageEle"
              @entry-audit="entryAudit"
              :cipherTId="cipherTId"
              :name="userDetailName"
              :prodata="proData"
              :bu="bu"
              @preview="confirmPreviewDialog"
              @audit="teaAudit"
              :viewState="userDetailDialog"
              @confirm="confirmUserDetailDialog()"
              @cancel="closeUserDetailDialog()"
              :currentID="userDetailId"
              :teaStatue="5"
              class="mg-20"
              :base-info="userDetailData"
              :eduBackData="eduBackData"
              :salaryAnPaylData="salaryAnPaylData"
              :teaPersonalInfoData="teaPersonalInfoData"
            ></basic-message>
          </el-tab-pane>
          <el-tab-pane label="笔试信息" name="second">
            <written-record
              :userDetailDataPlus="userDetailDataPlus"
            ></written-record>
          </el-tab-pane>
          <el-tab-pane label="移交记录" name="four">
            <hand-over
              :userDetailDataHandsRecords="userDetailDataHandsRecords"
            ></hand-over>
          </el-tab-pane>
          <el-tab-pane label="个人介绍审核记录" name="eight">
            <introduction-audit
              :userIntroductionAuditRecords="userIntroductionAuditRecords"
            ></introduction-audit>
          </el-tab-pane>
          <el-tab-pane label="操作记录" name="operationRecordMix">
            <operation-record-mix
              ref="operationRecordMix"
            ></operation-record-mix>
          </el-tab-pane>
          <el-tab-pane label="历史记录" name="historyRecord">
            <history-record :historyRecord="historyRecord"></history-record>
          </el-tab-pane>
          <el-tab-pane label="应聘记录" name="applicationRecord">
            <application-record
              ref="applicationRecordRef"
              @open-this-dialog="openThisDialog"
            ></application-record>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <!-- 查看面试者详情 -->
      <application-record-dialog ref="applicationRecordDialog" />
      <!--释放账号dialog-->
      <el-dialog
        :white="true"
        title="释放账号"
        v-model="releaseAccountSettingDialog"
        size="small"
        @close="cancelReleaseAccountSettingDialog"
      >
        <release-account
          :viewState="releaseAccountSettingDialog"
          :currentID="currentID"
          @confirm="confirmReleaseAccountSettingDialog"
          @cancel="cancelReleaseAccountSettingDialog"
        ></release-account>
      </el-dialog>
      <!--恢复至dialog-->
      <el-dialog
        :white="true"
        title="恢复至"
        v-model="recoverySettingDialog"
        size="small"
        @close="cancelRecoverySettingDialog"
      >
        <recovery
          :recoveryStateData="recoveryStateData"
          :viewState="recoverySettingDialog"
          :currentID="currentID"
          @confirm="confirmRecoverySettingDialog"
          @cancel="cancelRecoverySettingDialog"
        ></recovery>
      </el-dialog>
      <!--教师审核dialog-->
      <el-dialog
        :white="true"
        title="教师审核"
        v-model="teaAuditSettingDialog"
        size="small"
        @close="cancelTeaAuditSettingDialog"
      >
        <tea-mes-audit
          :teaCheckState="teaCheckState"
          :auditData="auditData"
          :viewState="teaAuditSettingDialog"
          :currentID="auditTeaId"
          @confirm="confirmTeaAuditSettingDialog"
          @cancel="cancelTeaAuditSettingDialog"
        ></tea-mes-audit>
      </el-dialog>
      <!--修改状态dialog-->
      <el-dialog
        :white="true"
        title="修改状态"
        v-model="teaStatueSettingDialog"
        size="small"
        @close="cancelTeaStatueSettingDialog"
      >
        <tea-statue-change
          type="4"
          :viewState="teaStatueSettingDialog"
          :currentID="currentID"
          @confirm="confirmTeaStatueSettingDialog"
          @cancel="cancelTeaStatueSettingDialog"
        ></tea-statue-change>
      </el-dialog>

      <!--入职信息dialog-->
      <el-dialog
        :white="true"
        title="入职资料审核"
        v-model="teaEntryAuditSettingDialog"
        size="small"
        @close="cancelTeaEntryAuditSettingDialog"
      >
        <tea-entry-audit
          :name="auditEntryTeaName"
          :viewState="teaEntryAuditSettingDialog"
          :currentID="auditEntryTeaId"
          @confirm="confirmTeaEntryAuditSettingDialog"
          @cancel="cancelTeaEntryAuditSettingDialog"
        ></tea-entry-audit>
      </el-dialog>

      <!--跑单dialog-->
      <preview
        :teaData="previewData"
        :eduBackData="eduBackData"
        v-show="previewDialog && bu != 3"
        @cancel="cancelPreviewDialog"
        :viewState="previewDialog"
        :currentID="currentID"
      ></preview>
      <resume-pl
        ref="resumePl"
        :teaData="previewData"
        v-show="previewDialog && bu == 3"
        @cancel="cancelPreviewDialog"
        :viewState="previewDialog"
        :currentID="currentID"
      ></resume-pl>
    </div>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import { deepCopy } from '../../../src/utils/assist';
import releaseAccount from '../dialog/release_account';
import recovery from '../dialog/recovery';
import teaStatueChange from '../dialog/tea_statue_change';
import teaMesAudit from '../dialog/tea_mes_audit';
import teaEntryAudit from '../dialog/tea_entry_audit';

import basicMessage from '../userInfoItems/basic_message';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
import handOver from '../userInfoItems/hand_over';
import trainingRecords from '../userInfoItems/training_records';
import identifyRecords from '../userInfoItems/identify_records';
import interviewRecords from '../userInfoItems/interview_records';
import introductionAudit from '../userInfoItems/introduction_audit';
import probationPeriod from '../userInfoItems/probation_period';
import fullMemberManage from '../userInfoItems/full_member_manage';
import waitEntry from '../userInfoItems/wait_entry';

import recycleRecord from '../userInfoItems/recycle_record';
import getProvinces from '../../api/select/getProvinces';
import basicInfo from '../../api/select/basicInfo';
import testInfo from '../../api/select/testInfo';
import getReserveRecords from '../../api/select/getReserveRecords';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getRecycleTeachers from '../../api/select/getRecycleTeachers';
import salaryAnPay from '../../api/select/salaryAnPay';
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import getOldProcesses from '../../api/select/getOldProcesses';
import leaveRecords from '../userInfoItems/leave_records';

import getEduBack from '../../api/select/getEduBack';
import getReviewList from '../../api/select/getReviewList';
import operateLog from '../../api/select/operateLog';
import oneJoinBlackName from '../../api/action/oneJoinBlackName';
import oneReleaseBlackName from '../../api/action/oneReleaseBlackName';
import getSubject from '../../api/select/getSubject';
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';

import newRecycleControllerExport from '../../api/action/newRecycleControllerExport';
import resumePl from '../dialog/resume_pl';

import historyRecordMixin from './historyRecordMixin';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import applicationRecordMixin from './applicationRecordMixin';

export default {
  mixins: [historyRecordMixin, applicationRecordMixin],
  data() {
    return {
      searchtrainDateArea: [],
      searchEnrollDateArea: [],
      searchInterviewDateArea: [],
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      basesubjectlist: [],
      auditEntryTeaId: '',
      auditEntryTeaName: '',
      teaEntryAuditSettingDialog: false,
      userDetailDialog: false, // 个人信息弹出框控制
      userDetailTabNumber: 'first', //个人信息弹出框tab索引
      userDetailId: '', //个人信息弹出框用户ID
      cipherTId: '', // 密文老师ID
      userDetailName: '', //个人信息弹出框用户名
      userDetailMobile: '', //个人信息弹出框用户手机号
      userDetailData: {}, //个人信息弹出框-基本信息
      eduBackData: {},
      salaryAnPaylData: {},
      teaPersonalInfoData: {},
      userDetailDataPlus: [], //个人信息弹出框-笔试信息
      userDetailDataReserveRecords: [], //个人信息弹出框-预约记录
      userDetailDataHandsRecords: [], //个人信息糖醋狂-移交记录
      userDetailDataReviewRecords: [], //个人信息弹出框-面试记录
      userDetailDataTrainingRecords: [], //个人信息弹出框-培训记录
      userDetailDataIdentifyRecords: [], //个人信息弹出框-实名记录
      userDetailDataLeavingRecords: [],
      userIntroductionAuditRecords: [], //个人信息弹出框-个人介绍审核记录
      userProbationPeriod: [], //个人信息弹出框-试用期管理记录
      waitEntryData: [],
      fullMemberData: [], //个人信息弹出框-转正管理记录
      userDetailDataRecycleRecords: [], //个人信息弹出框-回收站记录
      bu: '',
      exportOptions: {},
      //对话框
      releaseAccountSettingDialog: false, //释放账号dialog
      recoverySettingDialog: false, //恢复至dialog
      teaStatueSettingDialog: false, //修改状态dialog
      teaAuditSettingDialog: false,
      previewDialog: false,
      // 搜素字段
      search_data: {
        teaBu: '',
        recycleReasonType: '', //string
        blackName: '', //string
        keyWord: '', //string
        pageNo: 1, //number
        pageSize: 10, //number
      },
      //日期配置
      searchDateArea: [],
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
      // 初始table数据
      table_data: [],
      tableLoading: true,
      table_data_total: 0,
      selectTableText: '个人基本信息-基本信息',
      addBlackListState: false, //加入黑名单控制
      releaseBlackListState: false, //加入黑名单控制
      // 被选择的用户
      selectName: [],
      currentID: null,
      auditData: [],
      auditTeaId: '',
      previewData: {},
      recoveryStateData: null,
      teaCheckState: null,
      proData: [],
    };
  },
  filters: {
    teaBuFilter(val) {
      if (val == '1') {
        return '1对1';
      }
      if (val == '2') {
        return '少儿';
      }
      if (val == '3') {
        return '陪练';
      }
      return '';
    },
    majorTeacherFilter(val) {
      if (val == '1') {
        return '是';
      }
      if (val == '0') {
        return '否';
      }
      return '';
    },
  },
  watch: {
    userDetailTabNumber(val) {
      switch (val) {
        case 'first':
          this.selectTableText = '个人基本信息-基本信息';
          break;
        case 'second':
          this.selectTableText = '个人基本信息-笔试信息';
          break;
        case 'third':
          this.selectTableText = '个人基本信息-预约记录';
          break;
        case 'four':
          this.selectTableText = '个人基本信息-移交记录';
          break;
        case 'five':
          this.selectTableText = '个人基本信息-面试记录';
          break;
        case 'six':
          this.selectTableText = '个人基本信息-培训记录';
          break;
        case 'seven':
          this.selectTableText = '个人基本信息-入职记录';
          break;
        case 'eight':
          this.selectTableText = '个人基本信息-个人介绍审核记录';
          break;
        case 'nine':
          this.selectTableText = '个人基本信息-试用期管理记录';
          break;
        case 'ten':
          this.selectTableText = '个人基本信息-转正管理记录';
          break;
        case 'eleven':
          this.selectTableText = '个人基本信息-离职记录';
          break;
        case 'twelve':
          this.selectTableText = '个人基本信息-回收站记录';
          break;
        case 'thirteen':
          this.selectTableText = '个人基本信息-实名记录';
          break;
        case 'historyRecord':
          this.selectTableText = '个人基本信息-历史记录';
          break;
        case 'operationRecordMix':
          this.selectTableText = '个人基本信息-操作记录';
          break;
        default:
      }
    },
  },
  methods: {
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
    },
    // 选择培训范围
    chooseTrainDate() {
      if (this.searchtrainDateArea[0] == null) {
        this.search_data.startTrainTime = '';
        this.search_data.endTrainTime = '';
      } else {
        let sDate = new Date(this.searchtrainDateArea[0]).getTime();
        let eDate = new Date(this.searchtrainDateArea[1]).getTime();
        this.search_data.startTrainTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endTrainTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
        this.chooseDate(
          this.search_data.startTrainTime,
          this.search_data.endTrainTime
        );
      }
    },
    // 选择报名范围
    chooseEnrollDate() {
      if (this.searchEnrollDateArea[0] == null) {
        this.search_data.startApplyTime = '';
        this.search_data.endApplyTime = '';
      } else {
        let sDate = new Date(this.searchEnrollDateArea[0]).getTime();
        let eDate = new Date(this.searchEnrollDateArea[1]).getTime();
        this.search_data.startApplyTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endApplyTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    // 选择面试范围
    chooseInterviewDate() {
      if (this.searchInterviewDateArea[0] == null) {
        this.search_data.startInterviewTime = '';
        this.search_data.endInterviewTime = '';
      } else {
        let sDate = new Date(this.searchInterviewDateArea[0]).getTime();
        let eDate = new Date(this.searchInterviewDateArea[1]).getTime();
        this.search_data.startInterviewTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endInterviewTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    entryAudit(id, name) {
      this.auditEntryTeaId = id;
      this.auditEntryTeaName = name;
      this.teaEntryAuditSettingDialog = true;
    },
    confirmTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = '';
      this.auditEntryTeaName = '';
      this.teaEntryAuditSettingDialog = false;
    },
    cancelTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = '';
      this.auditEntryTeaName = '';
      this.teaEntryAuditSettingDialog = false;
    },
    getTeaSecret(e, teaID, type) {
      if (this.requestTeaSecretState) {
        this.$Message({
          message: '请等待上次查询完成',
        });
        return;
      }
      if (this.requestTeaSecretTime < 5) {
        this.$Message({
          message: '单次查询间隔为5秒钟',
        });
        return;
      }
      this.requestTeaSecretTime = 0;
      this.requestTeaSecretState = true;
      let elementList = document.querySelectorAll('.detailsBtn');
      for (let i = 0; i < elementList.length; i++) {
        elementList[i].innerText = '点击查看信息';
      }
      let parm = {
        teaId: teaID,
        infoType: type,
      };
      e.target.innerText = '正在查询...';
      getTeacherSecretInfo(parm)
        .then(data => {
          this.requestTeaSecretState = false;
          e.target.innerText = data;
          this.requestTeaSecretInterval = window.setInterval(() => {
            if (this.requestTeaSecretTime >= 5) {
              window.clearInterval(this.requestTeaSecretInterval);
            } else {
              this.requestTeaSecretTime = this.requestTeaSecretTime + 1;
            }
          }, 1000);
        })
        .catch(message => {
          this.requestTeaSecretTime = 5;
          e.target.innerText = '信息不存在';
          this.requestTeaSecretState = false;
          // this.$Message({
          //     message
          // });
        });
    },
    getProData() {
      getProvinces()
        .then(data => {
          this.proData = data;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    // 获取表单数据
    getTableData() {
      !!this.$parent.getOverview ? this.$parent.getOverview() : null; //更新tab数据
      this.tableLoading = true;
      getRecycleTeachers(this.search_data)
        .then(data => {
          this.table_data = data.list;
          this.table_data_total = data.total;
          this.tableLoading = false;
        })
        .catch(message => {
          this.$Message({
            message: message,
          });
          this.tableLoading = false;
        });
    },
    // 转化时间格式
    transformDate(row, column) {
      return this.$DateTransform(row[column.property]);
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
    // 选择日期范围
    chooseDate() {
      if (this.searchDateArea[0] == null) {
        this.search_data.startApplyDate = '';
        this.search_data.endApplyDate = '';
      } else {
        this.search_data.startApplyDate = new Date(
          this.searchDateArea[0]
        ).getTime();
        this.search_data.endApplyDate = new Date(
          this.searchDateArea[1]
        ).getTime();
      }
    },
    // 查询
    search() {
      this.exportOptions = deepCopy(this.search_data);
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    // 导出excel
    exportExcel() {
      newRecycleControllerExport(this.exportOptions);
    },
    selectTable(val) {
      let ids = [];
      val.forEach(value => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
    },
    // 点击用户名查看详情
    userDetail({ teaId, name, mobile, teaBu, cipherTId }) {
      this.userDetailDialog = true;
      this.userDetailId = teaId;
      this.cipherTId = cipherTId;
      this.bu = teaBu;
      this.userDetailName = name;
      this.userDetailMobile = mobile;
      basicInfo({ teaId: cipherTId })
        .then(data => {
          this.userDetailData = data;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
      getEduBack({ teaId })
        .then(_data => {
          getSubject({ bu: teaBu })
            .then(data => {
              this.eduBackData = _data;
              this.$refs.basicMessageEle.basesubject = data.children;
            })
            .catch(message => {
              this.$Message({
                message: '基础科目获取异常',
              });
              this.basesubjectlist = [];
            });
        })
        .catch(message => {
          console.log('error:', message);
        });
      salaryAnPay({ teaId })
        .then(data => {
          this.salaryAnPaylData = data;
        })
        .catch(message => {
          this.salaryAnPaylData = null;
          console.log('error:', message);
        });
      getTeaPersonalInfo({ teaId })
        .then(data => {
          this.teaPersonalInfoData = data;
        })
        .catch(message => {
          this.teaPersonalInfoData = null;
          console.log('error:', message);
        });
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailTabNumber = 'first';
      this.userDetailData = {};
      this.eduBackData = {};
      this.salaryAnPaylData = {};
      this.teaPersonalInfoData = {};

      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataReviewRecords = [];
      this.userDetailDataTrainingRecords = [];
      this.userDetailDataIdentifyRecords = [];
      this.userIntroductionAuditRecords = [];
      this.userProbationPeriod = [];
      this.historyRecord = [];
      this.waitEntryData = [];
      this.fullMemberData = [];
      this.userDetailDataRecycleRecords = [];
      this.userDetailDataLeavingRecords = [];

      this.userDetailDialog = false;
    },
    confirmUserDetailDialog() {
      this.getTableData();
      this.closeUserDetailDialog();
    },
    // 用户详情tab键
    userDetailTab(tab, event) {
      if (tab.name === 'first') {
        testInfo({ teacherId: this.userDetailId })
          .then(data => {
            this.userDetailDataPlus = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
      if (tab.name === 'second') {
        getReserveRecords({ teacherId: this.userDetailId })
          .then(data => {
            this.userDetailDataReserveRecords = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
      // if (tab.index == 3) {
      //     getTransferRecords({teaId:this.userDetailId}).then(data => {
      //         this.userDetailDataHandsRecords = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      if (tab.name === 'four') {
        getInterviewRecords({ teaId: this.userDetailId })
          .then(data => {
            this.userDetailDataReviewRecords = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
      // if (tab.index == 5) {
      //     getTrainingRecords({teaId:this.userDetailId}).then(data => {
      //         this.userDetailDataTrainingRecords = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      // if(tab.index == 6){
      //   getEntryRecordLogs({teaId:this.userDetailId}).then(data => {
      //       this.waitEntryData = data;
      //   }).catch(message => {
      //       this.$Message({
      //           message
      //       });
      //   });
      // }
      // if(tab.index == 7){
      //   getReviewList({teaId:this.userDetailId}).then(data => {
      //     this.userIntroductionAuditRecords = data;
      //   }).catch(message => {
      //     this.$Message({
      //         message
      //     });
      //   });
      // }
      if (tab.name === 'eight') {
        operateLog({ teaId: this.userDetailId })
          .then(data => {
            this.userProbationPeriod = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
      // if(tab.index == 9){
      //   //获取转正记录
      //   regularLogList({teaId:this.userDetailId}).then(data => {
      //       this.fullMemberData = data;
      //   }).catch(message => {
      //       this.$Message({
      //           message
      //       });
      //   });
      // }
      // if (tab.index == 10) {
      //     getLeaveRecordLogs({teaId:this.userDetailId}).then(data => {
      //         this.userDetailDataLeavingRecords = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      // if(tab.index == 11){
      //   //获取转正记录
      //   getRecycleRecords({teaId:this.userDetailId}).then(data => {
      //       this.userDetailDataRecycleRecords = data;
      //   }).catch(message => {
      //       this.$Message({
      //           message
      //       });
      //   });
      // }
      // if (tab.index == 11) {
      //     getIdentifyRecords({teaId:this.userDetailId}).then(data => {
      //         this.userDetailDataIdentifyRecords = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      if (tab.name === 'historyRecord') {
        this.handleGetTeacherHistoryRecord(this.userDetailId);
      }
      if (tab.name === 'operationRecordMix') {
        this.$refs.operationRecordMix.getData(this.userDetailId);
      }
      if (tab.name === 'applicationRecord') {
        this.$refs.applicationRecordRef.getRecruitLogsUsing(this.userDetailId);
      }
      // if(tab.index == 13) this.handleGetTeacherHistoryRecord(this.userDetailId)
    },
    //确定关闭账号设置后
    confirmReleaseAccountSettingDialog() {
      this.releaseAccountSettingDialog = false;
      this.getTableData();
    },
    //释放账号设置
    releaseAccountSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.releaseAccountSettingDialog = true;
    },
    //取消释放账号设置后
    cancelReleaseAccountSettingDialog() {
      this.releaseAccountSettingDialog = false;
    },
    //确定恢复至某状态后
    confirmRecoverySettingDialog() {
      this.recoverySettingDialog = false;
      this.getTableData();
    },
    //恢复至状态设置
    recoverySetting(teacherId) {
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      //获取该教师可以恢复的状态
      getOldProcesses({ teaId: teacherId })
        .then(data => {
          if (data.length == 0) {
            this.$Message({
              message: '无状态可供恢复',
            });
          } else {
            this.currentID = !!teacherId ? teacherId : this.selectName;
            this.recoveryStateData = data;
            this.recoverySettingDialog = true;
          }
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    //取消恢复至状态设置后
    cancelRecoverySettingDialog() {
      this.recoverySettingDialog = false;
    },
    //确定修改状态设置后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //修改状态设置
    teaStatueSetting() {
      if (this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = this.selectName;
      this.teaStatueSettingDialog = true;
    },
    //取消修改状态设置后
    cancelTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
    },
    confirmTeaAuditSettingDialog() {
      this.teaAuditSettingDialog = false;
      this.auditTeaId = '';
      //重新请求教师资料数据
      getTeaPersonalInfo({ teaId: this.userDetailId })
        .then(data => {
          this.teaPersonalInfoData = data;
        })
        .catch(message => {
          this.teaPersonalInfoData = null;
          console.log('error:', message);
        });
    },
    addToBlackList(teacherId, teacherName) {
      if (this.addBlackListState) {
        return;
      }
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.$MessageBox
        .confirm(`确定要将${teacherName}老师加入黑名单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.addBlackListState = true;
          oneJoinBlackName({ teaId: teacherId })
            .then(data => {
              this.addBlackListState = false;
              this.getTableData();
            })
            .catch(message => {
              this.$Message({
                message,
              });
              this.addBlackListState = false;
            });
        })
        .catch(message => {
          this.addBlackListState = false;
        });
    },
    releaseFromBlackList(teacherId, teacherName) {
      if (this.releaseBlackListState) {
        return;
      }
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.$MessageBox
        .confirm(`确定要将${teacherName}老师移出黑名单吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.releaseBlackListState = true;
          oneReleaseBlackName({ teaId: teacherId })
            .then(data => {
              this.releaseBlackListState = false;
              this.getTableData();
            })
            .catch(message => {
              this.$Message({
                message,
              });
              this.releaseBlackListState = false;
            });
        })
        .catch(message => {
          this.releaseBlackListState = false;
        });
    },
    teaAudit(teaId, checkState) {
      this.auditTeaId = teaId;
      getReviewList({ teaId: teaId })
        .then(data => {
          this.teaAuditSettingDialog = true;
          this.auditData = data;
          this.teaCheckState = checkState;
        })
        .catch(message => {
          this.teaAuditSettingDialog = true;
        });
    },
    cancelTeaAuditSettingDialog() {
      this.auditTeaId = '';
      this.teaAuditSettingDialog = false;
    },
    confirmPreviewDialog(data) {
      this.previewData = data;
      this.previewDialog = true;
    },
    cancelPreviewDialog() {
      this.previewDialog = false;
    },
  },
  computed: {
    permission: function() {
      return this.$store.getters.permission;
    },
  },
  created() {
    this.search_data.keyWord = this.$route.query.keyWord || '';
    if (this.$store.getters.permission) {
      this.getTableData();
    }
  },
  mounted() {
    this.getProData();
    this.$on('search', function(val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
  },
  components: {
    'release-account': releaseAccount,
    recovery: recovery,
    'tea-statue-change': teaStatueChange,
    'basic-message': basicMessage,
    'order-record': orderRecord,
    'hand-over': handOver,
    'tea-mes-audit': teaMesAudit,
    'written-record': writtenRecord,
    'training-records': trainingRecords,
    'identify-records': identifyRecords,
    'interview-records': interviewRecords,
    'introduction-audit': introductionAudit,
    'probation-period': probationPeriod,
    'full-member-manage': fullMemberManage,
    'recycle-record': recycleRecord,
    preview: require('../dialog/preview_new').default,
    'resume-pl': resumePl,
    'wait-entry': waitEntry,
    'leave-records': leaveRecords,
    'tea-entry-audit': teaEntryAudit,
    'operation-record-mix': operationRecordMix,
  },
};
</script>
<style lang="less" scoped>
.el-dropdown {
  float: right;
  font-size: 12px;
  .el-dropdown-link {
    color: #007fff;
    &:hover,
    &:focus {
      color: #4db3ff;
      border-color: #4db3ff;
    }
  }
}
.detailsBtn {
  cursor: pointer;
}
</style>
