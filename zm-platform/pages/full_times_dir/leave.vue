<style scoped>
.detailsBtn {
  cursor: pointer;
}
.width-100 {
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<style lang="less">
.dialog-width-70 {
  .el-dialog {
    width: 70% !important;
  }
}
</style>
<template>
  <div class="full-time-container" v-if="permission">
    <!--条件搜索框-->
    <el-form
      :inline="true"
      :model="search_data"
      class="search-form"
    >
      <el-form-item label="关键词">
        <el-input
          ID="preTrainingKeyWords"
          v-model="search_data.content"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属BU">
        <el-select
          @change="buChnage"
          v-model="search_data.bu"
          placeholder="请选择"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="1对1" value="1"></el-option>
          <el-option label="少儿" value="2"></el-option>
          <el-option label="陪练" value="3"></el-option>
          <el-option label="优课" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作性质">
        <el-select v-model="search_data.timeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="离职申请时间">
        <el-date-picker
          :editable="false"
          v-model="searchLeaveDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseLeaveDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="离职属性">
        <el-select v-model="search_data.leaveType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="主动离职" :value="0"></el-option>
          <el-option label="被动离职" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="离职状态">
        <el-select v-model="search_data.state" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="离职待交接" value="45"></el-option>
          <el-option label="离职已交接" value="46"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第一擅长科目">
        <el-select v-model="search_data.subjectCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in basesubList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好">
        <el-select v-model="search_data.gradeCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in phaseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资格证">
        <el-select v-model="search_data.certificateType" placeholder="请选择">
          <el-option
            v-for="item in teaCerOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否缴纳社保">
        <el-select v-model="search_data.socialSecurity" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="离职原因">
        <el-select
          v-model="search_data.leaveReasonTypes"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in teaLeaveReasonOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可发离职证明">
        <el-select v-model="search_data.isSendCer" placeholder="请选择">
          <el-option label="全部" value=""> </el-option>
          <el-option label="是" :value="0"> </el-option>
          <el-option label="否" :value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师类型">
        <el-select
          filterable
          v-model="search_data.teaType"
          placeholder="请选择老师类型"
        >
          <el-option
            v-for="item in teaTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
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
    <!--列表容器-->
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <!--批量操作控件-->
      <div class="table-head">
        <el-button
          size="small"
          @click="exportExcel()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:leave:export')"
          >导出Excel</el-button
        >
        <!-- <el-button size="small" @click="teaStatueSetting()" type="text" v-if="checkPermission('recruit:process:fulltime:interview:modifyState')">修改状态</el-button> -->

        <span class="table-title">共{{ table_data_total }}个老师</span>
      </div>
      <!--列表-->
      <el-table
        :data="table_data"
        @selection-change="selectTable"
        style="width: 100%"
      >
        <el-table-column align="center" label="姓名" width="120" fixed>
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="userDetail(scope.row)"
              >{{ scope.row.teaName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="teaBu" align="center" label="所属BU" width="100">
          <template scope="scope">
            {{ scope.row.teaBu | buFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="teaPreviousState"
          align="center"
          label="离职前状态"
          width="100"
        >
          <template scope="scope">
            {{ scope.row.teaPreviousState | teaStateFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="leaveType"
          align="center"
          label="离职属性"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="leaveReasonType"
          align="center"
          label="离职原因"
          width="100"
        >
          <template scope="scope">
            {{ leaveReasonTypeFun(scope.row.leaveReasonType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="leaveReason"
          align="center"
          label="具体离职原因"
          width="100"
        >
          <template scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.leaveReason"
              placement="top"
            >
              <p class="width-100">{{ scope.row.leaveReason }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="submitLeaveTime"
          align="center"
          label="申请离职时间"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="timeType"
          align="center"
          label="工作性质"
          width="100"
        >
          <template scope="scope">
            {{ scope.row.timeType | timeTypeFilters }}
          </template>
        </el-table-column>
        <el-table-column prop="grade" align="center" label="年级" width="100">
        </el-table-column>
        <el-table-column prop="subject" align="center" label="科目" width="100">
        </el-table-column>
        <!-- <el-table-column prop="edu" align="center" label="最高学历" width="100">
                </el-table-column>
                <el-table-column prop="schoolName" align="center" label="学校" width="200">
                </el-table-column> -->
        <el-table-column
          prop="schoolName"
          align="center"
          label="最后上课时间"
          width="250"
        >
          <template scope="scope">
            {{ transformDate(scope.row.lesStartTime) }}-{{
              transformEndDate(scope.row.lesEndTime)
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="trunRegularTime"
          align="center"
          label="转正时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="socialSecurity"
          align="center"
          label="是否缴纳社保"
          width="200"
        >
          <template scope="scope">
            {{ scope.row.socialSecurity ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" width="195">
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="getTeaSecret($event, scope.row.teaId, 'email')"
              class="detailsBtn"
              >点击查看信息</el-button
            >
          </template>
        </el-table-column>

        <!-- <el-table-column prop="qqNo" align="center" label="QQ" width="120">
                  <template scope="scope">
                    <span @click="getTeaSecret($event,scope.row.teaId,'qq')" class="detailsBtn">点击查看信息</span>
                  </template>
                </el-table-column>
                <el-table-column prop="weiChatNo" align="center" label="微信" width="120">
                  <template scope="scope">
                    <span @click="getTeaSecret($event,scope.row.teaId,'wx')" class="detailsBtn">点击查看信息</span>
                  </template>
                </el-table-column> -->
        <el-table-column
          prop="applyHour"
          align="center"
          label="已申请时间"
          width="100"
        >
          <template scope="scope">
            {{ scope.row.applyHour | hourFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" label="状态" width="100">
          <template scope="scope">
            {{ scope.row.state | stateFilters }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template scope="scope">
            <el-button
              @click="
                openStuHanoverDetailsSettingDialog(
                  scope.row.teaId,
                  scope.row.teaBu
                )
              "
              size="small"
              type="text"
              >查看交接详情</el-button
            >
            <el-button
              v-if="scope.row.isSendCer === 0"
              @click="
                openleaveCertificateSettingDialog(
                  scope.row.teaId,
                  scope.row.teaName,
                  scope.row.lesEndTime
                )
              "
              size="small"
              type="text"
              >发离职证明</el-button
            >
            <el-button
              v-if="
                hasBtnCancelLeaving(scope.row) && scope.row.transferPost === 0
              "
              @click="cancelLeave(scope.row.teaId, scope.row.teaName)"
              size="small"
              type="text"
              >取消离职</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--分页控件-->
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
    </div>
    <!--用户详情框-->
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
            currentRoute="leave_list"
            ref="basicMessageEle"
            :entry-info-enable="1"
            @entry-audit="entryAudit"
            :name="userDetailName"
            :prodata="proData"
            :bu="bu"
            @preview="confirmPreviewDialog"
            @audit="teaAudit"
            :viewState="userDetailDialog"
            @confirm="confirmUserDetailDialog()"
            @cancel="closeUserDetailDialog()"
            :teaStatue="4"
            class="mg-20"
            :currentID="userDetailId"
            :cipherTId="cipherTId"
            :base-info="userDetailData"
            :eduBackData="eduBackData"
            :salaryAnPaylData="salaryAnPaylData"
            :teaPersonalInfoData="teaPersonalInfoData"
          ></basic-message>
        </el-tab-pane>
        <!--<el-tab-pane label="笔试信息" name="second">
                  <written-record :userDetailDataPlus="userDetailDataPlus"></written-record>
                </el-tab-pane>-->
        <!-- <el-tab-pane label="预约记录" name="third">
                  <order-record :userDetailDataReserveRecords="userDetailDataReserveRecords"></order-record>
                </el-tab-pane> -->
        <el-tab-pane label="移交记录" name="four">
          <hand-over
            :userDetailDataHandsRecords="userDetailDataHandsRecords"
          ></hand-over>
        </el-tab-pane>
        <!-- <el-tab-pane label="面试记录" name="five">
                  <interview-records :userDetailDataReviewRecords="userDetailDataReviewRecords"></interview-records>
                </el-tab-pane> -->
        <!-- <el-tab-pane label="培训记录" name="six">
                  <training-records :userDetailDataTrainingRecords="userDetailDataTrainingRecords"></training-records>
                </el-tab-pane> -->
        <!-- <el-tab-pane label="入职记录" name="seven">
                  <wait-entry :fullMemberData="waitEntryData"></wait-entry>
                </el-tab-pane> -->
        <el-tab-pane label="个人介绍审核记录" name="eight">
          <introduction-audit
            :userIntroductionAuditRecords="userIntroductionAuditRecords"
          ></introduction-audit>
        </el-tab-pane>
        <!-- <el-tab-pane label="试用期管理记录" name="nine">
                  <probation-period :userProbationPeriod="userProbationPeriod"></probation-period>
                </el-tab-pane> -->
        <!-- <el-tab-pane label="转正管理记录" name="ten">
                  <full-member-manage :fullMemberData="fullMemberData"></full-member-manage>
                </el-tab-pane> -->
        <!-- <el-tab-pane label="离职管理记录" name="eleven">
                  <leave-records :userDetailDataLeavingRecords="userDetailDataLeavingRecords"></leave-records>
                </el-tab-pane> -->
        <el-tab-pane label="操作记录" name="operationRecordMix">
          <operation-record-mix ref="operationRecordMix"></operation-record-mix>
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

    <!--修改状态dialog-->
    <el-dialog
      :white="true"
      title="修改状态"
      v-model="teaStatueSettingDialog"
      size="small"
      @close="cancelTeaStatueSettingDialog"
    >
      <tea-statue-change
        type="0"
        :viewState="teaStatueSettingDialog"
        :currentID="currentID"
        @confirm="confirmTeaStatueSettingDialog"
        @cancel="cancelTeaStatueSettingDialog"
      ></tea-statue-change>
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

    <!--离职证明dialog-->
    <el-dialog
      :white="true"
      title="离职证明"
      v-model="leaveCertificateSettingDialog"
      size="small"
      @close="cancelLeaveCertificateSettingDialog"
    >
      <leave-certificate
        v-if="leaveCertificateSettingDialog"
        :viewState="leaveCertificateSettingDialog"
        :currentName="certificateName"
        :currentID="certificateId"
        :teacherLeaveTime="teacherLeaveEndTime"
        @confirm="confirmleaveCertificateSettingDialog"
        @cancel="cancelLeaveCertificateSettingDialog"
      ></leave-certificate>
    </el-dialog>

    <!--交接详情dialog-->
    <el-dialog
      :white="true"
      class="dialog-width-70"
      title="交接详情"
      v-model="stuHanoverDetailsSettingDialog"
      size="small"
      @close="cancelStuHanoverDetailsSettingDialog"
    >
      <stu-hanover-details
        v-if="stuHanoverDetailsSettingDialog"
        :viewState="stuHanoverDetailsSettingDialog"
        :currentID="stuHanoverDetailsId"
        :bu="stuHanoverDetailsBu"
        @confirm="confirmStuHanoverDetailsSettingDialog"
        @cancel="cancelStuHanoverDetailsSettingDialog"
      ></stu-hanover-details>
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
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import basicMessage from "../userInfoItems/basic_message";
import writtenRecord from "../userInfoItems/written_record";
import orderRecord from "../userInfoItems/order_record";
import handOver from "../userInfoItems/hand_over";
import leaveCertificate from "../dialog/leaveCertificate";
import teaStatueChange from "../dialog/tea_statue_change";
import interviewRecords from "../userInfoItems/interview_records";
import trainingRecords from "../userInfoItems/training_records";
import leaveRecords from "../userInfoItems/leave_records";
import stuHanoverDetails from "../dialog/stu_hanover_details";
import { deepCopy } from "../../../src/utils/assist";

import basicInfo from "../../api/select/basicInfo";
import getEduBack from "../../api/select/getEduBack";
import salaryAnPay from "../../api/select/salaryAnPay";
import getTeaPersonalInfo from "../../api/select/getTeaPersonalInfo";
import getProvinces from "../../api/select/getProvinces";
import introductionAudit from "../userInfoItems/introduction_audit";
import probationPeriod from "../userInfoItems/probation_period";
import fullMemberManage from "../userInfoItems/full_member_manage";
import waitEntry from "../userInfoItems/wait_entry";
import teaMesAudit from "../dialog/tea_mes_audit";
import teaEntryAudit from "../dialog/tea_entry_audit";
import getTeaCerListService from "../../api/select/getTeaCerListService"; // 获取教师资格状态列表
import { getTeaCertificateList } from "../../api/select/getTeaCertificate";
import testInfo from "../../api/select/testInfo";
import getReserveRecords from "../../api/select/getReserveRecords";
import getInterviewRecords from "../../api/select/getInterviewRecords";
import getPhase from "../../api/select/getPhase";
import getSubject from "../../api/select/getSubject";
import getReviewList from "../../api/select/getReviewList";
import revokeLeaveApplication from "../../api/action/revokeLeaveApplication";
import getLeaveTeachers from "../../api/select/getLeaveTeachers";
import operateLog from "../../api/select/operateLog";
import newLeaveExport from "../../api/action/newLeaveExport";
import getTeacherSecretInfo from "../../api/select/getTeacherSecretInfo";

import historyRecordMixin from "./historyRecordMixin";
import operationRecordMix from "../userInfoItems/operation_record_mix";
import applicationRecordMixin from "./applicationRecordMixin";
import commonCascade from "../../api/select/commonCascade";

export default {
  mixins: [historyRecordMixin, applicationRecordMixin],
  data() {
    return {
      teaTypeOption: [],
      tableLoading: false,
      teaStatueSettingDialog: false,
      userDetailDialog: false,
      bu: "",
      auditEntryTeaId: "",
      auditEntryTeaName: "",
      teaEntryAuditSettingDialog: false,
      certificateId: "",
      certificateName: "",
      stuHanoverDetailsId: "",
      stuHanoverDetailsBu: "",
      stuHanoverDetailsSettingDialog: false,
      leaveCertificateSettingDialog: false,
      proData: [],
      basesubList: [],
      phaseList: [],
      selectTableText: "",
      selectName: [],
      table_data: [],
      auditData: [],
      table_data_total: 0,
      userDetailId: "",
      cipherTId: '', // 密文老师ID
      currentID: null,
      teaCerOptions: [], // 教师资格状态列表
      teaCheckState: null,
      userDetailName: "",
      userDetailMobile: "",
      userDetailData: {},
      eduBackData: {},
      previewDialog: false,
      previewData: {},
      salaryAnPaylData: {},
      teaPersonalInfoData: {},
      teaAuditSettingDialog: false,
      auditTeaId: "",
      userDetailTabNumber: "first", //个人信息弹出框tab索引
      userDetailDataPlus: [], //个人信息弹出框-笔试信息
      userDetailDataReserveRecords: [], //个人信息弹出框-预约记录
      userDetailDataHandsRecords: [], //个人信息糖醋狂-移交记录
      userDetailDataReviewRecords: [], //个人信息弹出框-面试记录
      userDetailDataTrainingRecords: [], //个人信息弹出框-培训记录
      userDetailDataLeavingRecords: [], //离职管理记录
      userIntroductionAuditRecords: [],
      userProbationPeriod: [],
      waitEntryData: [],
      fullMemberData: [],
      exportOptions: {},
      // 搜素字段
      search_data: {
        timeType: "",
        bu: "",
        state: "",
        content: "",
        socialSecurity: "",
        subjectCode: "",
        subject: "",
        gradeCode: "",
        grade: "",
        leaveType: "",
        certificateType: "", //教师资格证
        leaveReasonTypes: [], //离职原因
        isSendCer: "",
        startSubmitLeaveTime: "",
        endSubmitLeaveTime: "",
        pageNo: 1,
        pageSize: 10,
        teaReferKeywords: "",
        pageSize: 10,
        teaType: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      searchLeaveDateArea: [],
      teaLeaveReasonOptions: [], //离职原因 下拉选项
      teacherLeaveEndTime: null, // 老师上课最后时间，离职默认填充
    };
  },
  filters: {
    timeTypeFilters(val) {
      let text = "";
      let _val = val + "";
      switch (_val) {
        case "0":
          text = "兼职";
          break;
        case "1":
          text = "全职";
          break;
        case "2":
          text = "校招全职";
          break;
        case "3":
          text = "公校兼职";
          break;
        case "4":
          text = "学科班主任";
          break;
        default:
      }
      return text;
    },
    buFilter(val) {
      if (!val) return "";
      const teaBuObj = {
        1: "1对1",
        2: "少儿",
        3: "陪练",
        5: "优课",
      };
      return teaBuObj[val] || "";
    },
    teaStateFilter(val) {
      if (val == "6") {
        return "试用期";
      }
      if (val == "7") {
        return "转正期";
      }
      if (val == "8") {
        return "实习期";
      }
      return "";
    },
    hourFilter(val) {
      if (isNaN(val)) {
        return val;
      }
      if (val < 24) {
        return val + "小时";
      }
      let day = parseInt(val / 24);
      let hour = val % 24;

      return day + "天" + hour + "小时";
    },
    stateFilters(val) {
      if (val == "45") {
        return "离职待交接";
      }
      if (val == "46") {
        return "离职已交接";
      }
      return "";
    },
  },
  watch: {
    "search_data.subjectCode": function (val) {
      this.search_data.subject = this.getTextByCode(val, this.basesubList);
    },
    "search_data.gradeCode": function (val) {
      this.search_data.grade = this.getTextByCode(val, this.phaseList);
    },
    userDetailTabNumber(val) {
      switch (val) {
        case "first":
          this.selectTableText = "个人基本信息-基本信息";
          break;
        case "second":
          this.selectTableText = "个人基本信息-笔试信息";
          break;
        case "third":
          this.selectTableText = "个人基本信息-预约记录";
          break;
        case "four":
          this.selectTableText = "个人基本信息-移交记录";
          break;
        case "five":
          this.selectTableText = "个人基本信息-面试记录";
          break;
        case "six":
          this.selectTableText = "个人基本信息-培训记录";
          break;
        case "seven":
          this.selectTableText = "个人基本信息-入职记录";
          break;
        case "eight":
          this.selectTableText = "个人基本信息-个人介绍审核记录";
          break;
        case "nine":
          this.selectTableText = "个人基本信息-试用期管理记录";
          break;
        case "ten":
          this.selectTableText = "个人基本信息-转正管理记录";
          break;
        case "eleven":
          this.selectTableText = "个人基本信息-离职记录";
          break;
        case "twelve":
          this.selectTableText = "个人基本信息-实名记录";
          break;
        case "historyRecord":
          this.selectTableText = "个人基本信息-历史记录";
          break;
        case "operationRecordMix":
          this.selectTableText = "个人基本信息-操作记录";
          break;
        default:
      }
    },
  },
  methods: {
    getTeacherTypes() {
      this.teaTypeOption = [];
      commonCascade([{ dictCode: "TEACHER_TYPE" }]).then((data) => {
        this.teaTypeOption = [{ label: "全部", value: "" }, ...data.children];
      });
    },
    // 从后端获取教师资格状态列表
    getTeaCerList() {
      getTeaCertificateList({
        groupCode: "TEACHER_CERTIFICATE",
        bu: 1,
      })
        .then((res) => {
          if (res && res.length > 0) {
            let arr = res.map((item) => {
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode: item.groupCode,
              };
            });
            this.teaCerOptions = [
              ...[
                {
                  label: "全部",
                  value: "",
                },
              ],
              ...arr,
            ];
          }
        })
        .catch((message) => {
          this.$Message({
            message,
          });
        });
      //获取 离职原因 下拉项 字典
      getTeaCerListService([{ dictCode: "TEA_LEAVE_REASON" }])
        .then((data) => {
          this.teaLeaveReasonOptions = data.children;
        })
        .catch((message) => {
          this.$Message({
            message,
          });
        });
    },
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
    },
    // 选择报名范围
    chooseLeaveDate() {
      if (this.searchLeaveDateArea[0] == null) {
        this.search_data.startSubmitLeaveTime = "";
        this.search_data.endSubmitLeaveTime = "";
      } else {
        let sDate = new Date(this.searchLeaveDateArea[0]).getTime();
        let eDate = new Date(this.searchLeaveDateArea[1]).getTime();
        this.search_data.startSubmitLeaveTime =
          this.$DateTool.format(sDate, "yyyy-MM-dd") + " 00:00:00";
        this.search_data.endSubmitLeaveTime =
          this.$DateTool.format(eDate, "yyyy-MM-dd") + " 23:59:59";
      }
    },
    entryAudit(id, name) {
      this.auditEntryTeaId = id;
      this.auditEntryTeaName = name;
      this.teaEntryAuditSettingDialog = true;
    },
    confirmTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = "";
      this.auditEntryTeaName = "";
      this.teaEntryAuditSettingDialog = false;
    },
    getTextByCode(code, data) {
      let text = "";
      for (let i = 0; i < data.length; i++) {
        if (data[i].value == code) {
          text = data[i].label;
          break;
        }
      }
      return text;
    },
    initPhase() {
      this.search_data.applyGradeCode = "";
      this.phaseList = [];
      let parm = {};
      if (this.search_data.teaBu != "") {
        parm.bu = this.search_data.teaBu;
      }
      getPhase(parm).then((data) => {
        this.phaseList = data.children;
      });
    },
    cancelTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = "";
      this.auditEntryTeaName = "";
      this.teaEntryAuditSettingDialog = false;
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    initSubject() {
      this.search_data.applySubjectCode = "";
      this.basesubList = [];
      let parm = {};
      if (this.search_data.teaBu != "") {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm).then((data) => {
        this.basesubList = data.children;
      });
    },
    leaveSevenDay(val) {
      if (!val) {
        return false;
      }
      var now = new Date().getTime();
      var timeInter = now - parseInt(val);
      if (timeInter < 604800000) {
        return false;
      }
      return true;
    },
    leaveReasonTypeFun(val) {
      const _ = this.teaLeaveReasonOptions.find(
        (item) => item.value === "" + val
      ) || { label: "" };
      return _.label;
    },
    transformDate(val) {
      if (!val) {
        return "";
      }
      return this.$DateTransform(val);
    },
    transformEndDate(val) {
      if (!val) {
        return "";
      }
      let endDate = new Date(val);
      let hours = endDate.getHours(),
        minutes = endDate.getMinutes(),
        seconds = endDate.getSeconds();
      let _hours = "",
        _minutes = "",
        _seconds = "";
      hours < 10 ? (_hours = "0" + hours) : (_hours = "" + hours);
      minutes < 10 ? (_minutes = "0" + minutes) : (_minutes = "" + minutes);
      seconds < 10 ? (_seconds = "0" + seconds) : (_seconds = "" + seconds);

      return _hours + ":" + _minutes + ":" + _seconds;
    },
    getTeaSecret(e, teaID, type) {
      if (this.requestTeaSecretState) {
        this.$Message({
          message: "请等待上次查询完成",
        });
        return;
      }
      if (this.requestTeaSecretTime < 5) {
        this.$Message({
          message: "单次查询间隔为5秒钟",
        });
        return;
      }
      this.requestTeaSecretTime = 0;
      this.requestTeaSecretState = true;
      let elementList = document.querySelectorAll(".detailsBtn");
      for (let i = 0; i < elementList.length; i++) {
        elementList[i].innerText = "点击查看信息";
      }
      let parm = {
        teaId: teaID,
        infoType: type,
      };
      e.target.innerText = "正在查询...";
      getTeacherSecretInfo(parm)
        .then((data) => {
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
        .catch(() => {
          this.requestTeaSecretTime = 5;
          e.target.innerText = "信息不存在";
          this.requestTeaSecretState = false;
        });
    },
    confirmUserDetailDialog() {
      this.getTableData();
      this.closeUserDetailDialog();
    },
    getTableData() {
      this.tableLoading = true;
      getLeaveTeachers(this.search_data)
        .then((data) => {
          this.table_data = data.list;
          this.table_data_total = data.total;
          this.tableLoading = false;
        })
        .catch((message) => {
          this.$Message({
            message,
          });
        });
    },
    // 导出excel
    exportExcel() {
      newLeaveExport(this.exportOptions);
    },
    cancelStuHanoverDetailsSettingDialog() {
      this.stuHanoverDetailsSettingDialog = false;
    },
    openStuHanoverDetailsSettingDialog(teaId, bu) {
      this.stuHanoverDetailsId = teaId;
      this.stuHanoverDetailsBu = bu;
      this.stuHanoverDetailsSettingDialog = true;
    },
    confirmStuHanoverDetailsSettingDialog() {
      this.stuHanoverDetailsSettingDialog = false;
    },
    confirmleaveCertificateSettingDialog() {
      this.getTableData();
      this.certificateId = "";
      this.certificateName = "";
      this.leaveCertificateSettingDialog = false;
    },
    openleaveCertificateSettingDialog(teaID, teaName, lesEndTime) {
      this.certificateId = teaID;
      this.certificateName = teaName;
      this.leaveCertificateSettingDialog = true;
      this.teacherLeaveEndTime = lesEndTime;
    },
    cancelLeaveCertificateSettingDialog() {
      this.certificateId = "";
      this.certificateName = "";
      this.leaveCertificateSettingDialog = false;
    },
    cancelLeave(teaId, teaName) {
      let tip = `确定将该老师取消离职吗？取消离职后将恢复到原有模块，恢复排课状态`;
      if (!!teaName) {
        tip =
          "确定将" +
          teaName +
          "老师取消离职吗？取消离职后将恢复到原有模块，恢复排课状态";
      }
      this.$MessageBox
        .confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          let parm = {
            teaId: teaId,
          };
          revokeLeaveApplication(parm)
            .then(() => {
              this.getTableData();
            })
            .catch((message) => {
              this.$Message({
                message,
              });
            });
        });
    },
    getProData() {
      getProvinces()
        .then((data) => {
          this.proData = data;
        })
        .catch((message) => {
          this.$Message({
            message,
          });
        });
    },
    selectTable(val) {
      let ids = [];
      val.forEach((value) => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
    },
    buChnage() {
      this.initSubject();
      this.initPhase();
    },
    search() {
      this.exportOptions = deepCopy(this.search_data);
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailDialog = false;
      this.userDetailTabNumber = "first";
      this.userDetailData = {};
      this.eduBackData = {};
      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataReviewRecords = [];
      this.userDetailDataTrainingRecords = [];
      this.userDetailDataLeavingRecords = [];
      this.userIntroductionAuditRecords = [];
      this.userProbationPeriod = [];
      this.historyRecord = [];
      this.waitEntryData = [];
      this.fullMemberData = [];
    },
    // 用户详情tab键
    userDetailTab(tab) {
      if (tab.name === "first") {
        testInfo({ teacherId: this.userDetailId })
          .then((data) => {
            this.userDetailDataPlus = data;
          })
          .catch((message) => {
            this.$Message({
              message,
            });
          });
      }
      if (tab.name === "second") {
        getReserveRecords({ teacherId: this.userDetailId })
          .then((data) => {
            this.userDetailDataReserveRecords = data;
          })
          .catch((message) => {
            this.$Message({
              message,
            });
          });
      }
      if (tab.name === "four") {
        getInterviewRecords({ teaId: this.userDetailId })
          .then((data) => {
            this.userDetailDataReviewRecords = data;
          })
          .catch((message) => {
            this.$Message({
              message,
            });
          });
      }
      if (tab.name === "eight") {
        operateLog({ teaId: this.userDetailId })
          .then((data) => {
            this.userProbationPeriod = data;
          })
          .catch((message) => {
            this.$Message({
              message,
            });
          });
      }
      if (tab.name === "historyRecord") {
        this.handleGetTeacherHistoryRecord(this.userDetailId);
      }
      if (tab.name === "operationRecordMix") {
        this.$refs.operationRecordMix.getData(this.userDetailId);
      }
      if (tab.name === "applicationRecord") {
        this.$refs.applicationRecordRef.getRecruitLogsUsing(this.userDetailId);
      }
      // if(tab.index == 11) this.handleGetTeacherHistoryRecord(this.userDetailId)
    },
    confirmPreviewDialog(data) {
      this.previewData = data;
      this.previewDialog = true;
    },
    cancelPreviewDialog() {
      this.previewDialog = false;
    },
    //确定执行修改状态后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.getTableData();
    },
    //打开修改状态设置
    teaStatueSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: "请选择教师",
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.teaStatueSettingDialog = true;
    },
    //取消修改状态设置后
    cancelTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
    },
    // 点击用户名查看详情
    userDetail({teaId, name, mobile, teaBu, cipherTId}) {
      this.userDetailDialog = true;
      this.userDetailId = teaId;
      this.cipherTId=cipherTId;
      this.bu = teaBu;
      this.userDetailName = name;
      this.userDetailMobile = mobile;
      basicInfo({ teaId: cipherTId })
        .then((data) => {
          this.userDetailData = data;
        })
        .catch((message) => {
          this.$Message({
            message,
          });
        });
      getEduBack({ teaId })
        .then((_data) => {
          getSubject({ bu: teaBu })
            .then((data) => {
              this.eduBackData = _data;
              this.$refs.basicMessageEle.basesubject = data.children;
            })
            .catch(() => {
              this.$Message({
                message: "基础科目获取异常",
              });
              this.basesubjectlist = [];
            });
        })
        .catch((message) => {
          console.log("error:", message);
        });
      salaryAnPay({ teaId })
        .then((data) => {
          this.salaryAnPaylData = data;
        })
        .catch(() => {
          this.salaryAnPaylData = null;
        });
      getTeaPersonalInfo({ teaId })
        .then((data) => {
          this.teaPersonalInfoData = data;
        })
        .catch(() => {
          this.teaPersonalInfoData = null;
        });
    },
    confirmTeaAuditSettingDialog() {
      this.teaAuditSettingDialog = false;
      this.auditTeaId = "";
      //重新请求教师资料数据
      getTeaPersonalInfo({ teaId: this.userDetailId })
        .then((data) => {
          this.teaPersonalInfoData = data;
        })
        .catch((message) => {
          this.teaPersonalInfoData = null;
          console.log("error:", message);
        });
    },
    teaAudit(teaId, checkState) {
      this.auditTeaId = teaId;
      getReviewList({ teaId: teaId })
        .then((data) => {
          this.teaAuditSettingDialog = true;
          this.auditData = data;
          this.teaCheckState = checkState;
        })
        .catch(() => {
          this.teaAuditSettingDialog = true;
        });
    },
    cancelTeaAuditSettingDialog() {
      this.auditTeaId = "";
      this.teaAuditSettingDialog = false;
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
    compareDayThan(val, max) {
      if (!val) {
        return false;
      }
      var now = new Date().getTime();
      var timeInter = now - parseInt(val);
      if (timeInter < max * 24 * 3600000) {
        return false;
      }
      return true;
    },
    hasBtnSendLeavingCertificate(item) {
      if (item.teaPreviousState == "6") {
        if (item.state == 46 || item.applyHour / 24 > 7) {
          return true;
        }
      } else if (item.teaPreviousState == "7") {
        if (
          item.state == 46 ||
          item.applyHour / 24 > 15 ||
          (item.leaveType == "被动离职" && item.applyHour / 24 > 7)
        ) {
          return true;
        }
      }
      return false;
    },
    hasBtnCancelLeaving(item) {
      if (item.leaveType == "主动离职") {
        return true;
      }
      return false;
    },
  },
  computed: {
    permission: function () {
      return this.$store.getters.permission;
    },
  },
  created() {
    this.search_data.content = this.$route.query.keyWord || "";
    // 获取字典
    this.getTeaCerList();
  },
  mounted() {
    this.initSubject();
    this.initPhase();
    this.getProData();
    if (this.$store.getters.permission) {
      this.getTableData();
    }
    this.getTeacherTypes();
  },
  components: {
    "tea-statue-change": teaStatueChange,
    "leave-certificate": leaveCertificate,
    "basic-message": basicMessage,
    "order-record": orderRecord,
    "hand-over": handOver,
    "tea-mes-audit": teaMesAudit,
    "leave-records": leaveRecords,
    "written-record": writtenRecord,
    "interview-records": interviewRecords,
    "training-records": trainingRecords,
    "stu-hanover-details": stuHanoverDetails,
    "introduction-audit": introductionAudit,
    "probation-period": probationPeriod,
    "wait-entry": waitEntry,
    "full-member-manage": fullMemberManage,
    "tea-entry-audit": teaEntryAudit,
    "operation-record-mix": operationRecordMix,
  },
};
</script>
