<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="关键词">
        <el-input
          v-model="search_data.keyWord"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属BU">
        <el-select
          @change="buChnage"
          v-model="search_data.teaBu"
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
      <el-form-item label="第一擅长科目">
        <el-select v-model="search_data.teaGoodFirst" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in basesubList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型">
        <el-select v-model="search_data.contractType" placeholder="请选择">
          <el-option
            v-for="(item, i) of contractTypeOption"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="教师资格证">
        <el-select v-model="search_data.certificateType" placeholder="请选择">
          <el-option
            v-for="(item, index) in teaCerOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位类型">
        <el-select v-model="search_data.positionType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="坐班" value="1"></el-option>
          <el-option label="非坐班" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="职位状态">-->
      <!--<el-select v-model="search_data.positionResultType" placeholder="请选择">-->
      <!--<el-option label="全部" value=""></el-option>-->
      <!--<el-option label="试用期" value="6"></el-option>-->
      <!--<el-option label="转正期" value="7"></el-option>-->
      <!--<el-option label="实习期" value="8"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="老师档次">
        <el-select v-model="search_data.rank" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="普通" value="普通"></el-option>
          <el-option label="名师" value="名师"></el-option>
          <el-option label="VIP" value="VIP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排课状态">
        <el-select v-model="search_data.recommend" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="不建议排课" value="0"></el-option>
          <el-option label="建议排课" value="1"></el-option>
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

    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>

      <div class="table-head">
        <span class="table-title">共{{ table_data_total }}个老师</span>
        <el-button
          size="small"
          @click="exportExcel()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:regular:export')"
          >导出Excel</el-button
        >
        <el-button
          size="small"
          @click="downloadElectronicContract(newRegularControllerDownEcontract)"
          type="text"
          v-if="
            checkPermission('recruit:process:fulltime:regular:downEcontract')
          "
          >下载电子合同</el-button
        >
        <el-button
          size="small"
          type="text"
          @click="toPartTimeJobSetting()"
          v-if="
            checkPermission(
              'recruit:process:fulltime:regular:fulltimetopartime'
            )
          "
          >全职转兼职</el-button
        >
      </div>

      <el-table
        :data="table_data"
        @selection-change="selectTable"
        style="width:100%"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="姓名" width="120" fixed>
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="userDetail(scope.row)"
              >{{ scope.row.firstName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="email" align="center" label="邮箱" width="190">
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

        <el-table-column prop="teaBu" align="center" label="所属BU" width="180">
          <template scope="scope">
            {{ scope.row.teaBu | teaBuFilter }}
          </template>
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
          prop="teaGender"
          align="center"
          label="性别"
          width="120"
        >
        </el-table-column>
        <el-table-column align="center" label="工作性质" width="120">
          <template scope="scope">
            {{ scope.row.timeType | timeTypeFilters }}
          </template>
        </el-table-column>
        <el-table-column
          prop="hireTime"
          align="center"
          label="合同类型"
          width="220"
        >
          <template scope="{row = {}}">
            <el-button
              v-if="row.contractType === 2"
              size="small"
              @click="
                handlePreviewElectronicContract(
                  row.teaId,
                  newTryOutControllerGetEcontractInfo
                )
              "
              type="text"
              >{{ row.contractType | contractTypeFilter }}</el-button
            >
            <div v-else>{{ row.contractType | contractTypeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="certificateState"
          align="center"
          label="教师资格证"
          width="120"
        >
          <template scope="scope">
            {{ scope.row.certificateType | certificateTypeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="teaGoodFirst"
          align="center"
          label="第一科目"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="teaTaughtStuGrade"
          align="center"
          label="年级偏好"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="teaTaughtStuLevel"
          align="center"
          label="学生水平"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="teaEduStr"
          align="center"
          label="最高学历"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="school"
          align="center"
          label="所属学校"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="teaProv"
          align="center"
          label="高考所在地"
          width="130"
        >
        </el-table-column>
        <el-table-column prop="rank" align="center" label="档次" width="100">
        </el-table-column>
        <el-table-column
          prop="hireTime"
          align="center"
          label="入职时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="trunRegularTime"
          align="center"
          label="转正时间"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="lifeCycle" align="center" label="生命周期">
        </el-table-column>
        <el-table-column prop="recommendStr" align="center" label="排课状态">
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300">
          <template scope="scope">
            <el-button
              size="small"
              @click="
                dimissionSetting(
                  scope.row.teaId,
                  scope.row.firstName,
                  scope.row.teaBu,
                  scope.row.timeType
                )
              "
              type="text"
              >申请离职</el-button
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
    </div>
    <!--单个上传视频对话框-->
    <upload-single-vedio
      ref="uploadSingleVedio"
      @uploadSuccess="uploadSuccess"
    ></upload-single-vedio>

    <el-dialog
      :title="userDetailName"
      v-model="userDetailDialog"
      size="large"
      @close="closeUserDetailDialog"
    >
      <div class="order_dialog_header">
        <div
          @click="dimissionSetting(userDetailId, userDetailName, bu)"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>申请离职</span>
        </div>
        <div @click="inRecycleSetting(userDetailId)" class="add-reserve">
          <i class="el-icon-plus"></i>
          <span>跑单至回收站</span>
        </div>
        <!-- <div @click="courseSetting(userDetailId)" class="add-reserve" >
                    <i class="el-icon-plus"></i>
                    <span>排课设置</span>
                </div> -->
        <div @click="uploadSingleVedio(userDetailId)" class="add-reserve">
          <i class="el-icon-plus"></i>
          <span>上传个人介绍视频</span>
        </div>
      </div>
      <el-tabs
        v-model="userDetailTabNumber"
        @tab-click="userDetailTab"
        class="order_dialog_body rder_dialog_bodys"
      >
        <el-tab-pane label="基本信息/简历" name="first">
          <basic-message
            currentRoute="ent_list"
            ref="basicMessageEle"
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
          <operation-record-mix ref="operationRecordMix"></operation-record-mix>
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
    <!--回收站dialog-->
    <el-dialog
      :white="true"
      title="跑单至回收站"
      v-model="inRecycleSettingDialog"
      size="small"
      @close="cancelInRecycleSettingDialog"
    >
      <in-recycle
        :viewState="inRecycleSettingDialog"
        :currentID="currentID"
        @confirm="confirmInRecycleSettingDialog"
        @cancel="cancelInRecycleSettingDialog"
      ></in-recycle>
    </el-dialog>
    <!--排课设置dialog-->
    <el-dialog
      :white="true"
      title="排课设置"
      v-model="courseSettingDialog"
      size="small"
      @close="cancelCourseSettingDialog"
    >
      <course-plane-seeting
        type="3"
        :viewState="courseSettingDialog"
        :currentID="currentID"
        @confirm="confirmCourseSettingDialog"
        @cancel="cancelCourseSettingDialog"
      ></course-plane-seeting>
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
        type="3"
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
    <!--申请离职dialog-->
    <el-dialog
      :white="true"
      class="dialog-width-760"
      title="申请离职"
      v-model="dimissionSettingDialog"
      size="small"
      @close="cancelDimissionSettingDialog"
    >
      <dimission
        :viewState="dimissionSettingDialog"
        campName="转正营"
        :currentName="dimissionTeaName"
        :bu="dimissionTeaBu"
        :currentID="dimissionTeaId"
        :timeType="dimissionTimeType"
        @confirm="confirmDimissionSettingDialog"
        @cancel="cancelDimissionSettingDialog"
      ></dimission>
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
    <!--全职转兼职dialog-->
    <el-dialog
      :white="true"
      title="全职转兼职"
      v-model="toPartTimeJobSettingDialog"
      size="small"
      @close="toPartTimeJobClose"
    >
      <to-part-time-job
        :disType="'ent'"
        :viewState="toPartTimeJobSettingDialog"
        :currentName="dimissionTeaName"
        :bu="dimissionTeaBu"
        :currentID="dimissionTeaId"
        @confirm="confirmToPartTimeJobDialog"
        @cancel="toPartTimeJobClose"
      />
    </el-dialog>

    <!--查看合同-->
    <el-dialog
      :white="true"
      title="查看合同"
      v-model="electronicContractDialog"
      size="small"
      @close="cancelTeaEntryAuditSettingDialog"
    >
      <div class="contract_details__time">
        入职时间： {{ electronicContractDetails.hireTime }}
      </div>
      <div class="contract_details__time">
        签署时间： {{ electronicContractDetails.signTime }}
      </div>
      <el-tabs v-model="activeName" class="sign-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, i) in electronicContractDetails.econtractList"
          :key="i"
          :name="`first${i}`"
        >
          <span slot="label">
            <el-tooltip
              class="item"
              effect="dark"
              :disabled="item.contractName && item.contractName.length < 7"
              :content="item.contractName"
              placement="top"
            >
              <div
                style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 110px;"
              >
                {{ item.contractName }}
              </div>
            </el-tooltip>
          </span>
        </el-tab-pane>
      </el-tabs>
      <div style="min-height: 70vh;">
        <iframe
          v-if="iframePageUrl"
          class="contract_details__iframe"
          :src="iframePageUrl"
          frameborder="0"
        ></iframe>
      </div>
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
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import { deepCopy } from '../../../src/utils/assist';
import inRecycle from '../dialog/in_recycle';
import coursePlaneSeeting from '../dialog/course_plane_seeting';
import teaStatueChange from '../dialog/tea_statue_change';
import teaMesAudit from '../dialog/tea_mes_audit';
import teaEntryAudit from '../dialog/tea_entry_audit';
import dimission from '../dialog/dimission';
import waitEntry from '../userInfoItems/wait_entry';

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
import getProvinces from '../../api/select/getProvinces';
import testInfo from '../../api/select/testInfo';
import basicInfo from '../../api/select/basicInfo';
import getReserveRecords from '../../api/select/getReserveRecords';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import regularList from '../../api/select/regularList';
import salaryAnPay from '../../api/select/salaryAnPay';
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import getEduBack from '../../api/select/getEduBack';
import getReviewList from '../../api/select/getReviewList';
import operateLog from '../../api/select/operateLog';
import getSubject from '../../api/select/getSubject';
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';

import newRegularControllerExport from '../../api/action/newRegularControllerExport';
import resumePl from '../dialog/resume_pl';

import historyRecordMixin from './historyRecordMixin';
import toPartTimeJob from '../dialog/to_part_time_job';
import electronicContractMixin from './electronicContractMixin';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import uploadSingleVedioMixin from './uploadSingleVedioMixin';
import applicationRecordMixin from './applicationRecordMixin';
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';
import commonCascade from '../../api/select/commonCascade';
import getPhase from '../../api/select/getPhase';

export default {
  mixins: [
    historyRecordMixin,
    applicationRecordMixin,
    electronicContractMixin,
    uploadSingleVedioMixin,
  ],
  data() {
    return {
      teaTypeOption: [],
      phaseList: [], // 年级偏好
      teaCerOptions: [], // 教师资格状态列表
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      basesubjectlist: [],
      auditEntryTeaId: '',
      auditEntryTeaName: '',
      teaEntryAuditSettingDialog: false,
      dimissionTeaId: '',
      dimissionTeaBu: '',
      dimissionTeaName: '',
      dimissionTimeType: null,
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

      userIntroductionAuditRecords: [], //个人信息弹出框-个人介绍审核记录
      userProbationPeriod: [], //个人信息弹出框-试用期管理记录
      waitEntryData: [],
      fullMemberData: [], //个人信息弹出框-转正管理记录

      //对话框
      inRecycleSettingDialog: false, //回收站dialog
      courseSettingDialog: false, //排课设置dialog
      teaStatueSettingDialog: false, //修改状态dialog
      teaAuditSettingDialog: false, //修改状态dialog
      dimissionSettingDialog: false,
      previewDialog: false,
      exportOptions: {},
      basesubList: [],
      bu: '',
      // 搜素字段
      search_data: {
        gradeCode: '',
        teaBu: '',
        timeType: '',
        positionType: '', //number
        positionResultType: '',
        rank: '', //string
        recommend: '', //string
        keyWord: '', //string
        teaGoodFirst: '', //number
        contractType: '',
        certificateType: '',
        contractType: '',
        pageNo: 1, //number
        pageSize: 10, //number
        teaReferKeywords: '',
        teaType: '',
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
      //被选择的用户
      selectName: [],
      currentID: null,
      auditData: [],
      auditTeaId: '',
      previewData: {},
      teaCheckState: null,
      proData: [],
      selectList: [],
      toPartTimeJobSettingDialog: false,
      activeName: 'first0',
      iframePageUrl: '',
    };
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
  filters: {
    certificateTypeFilter(type) {
      switch (type) {
        case 0:
          return '未报考';
        case 8:
          return '已报考本学科考试';
        case 9:
          return '已通过本学科笔试';
        case 6:
          return '已持本学科考试合格证明';
        case 2:
          return '持本学科证';
        case 1:
          return '已报考';
        case 3:
          return '未持证';
        case 4:
          return '已持非本学科证';
        case 5:
          return '已持本学科证';
        case 7:
          return '已持非本学科考试合格证明';
        case 10:
          return '已报考非本学科考试';
        case 11:
          return '已通过非本学科笔试';
      }
    },
    timeTypeFilters(val) {
      let text = '';
      let _val = val + '';
      switch (_val) {
        case '0':
          text = '兼职';
          break;
        case '1':
          text = '全职';
          break;
        case '2':
          text = '校招全职';
          break;
        case '3':
          text = '公校兼职';
          break;
        case '4':
          text = '学科班主任';
          break;
        default:
      }
      return text;
    },
    recommendFilters(val) {
      if (val == 0) {
        return '不建议排课';
      }
      if (val == 1) {
        return '建议排课';
      }
      return '';
    },
    teaBuFilter(val) {
      if (!val) return '';
      const teaBuObj = {
        '1': '1对1',
        '2': '少儿',
        '3': '陪练',
        '5': '优课',
      };
      return teaBuObj[val] || '';
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
  methods: {
    getTeacherTypes() {
      this.teaTypeOption = [];
      commonCascade([{ dictCode: 'TEACHER_TYPE' }]).then(data => {
        this.teaTypeOption = [{ label: '全部', value: '' }, ...data.children];
      });
    },
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
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
          e.target.innerText = '信息不存在';
          this.requestTeaSecretTime = 5;
          this.requestTeaSecretState = false;
          this.$Message({
            message,
          });
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
    initSubject() {
      this.search_data.gradeCode = '';
      this.search_data.teaGoodFirst = '';
      this.basesubList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm)
        .then(data => {
          this.basesubList = data.children;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    buChnage() {
      this.initSubject();
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

      const [certificateType] = this.search_data.certificateType.split('');

      regularList({ ...this.search_data, certificateType })
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
    // 点击用户名查看详情
    userDetail({teaId, name, mobile, teaBu, cipherTId}) {
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
      this.waitEntryData = [];
      this.fullMemberData = [];
      this.historyRecord = [];

      this.userDetailDialog = false;
    },
    confirmUserDetailDialog() {
      this.getTableData();
      this.closeUserDetailDialog();
    },
    dimissionSetting(teaID, teaName, bu, timeType) {
      this.dimissionTeaId = teaID;
      this.dimissionTeaBu = bu;
      this.dimissionTeaName = teaName;
      this.dimissionTimeType = timeType;
      this.dimissionSettingDialog = true;
    },
    cancelDimissionSettingDialog() {
      this.dimissionTeaId = '';
      this.dimissionTeaName = '';
      this.dimissionTimeType = '';
      this.dimissionSettingDialog = false;
    },
    confirmDimissionSettingDialog() {
      this.getTableData();
      this.dimissionTeaId = '';
      this.dimissionTeaName = '';
      this.dimissionTimeType = '';
      this.dimissionSettingDialog = false;
    },
    // 用户详情tab键
    userDetailTab(tab) {
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
      //     getEntryRecordLogs({teaId:this.userDetailId}).then(data => {
      //         this.waitEntryData = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      // if (tab.name==="seven") {
      //     getReviewList({teaId:this.userDetailId}).then(data => {
      //         this.userIntroductionAuditRecords = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
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
      // if (tab.name==="nine") {
      //   //获取转正记录
      //     regularLogList({teaId:this.userDetailId}).then(data => {
      //         this.fullMemberData = data;
      //     }).catch(message => {
      //         this.$Message({
      //             message
      //         });
      //     });
      // }
      // if (tab.name==="ten") {
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
    },
    // 导出excel
    exportExcel() {
      newRegularControllerExport(this.exportOptions);
    },
    selectTable(val) {
      this.selectList = val;
      let ids = [];
      val.forEach(value => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
      this.selectTeachers = val;
    },
    //确定跑单至回收站后
    confirmInRecycleSettingDialog() {
      this.inRecycleSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //跑单至回收站设置
    inRecycleSetting(teacherId) {
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.inRecycleSettingDialog = true;
    },
    //取消跑单至回收站后
    cancelInRecycleSettingDialog() {
      this.inRecycleSettingDialog = false;
    },
    //确定排课设置后
    confirmCourseSettingDialog() {
      this.courseSettingDialog = false;
    },
    //排课设置
    courseSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.courseSettingDialog = true;
    },
    //取消排课设置后
    cancelCourseSettingDialog() {
      this.courseSettingDialog = false;
    },
    //确定修改状态后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //修改状态设置
    teaStatueSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
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
          console.log('error:', message);
        });
    },
    cancelTeaAuditSettingDialog() {
      this.auditTeaId = '';
      this.teaAuditSettingDialog = false;
    },
    confirmPreviewDialog(data) {
      this.previewData = data;
      this.previewDialog = true;
      this.$nextTick(() => {
        this.$refs.resumePl.getHeaderUrl(data.teaId);
      });
    },
    cancelPreviewDialog() {
      this.previewDialog = false;
    },
    toPartTimeJobClose() {
      this.dimissionTeaId = '';
      this.dimissionTeaName = '';
      this.toPartTimeJobSettingDialog = false;
    },
    confirmToPartTimeJobDialog() {
      this.dimissionTeaId = '';
      this.dimissionTeaName = '';
      this.toPartTimeJobSettingDialog = false;
      this.getTableData();
    },
    toPartTimeJobSetting() {
      if (this.selectName.length == 0) {
        this.$Message({ message: '请选择教师' });
        return;
      }
      let first = this.selectList[0];
      this.dimissionTeaId = first.teaId;
      this.dimissionTeaBu = first.teaBu;
      this.dimissionTeaName = first.firstName;
      this.toPartTimeJobSettingDialog = true;
    },
    uploadSuccess(list) {
      // 上传成功后获取个人介绍里面的视频字段赋值
      this.$refs.basicMessageEle.teaPersonalInfoData.teaVideoUrl =
        list[0].fileUrl;
    },
    // 从后端获取教师资格状态列表
    getTeaCerList() {
      getTeaCertificateList({
        groupCode: 'TEACHER_CERTIFICATE',
        bu: 1,
      })
        .then(res => {
          if (res && res.length > 0) {
            let arr = res.map(item => {
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode: item.groupCode,
              };
            });
            this.teaCerOptions = [
              ...[
                {
                  label: '全部',
                  value: '',
                },
              ],
              ...arr,
            ];
          }
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    handleClick() {
      this.iframePageUrl = '';
      setTimeout(() => {
        this.electronicContractDetails.econtractList.forEach((r, i) => {
          if (`first${i}` === this.activeName) {
            this.iframePageUrl = r.contractUrl || r.pageUrl || r.url;
          }
        });
      });
    },
    // 获取年级偏好
    queryPhase() {
      getPhase({})
        .then(data => {
          this.phaseList = data.children;
        })
        .catch(e => {
          console.log(`error: ${e}`);
        });
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
    this.initSubject();
    this.getProData();
    this.$on('search', function(val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/recy' });
    }
    // 获取教师资格状态列表
    this.getTeaCerList();
    this.getTeacherTypes();
    // 获取年级偏好
    this.queryPhase();
  },
  components: {
    dimission: dimission,
    'in-recycle': inRecycle,
    'course-plane-seeting': coursePlaneSeeting,
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
    'resume-pl': resumePl,
    'wait-entry': waitEntry,
    preview: require('../dialog/preview_new').default,
    'tea-entry-audit': teaEntryAudit,
    'to-part-time-job': toPartTimeJob,
    'operation-record-mix': operationRecordMix,
  },
};
</script>

<style scoped>
.detailsBtn {
  cursor: pointer;
}
</style>

<style lang="less">
.dialog-width-760 {
  .el-dialog {
    width: 760px !important;
  }
}
.sign-tabs {
  .el-tabs__item {
    padding: 0 30px 0 0;
    font-size: 16px;
    margin-bottom: -10px;
  }
}
.contract_details__iframe {
  width: 100%;
  height: 70vh;
}
</style>
