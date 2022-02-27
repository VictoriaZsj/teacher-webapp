<template>
  <div class="full-time-container_before_interview" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="关键字" v-if="selectedFormKeys.includes('keyWord')">
        <el-input
          v-model="search_data.keyWord"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属BU" v-if="selectedFormKeys.includes('teaBu')">
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
      <el-form-item label="工作性质" v-if="selectedFormKeys.includes('timeType')">
        <el-select v-model="search_data.timeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师状态" v-if="selectedFormKeys.includes('teacherState')">
        <el-select v-model="search_data.teacherState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待入库" value="3"></el-option>
          <el-option label="待Offer" value="30"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Offer状态" v-if="selectedFormKeys.includes('offerState')">
        <el-select v-model="search_data.offerState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="已发" value="1"></el-option>
          <el-option label="未发" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训主题" v-if="selectedFormKeys.includes('trainTheme')">
        <el-input
          v-model="search_data.trainTheme"
          placeholder="输入培训主题"
        ></el-input>
      </el-form-item>
      <el-form-item label="培训结果" v-if="selectedFormKeys.includes('trainResultType')">
        <el-select v-model="search_data.trainResultType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="未反馈" value="0"></el-option>
          <el-option label="培训通过" value="2"></el-option>
          <el-option label="培训不通过" value="3"></el-option>
          <el-option label="延期培训" value="4"></el-option>
          <el-option label="延期入职" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好" v-if="selectedFormKeys.includes('applyGradeCode')">
        <el-select v-model="search_data.applyGradeCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in phaseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第一擅长科目" v-if="selectedFormKeys.includes('applySubjectCode')">
        <el-select v-model="search_data.applySubjectCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in basesubList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资格证" v-if="selectedFormKeys.includes('certificateType')">
        <el-select v-model="search_data.certificateType" placeholder="请选择">
          <el-option
            v-for="(item, index) in teaCerOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="培训时间" v-if="selectedFormKeys.includes('startTrainTime')">
        <el-date-picker
          :editable="false"
          v-model="searchTrainDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseTrainDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="资料完善状态" v-if="selectedFormKeys.includes('infoState')">
        <el-select v-model="search_data.infoState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="定薪状态" v-if="selectedFormKeys.includes('fixedSalaryState')">
        <el-select
          v-model="search_data.fixedSalaryState"
          placeholder="请选择定薪状态"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="未定薪" value="0"></el-option>
          <el-option label="定薪待审核" :value="1"></el-option>
          <el-option label="已定薪" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跟进人" v-if="selectedFormKeys.includes('followPerson')">
        <el-input
          v-model="search_data.followPerson"
          placeholder="输入跟进人"
        ></el-input>
      </el-form-item>
      <!-- 学历 -->
      <el-form-item label="学历" v-if="selectedFormKeys.includes('teaEdu')">
        <el-select v-model="search_data.teaEdu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in teaEduList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院校等级" v-if="selectedFormKeys.includes('schoolLevel')">
        <el-select
          v-model="search_data.schoolLevel"
          placeholder="请选择"
          multiple
          collapse-tags
        >
          <el-option
            v-for="(item, index) in schoolLevelList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="师范院校" v-if="selectedFormKeys.includes('normalSchool')">
        <el-select v-model="search_data.normalSchool" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in normalSchoolList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师类型" v-if="selectedFormKeys.includes('teaType')">
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
      <el-form-item label="排课状态" v-if="selectedFormKeys.includes('recommendState')">
        <el-select v-model="search_data.recommendState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="建议排课" value="1"></el-option>
          <el-option label="不建议排课" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微信绑定状态" v-if="selectedFormKeys.includes('wxBindStatus')">
        <el-select v-model="search_data.wxBindStatus" placeholder="请选择">
          <el-option
            v-for="(item, index) in schoolLevelList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button
        class="search-button"
        icon="search"
        type="normal"
        size="small"
        @click="search('')"
      >查询</el-button>
      <el-button
        class="search-button"
        type="normal"
        size="small"
        @click="reset"
      >重置</el-button>
      <span class="setting-form" @click="openTransferForm">
        <i class="el-icon-setting"></i>
      </span>
    </el-form>
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <div class="table-head">
        <span class="table-title">共{{ table_data_total }}个老师</span>
        <el-button
          type="text"
          size="small"
          @click="exportExcel()"
          v-if="checkPermission('recruit:process:fulltime:train:export')"
          >导出Excel</el-button
        >
        <el-button type="text" size="small" @click="offerNoticesSetting()"
          >Offer通知</el-button
        >
        <el-button
          size="small"
          @click="handFollowUp()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:train:multiFollowUp')"
          >招师跟进</el-button
        >
        <el-button
          size="small"
          @click="batchCheckSalary()"
          type="text"
          :class="{ 'uncheck-point': unCheckedDataCount > 0 }"
          v-if="checkPermission('full_times:teacher:batchCheck')"
        >
          批量审核薪资
        </el-button>
      </div>
      <div class="table-wrap">
        <el-table
          :data="table_data"
          @sort-change="sortChange"
          :key="tableKey"
          @selection-change="selectTable"
          style="width: 100%"
        >
        <el-table-column
          sortable
          align="center"
          fixed
          width="100"
          >
            <template scope="prop">
              <div class="sort_titleImgBox" :class="{
                  'titleImgStatus0':prop.row.bindStatus==0,
                  'titleImgStatus1':prop.row.bindStatus==1,
                  'titleImgStatus2':prop.row.bindStatus==2}">
                    <img :src="prop.row.bindStatus==1||prop.row.bindStatus==2?color_companyWX:grey_companyWX" class="titleImg" />
                </div>
            </template>
           </el-table-column>
          <el-table-column align="center" fixed type="selection" width="30">
          </el-table-column>
          <el-table-column
            v-for="item in selectedTableList"
            :key="item.value"
            :prop="item.value"
            align="center"
            :label="item.text"
            :fixed="item.value === 'name'"
            min-width="120"
          >
            <!-- 姓名 -->
            <template scope="scope" v-if="item.value === 'name'">
              <el-button
                size="small"
                type="text"
                @click="openBasicMessageComp(scope.row)"
                >{{ scope.row.name }}</el-button
              >
            </template>
            <!-- 所属BU -->
            <template scope="scope" v-else-if="item.value === 'teaBu'">
              {{ scope.row.teaBu | teaBuFilter }}
            </template>
            <!-- 是否主课老师 -->
            <template scope="scope" v-else-if="item.value === 'majorTeacher' && search_data.teaBu == '3'">
              {{ scope.row.majorTeacher | majorTeacherFilter }}
            </template>
            <!-- 工作性质 -->
            <template scope="scope" v-else-if="item.value === 'timeType'">
              {{ scope.row.timeType | timeTypeFilter }}
            </template>
            <!-- 完善资料状态 -->
            <template scope="scope" v-else-if="item.value === 'infoState'">
              {{ scope.row.infoState | infoStateFilter }}
            </template>
            <!-- 教师资格证 -->
            <template scope="scope" v-else-if="item.value === 'certificateType'">
              {{ scope.row.certificateType | certificateTypeFilter }}
            </template>
            <!-- 手机号 -->
            <template scope="scope" v-else-if="item.value === 'mobile'">
              <el-button
                v-if="!scope.row.mobile"
                type="text"
                size="small"
                @click="getReferMobile(scope.row, 'mobile')"
                >点击查看信息</el-button
              >
              <span v-else>{{ scope.row.mobile }}</span>
            </template>
            <!-- 推荐人 -->
            <template scope="scope" v-else-if="item.value === 'teaReferMobile'">
              <el-button
                v-if="!scope.row.teaReferMobile"
                type="text"
                size="small"
                @click="getReferMobile(scope.row, 'teaReferMobile')"
                >点击查看信息</el-button
              >
              <span v-else>{{ scope.row.teaReferMobile }}</span>
            </template>
            <!-- 个人优势 -->
            <template scope="scope" v-else-if="item.value === 'personalAdvantage'">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.personalAdvantage">
                <span class="pop-txt" slot="reference">{{scope.row.personalAdvantage}}</span>
              </el-popover>
            </template>
          </el-table-column>
          <!-- <el-table-column
            v-if="search_data.teaBu == '3'"
            prop="majorTeacher"
            align="center"
            label="是否主课老师"
            width="180"
          >
          </el-table-column> -->
          <el-table-column align="center" label="操作" fixed="right" width="270">
            <template scope="scope">
              <el-button
                size="small"
                type="text"
                v-if="
                  checkPermission('recruit:process:fulltime:train:oneFollowUp')
                "
                @click="
                  handFollowUp(
                    scope.row.teaId,
                    scope.row.teacherStateStr,
                    scope.row.name,
                    scope.row.trainTime,
                    scope.row.trainResultTypeStr,
                    scope.row
                  )
                "
                >招师跟进</el-button
              >
              <el-button
                v-if="scope.row.teaBu != '3'"
                size="small"
                @click="
                  offerNoticesSetting(scope.row.teaId, scope.row.name, scope.row)
                "
                type="text"
                >Offer通知</el-button
              >
              <el-button
                v-if="scope.row.teaBu == '3'"
                size="small"
                @click="OfferNoticeBUSetting(scope.row.teaId)"
                type="text"
                >Offer通知</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="setting-table" @click="openTransferTable">
          <i class="el-icon-setting"></i>
        </div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search_data.pageNo"
        :page-sizes="[10, 20, 30, 40, 100, 500]"
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
      <div slot="title" style="display: inline-block" >
        <span
          slot="title"
          style="display: flex; align-items: center; width: 100%"
        >{{ userDetailName }}
          <span class="dia_title"></span>
          <div class="titleImgBox" :class="{
            'titleImgStatus0':titleImgStatus==0,
            'titleImgStatus1':titleImgStatus==1,
            'titleImgStatus2':titleImgStatus==2}"  @click="getWxBindDetail">
              <img :src="wxImg" class="titleImg" />
              <span v-if='titleImgStatus==0'>未绑定</span>
              <span v-if='titleImgStatus==1'>他人绑定</span>
              <span v-if='titleImgStatus==2'>{{titleImgName}}</span>
          </div>
        </span>
      </div>
      <div class="order_dialog_header">
        <div
          v-if="checkPermission('recruit:process:fulltime:train:oneFollowUp')"
          @click="userInfoFollowUp"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>招师跟进</span>
        </div>
        <div
          @click="offerNoticesSetting(userDetailId, userDetailName)"
          class="add-reserve"
        >
          <i class="el-icon-edit"></i>
          <span>Offer通知</span>
        </div>
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
            currentRoute="bef_int"
            ref="basicMessageEle"
            bef_int="bef_int"
            :name="userDetailName"
            :prodata="proData"
            :bu="bu"
            @preview="confirmPreviewDialog"
            @audit="teaAudit"
            @confirm="confirmUserDetailDialog()"
            @cancel="closeUserDetailDialog()"
            :currentID="currentTeaRow.teaId"
            :cipherTId="currentTeaRow.cipherTId"
            :viewState="userDetailDialog"
            :teaStatue="2"
            class="mg-20"
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
    <!--排课设置dialog-->
    <el-dialog
      :white="true"
      title="排课设置"
      v-model="courseSettingDialog"
      size="small"
      @close="cancelCourseSettingDialog"
    >
      <course-plane-seeting
        type="1"
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
        type="1"
        :viewState="teaStatueSettingDialog"
        :currentID="currentID"
        @confirm="confirmTeaStatueSettingDialog"
        @cancel="cancelTeaStatueSettingDialog"
      ></tea-statue-change>
    </el-dialog>
    <!--跑单dialog-->
    <el-dialog
      :white="true"
      title="跑单"
      v-model="operationsSettingDialog"
      size="small"
      @close="cancelOperationsSettingDialog"
    >
      <breach-of-train-contract
        :viewState="operationsSettingDialog"
        :currentID="currentID"
        @confirm="confirmOperationsSettingDialog"
        @cancel="cancelOperationsSettingDialog"
      ></breach-of-train-contract>
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
    <!--正式入职dialog-->
    <el-dialog
      :white="true"
      title="正式入职"
      v-model="formalEntrySettingDialog"
      size="small"
      @close="cancelFormalEntrySettingDialog"
    >
      <formal-entry
        :viewState="formalEntrySettingDialog"
        :currentID="currentID"
        @confirm="confirmFormalEntrySettingDialog"
        @cancel="cancelFormalEntrySettingDialog"
      ></formal-entry>
    </el-dialog>
    <!--offer通知dialog-->
    <el-dialog
      :white="true"
      class="fixWid900"
      title="offer通知"
      v-model="offerNoticeSettingDialog"
      size="small"
      @close="cancelOfferNoticeSettingDialog"
    >
      <offer-notice-dialog
        :viewState="offerNoticeSettingDialog"
        :currentID="currentID"
        @confirm="confirmOfferNoticeSettingDialog"
        @cancel="cancelOfferNoticeSettingDialog"
      ></offer-notice-dialog>
    </el-dialog>
    <!-- 跟进dialog -->
    <transition name="fade">
      <el-dialog
        custom-class="followUpDia"
        lock-scroll
        top="0"
        :fullscreen="true"
        :white="true"
        v-model="followUpDialog"
        size="large"
        @close="handleCancelFollowUpDialog"
      >
        <follow-up
          ref="followUp"
          @openBasicMessageComp="openBasicMessageComp"
          :interviewStateStr="interviewStateStr"
          :followName="followName"
          :salaryStatus="salaryStatus"
          :trainTimeProps="trainTimeProps"
          tabState="培训管理"
          :trainResultTypeStr="trainResultTypeStr"
          :currentID="currentTeaRow.teaId"
          :cipherTId="currentTeaRow.cipherTId"
          :bu="currentTeaRow.teaBu"
          @confirm="handleConfirmFollowUpDialog"
          @cancel="handleCancelFollowUpDialog"
        ></follow-up>
      </el-dialog>
    </transition>
    <!--offer通知 验证定薪状态dialog -->
    <div v-if="offerNoticeSalaryDialog">
      <el-dialog
        :white="true"
        :title="offerNoticeSalaryTitle"
        v-model="offerNoticeSalaryDialog"
        size="small"
        @close="cancelOfferNoticeSalary"
      >
        <offer-notice-salary-check
          :viewState="offerNoticeSalaryDialog"
          :currentID="currentID"
          :offerCheckType="offerCheckType"
          :hasUnCheckIn="hasUnCheckIn"
          :offerNoticeCheckData="offerNoticeCheckData"
          @confirm="confirmOfferNoticeSalary"
          @cancel="cancelOfferNoticeSalary"
        ></offer-notice-salary-check>
      </el-dialog>
    </div>
    <el-dialog
      title="老师&专员好友明细"
      v-model="bindInfoDialog"
      :modal="false"
      width="30%"
      class="bindInfoDialog"
    >
     <el-radio-group slot='title' v-model="tabVal" style="margin-bottom: 30px;">
          <el-radio-button label="left">绑定记录</el-radio-button>
          <el-radio-button label="right">老师&专员好友明细</el-radio-button>
        </el-radio-group>
      <el-table
       v-show="tabVal=='left'"
        :data="bindInfoData"
        border
        ref="bindInfoData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="externalNickName"
          label="绑定人（老师）"
        >
        </el-table-column>
        <el-table-column
          prop="externalUserID"
          align="center"
          label="外部联系人id"
          width="300px"
        >
        </el-table-column>
        <el-table-column prop="bindStatus" align="center" label="绑定状态">
          <template scope="prop">
            {{ prop.row.bindStatus == 1 ? '已绑定' : '未绑定' }}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" align="center" label="操作人">
        </el-table-column>
        <el-table-column prop="bindTime" align="center" label="操作时间">
          <template scope="prop">
            {{
              prop.row.bindTime
                ? $DateTool.format(prop.row.bindTime, 'yyyy-MM-dd HH:mm:ss')
                : ''
            }}
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="tabVal=='right'"
        :data="friendInfoData"
        border
        ref="friendInfoData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="commissionerName"
          label="专员姓名"
        >
        </el-table-column>
        <el-table-column
          prop="friendAddTime"
          align="center"
          label="加好友时间"
          width="300px"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <!--预览dialog-->
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
    <!-- 配置表单项 -->
    <el-transfer-form
      ref="transferForm"
      :titleArr="[
        '自定义筛选条件',
        '选择显示筛选条件（最多可选择20个）',
        '已选中筛选条件暂不支持排序',
      ]"
      :leftList="allFormList"
      :rightList="selectedFormList"
      :disabledArr="['keyWord']"
      :maxNum="20"
      :showAll="false"
      @save="saveTableList($event, 'form')"
    ></el-transfer-form>
    <!-- 配置列表项 -->
    <el-transfer-form
      ref="transferTable"
      :titleArr="[
        '表单自定义',
        '选择显示字段',
        '已选中字段，拖动选中标签可排序',
      ]"
      :leftList="allTableList"
      :rightList="selectedTableList"
      :disabledArr="['name']"
      @save="saveTableList($event, 'table')"
    ></el-transfer-form>
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import { deepCopy } from '../../../src/utils/assist';
import coursePlaneSeeting from '../dialog/course_plane_seeting';
import teaStatueChange from '../dialog/tea_statue_change';
import breachOfTrainContract from '../dialog/breach_of_train_contract';
import offerNotice from '../../api/action/offerNotice';
import offerNotices from '../../api/action/offerNotices';
import teaMesAudit from '../dialog/tea_mes_audit';
import formalEntry from '../dialog/formal_entry';
import offerNoticeDialog from '../dialog/offer_notice';
import basicMessage from '../userInfoItems/basic_message';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
import handOver from '../userInfoItems/hand_over';
import trainingRecords from '../userInfoItems/training_records';
import interviewRecords from '../userInfoItems/interview_records';
import basicInfo from '../../api/select/basicInfo';
import testInfo from '../../api/select/testInfo';
import getReserveRecords from '../../api/select/getReserveRecords';
import getTransferRecords from '../../api/select/getTransferRecords';
import getPhase from '../../api/select/getPhase';
import getTrainingRecords from '../../api/select/getTrainingRecords';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getTrainTeachers from '../../api/select/getTrainTeachers';
import batchSignContract from '../../api/action/batchSignContract';
import oneSignContract from '../../api/action/oneSignContract';
import salaryAnPay from '../../api/select/salaryAnPay';
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import getEduBack from '../../api/select/getEduBack';
import getReviewList from '../../api/select/getReviewList';
import getProvinces from '../../api/select/getProvinces';
import getSubject from '../../api/select/getSubject';
import { querydDictService } from '../../api/dict';
import newTrainControllerExport from '../../api/action/newTrainControllerExport';
import resumePl from '../dialog/resume_pl';
import getTeaCerListService from '../../api/select/getTeaCerListService'; // 获取教师资格状态列表
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';
import historyRecordMixin from './historyRecordMixin';
import followUp from '../dialog/followUp';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import uploadSingleVedioMixin from './uploadSingleVedioMixin';
import applicationRecordMixin from './applicationRecordMixin';
import offerNoticeSalaryCheck from './components/offerNoticeSalaryCheck'; // offer通知，校验定薪状态弹窗
import getTobeFixedSalaryCount from '../../api/select/getTobeFixedSalaryCount'; // 获取培训管理查询待审核定薪数
import getSalaryStatus from '../../api/select/getSalaryStatus'; // 实时获取定薪状态
import fetch from '../../../src/utils/fetch';
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';
import getSchoolLevel from '../../api/select/getSchoolLevel'; // 获取手机号
import commonCascade from '../../api/select/commonCascade';
import grey_companyWX from '../../../src/images/grey_companyWX.png';
import color_companyWX from '../../../src/images/color_companyWX.png';
import {
  getHeaderTableList,
  getTeaHeaderTable,
  saveTeaHeaderTable,
} from '../../api/select/getTransformList';
import {
  default_training_form_list,
  default_training_table_list
} from './formConfig.js';

export default {
  mixins: [historyRecordMixin, applicationRecordMixin, uploadSingleVedioMixin],
  data() {
    return {
       titleImgStatus:null,
      titleImgName:'',
      tabVal:'left',
      tableKey: 0.1,
      allFormList: [],
      allTableList: [],
      selectedFormList: [],
      selectedFormKeys: [],
      selectedTableList: [],
      bindInfoDialog: false,
      friendInfoData:[],
      bindInfoData: [],
      grey_companyWX,
      color_companyWX,
      wxImg: null,
      wx_band_stateList: [
        { value: null, label: '全部' },
        { value: 2, label: '未绑定' },
        { value: 1, label: '已绑定' },
      ],
      currentTeaRow: {},
      trainResultTypeStr: '',
      teaCerList: [],
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      teaCerOptions: [], // 教师资格状态列表
      token: '',
      testUrl: '',
      basesubjectlist: [],
      searchTrainDateArea: [],
      basesubList: [],
      phaseList: [],
      normalSchoolList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      schoolLevelList: [
        '985',
        '211',
        '一本',
        '二本A',
        '二本B',
        '三本',
        '专科',
        '其他',
      ],
      hasUnCheckIn: '', // 批量未入库标识
      offerCheckType: '', // offer通知判断是单个，还是批量
      unCheckedDataCount: 0, // 批量审核薪资，有待审核薪资时显示小圆点
      offerNoticeSalaryTitle: '', // offer通知，校验定薪状态弹窗title
      offerNoticeSalaryDialog: false, // offer通知，校验定薪状态弹窗显示flg
      offerNoticeCheckData: [], // offer通知，校验定薪状态数据list
      noticeTeacherId: '', // offer通知，老师id
      noticeTeacherName: '', // offer通知，老师名称
      userDetailDialog: false, // 个人信息弹出框控制
      userDetailTabNumber: 'first', //个人信息弹出框tab索引
      userDetailId: '', //个人信息弹出框用户ID
      userDetailName: '', //个人信息弹出框用户名
      userDetailMobile: '', //个人信息弹出框用户手机号
      userDetailData: {}, //个人信息弹出框-基本信息
      salaryAnPaylData: {},
      eduBackData: {}, //教育背景
      teaPersonalInfoData: {},
      userDetailDataPlus: [], //个人信息弹出框-笔试信息
      userDetailDataReserveRecords: [], //个人信息弹出框-预约记录
      userDetailDataHandsRecords: [], //个人信息糖醋狂-移交记录
      userDetailDataReviewRecords: [], //个人信息弹出框-面试记录
      userDetailDataTrainingRecords: [], //个人信息弹出框-培训记录
      exportOptions: {},
      bu: '',
      // 搜素字段
      search_data: {
        wxBindStatus: null,
        teaBu: '',
        teaEdu: '',
        trainResultType: '', //string
        offerState: '', //string
        timeType: '', //string
        recommendState: '', //string
        teacherState: '', //string
        infoState: '', //string
        keyWord: '',
        startTrainTime: '', //培训开始时间	string	可选: 格式: yyyy-MM-dd HH:mm:ss
        endTrainTime: '',
        trainTheme: '', //培训主题	string	可选:
        applyGradeCode: '', //字典年级	number	可选:
        applySubjectCode: '', //字典科目	number	可选:
        followPerson: '', //跟进人
        certificateType: '',
        pageNo: 1, //number
        pageSize: 10, //number
        fixedSalaryState: '',
        schoolLevel: [],
        normalSchool: '',
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
      origin_table_data:[],
      table_data_total: 0,
      selectTableText: '个人基本信息-基本信息',
      //对话框
      courseSettingDialog: false,
      operationsSettingDialog: false,
      teaStatueSettingDialog: false,
      formalEntrySettingDialog: false,
      offerNoticeSettingDialog: false,
      teaAuditSettingDialog: false, //修改状态dialog
      previewDialog: false,
      selectName: [],
      currentID: null,
      batchSignState: false,
      operationsState: false,
      auditData: [],
      auditTeaId: '',
      previewData: {},
      teaCheckState: null,
      proData: [],
      followUpDialog: false, // 招师跟进dialog
      interviewStateStr: '',
      interviewStateStrArray: [],
      followName: '',
      salaryStatus: '',
      trainTimeProps: '',
      userDetailInterviewStateStr: '',
      userDetailTrainTime: '',
      teaEduList: [], // 学历列表
      teaTypeOption: [], // 老师类型
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
          this.selectTableText = '个人基本信息-实名记录';
          break;
        case 'eleven':
          this.selectTableText = '个人基本信息-离职记录';
          break;
        case 'twelve':
          this.selectTableText = '个人基本信息-回收站记录';
          break;
        case 'historyRecord':
          this.selectTableText = '个人基本信息-历史记录';
          break;
        default:
        case 'operationRecordMix':
          this.selectTableText = '个人基本信息-操作记录';
          break;
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
    infoStateFilter(val) {
      if (val == '1') {
        return '是';
      }
      if (val == '0') {
        return '否';
      }
      return '';
    },
    teaBuFilter(val) {
      if (!val) return '';
      const teaBuObj = {
        1: '1对1',
        2: '少儿',
        3: '陪练',
        5: '优课',
      };
      return teaBuObj[val] || '';
    },
    timeTypeFilter(val) {
      if (!val) return '';
      if (val === '1') {
        return '全职';
      }
      if (val === '2') {
        return '校招全职'
      }
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
    sortChange(obj,eee) {
     
       let ascData=(a, b)=> {
        return a.bindStatus - b.bindStatus
        }
         let descData=(a, b)=> {
        return b.bindStatus - a.bindStatus
        }
         if(obj.order=='ascending'){
           this.table_data.sort(ascData)
         }else if(obj.order=='descending'){
            this.table_data.sort(descData)
         }else{
           this.table_data=this.origin_table_data.slice(0)
         }

    },
    // 重置表单
    reset() {
      this.search_data = {
        wxBindStatus: null,
        teaBu: '',
        teaEdu: '',
        trainResultType: '', //string
        offerState: '', //string
        timeType: '', //string
        recommendState: '', //string
        teacherState: '', //string
        infoState: '', //string
        keyWord: '',
        startTrainTime: '', //培训开始时间	string	可选: 格式: yyyy-MM-dd HH:mm:ss
        endTrainTime: '',
        trainTheme: '', //培训主题	string	可选:
        applyGradeCode: '', //字典年级	number	可选:
        applySubjectCode: '', //字典科目	number	可选:
        followPerson: '', //跟进人
        certificateType: '',
        pageNo: 1, //number
        pageSize: 10, //number
        fixedSalaryState: '',
        schoolLevel: [],
        normalSchool: '',
        teaType: '',
      }
    },
    openBasicMessageComp(row) {
      this.followUpDialog = false;
      if (row) {
        this.currentTeaRow = row;
      }
        this.userDetail();

    },
    // 获取手机号信息
    getReferMobile(row, type) {
      getTeacherSecretInfo({
        teaId: row.teaId,
        infoType: type === 'mobile' ? 'mobile' : 'referMobile',
      })
        .then(data => {
          row[type] = data;
        })
        .catch(message => {
          row.teaReferMobile = '消息不存在';
          this.$Message({
            message,
          });
        });
    },
    // 批量审核薪资
    batchCheckSalary() {
      let batchCheckSalaryUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        '/teacher/#/full_times/batchCheckBefInt?originPage=' +
        'bef_int';
      window.open(batchCheckSalaryUrl);
    },
    // 关闭offer通知，校验薪资弹窗
    cancelOfferNoticeSalary() {
      this.offerNoticeSalaryDialog = false;
    },
    // offer通知，校验薪资弹窗 提交
    confirmOfferNoticeSalary() {},
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
    },
    uploadSuccess(list) {
      // 上传成功后获取个人介绍里面的视频字段赋值
      this.$refs.basicMessageEle.teaPersonalInfoData.teaVideoUrl =
        list[0].fileUrl;
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
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    buChnage() {
      this.initPhase();
      this.initSubject();
    },
    initPhase() {
      this.search_data.applyGradeCode = '';
      this.phaseList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getPhase(parm)
        .then((data) => {
          this.phaseList = data.children;
        })
        .catch((message) => {
          console.log(message);
        });
    },
    initSubject() {
      this.search_data.applySubjectCode = '';
      this.basesubList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm)
        .then((data) => {
          this.basesubList = data.children;
        })
        .catch((message) => {
          console.log(message);
        });
    },
    async initTeaEdu() {
      const {data: {data: {children}}} = await querydDictService([{
        dictCode: "TEACHER_DEGREE"
      }]);
      this.teaEduList = children || [];
    },
    // 表单设置
    openTransferForm() {
      this.$refs.transferForm.dialogVisible = true;
    },
    // 列表设置
    openTransferTable() {
      this.$refs.transferTable.dialogVisible = true;
    },
    // 自定义表单，列表
    initTableList() {
      const params = {
        type: 'training',
      };
      Promise.all([
        getHeaderTableList(params),
        getTeaHeaderTable(params),
      ]).then((values) => {
        const [all, filter] = values;
        if (all.code === "0" && all.data) {
          const list = all.data;
          list.forEach(item => {
            Array.isArray(item.headerGroups) && item.headerGroups.forEach(child => {
              child.checked = false;
              Array.isArray(child.nodeList) && child.nodeList.forEach(node => {
                node.checked = false;
              })
            })
            const list = item.headerType === 'form' ? 'allFormList' : 'allTableList';
            this[list] = item.headerGroups || [];
          });
        }
        if (filter.code === '0' && filter.data && filter.data.headerTableList) {
          filter.data.headerTableList.forEach(item => {
            const list = item.opType === 'form'
                        ? 'selectedFormList'
                        : 'selectedTableList';
            this[list] = JSON.parse(item.headerConfig)
          });
        }
        if (!this.selectedFormList.length) this.selectedFormList = default_training_form_list;
        if (!this.selectedTableList.length) this.selectedTableList = default_training_table_list;
        // 设定筛选项list
        this.selectedFormKeys = [];
        this.selectedFormList.forEach(item => {
          this.selectedFormKeys.push(item.value);
        });
        // 更新列表
        this.tableKey = Math.random();
      });
    },
    async saveTableList(data, opType) {
      const params = {
        config: JSON.stringify(data),
        opType,
        type: 'training',
      };
      const refName = opType === 'form' ? 'transferForm' : 'transferTable';
      await saveTeaHeaderTable(params);
      this.$refs[refName].dialogVisible = false;
      this.$message.success('设置成功');
      this.initTableList();
    },
    // 选择报名范围
    chooseTrainDate() {
      if (this.searchTrainDateArea[0] == null) {
        this.search_data.startTrainTime = '';
        this.search_data.endTrainTime = '';
      } else {
        let sDate = new Date(this.searchTrainDateArea[0]).getTime();
        let eDate = new Date(this.searchTrainDateArea[1]).getTime();
        this.search_data.startTrainTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endTrainTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    // 获取表单数据
    getTableData() {
      !!this.$parent.getOverview ? this.$parent.getOverview() : null; //更新tab数据
      this.tableLoading = true;

      // const [certificateType, certificateType] = this.search_data.certificateType.split('')
      const [certificateType] = this.search_data.certificateType.split('');

      getTrainTeachers({ ...this.search_data, certificateType })
        .then((data) => {
          this.table_data = data.list;
          this.origin_table_data=this.table_data.slice(0);
          this.table_data_total = data.total;
          this.tableLoading = false;
        })
        .catch((message) => {
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
    selectTable(val) {
      this.offerNoticeCheckData = val;
      let ids = [];
      val.forEach((value) => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
    },
    // 查询
    search() {
      this.exportOptions = deepCopy(this.search_data);
      this.search_data.pageNo = 1;
      this.getTableData();
    },
    // 资料卡中招师跟进
    userInfoFollowUp() {
      this.handFollowUp(
        this.userDetailId,
        this.userDetailInterviewStateStr,
        this.userDetailName,
        this.userDetailTrainTime
      );
    },
    getWxBindDetail(userDetailId) {
      if (this.wxImg == color_companyWX) {
        this.bindInfoDialog = true;
        this.$Fetch({
          url: '/api/bind/bindInfo',
          method: 'get',
          params: {
            teaId: this.userDetailId,
          },
        }).then((res) => {
          if (res && res.code === '0') {
            this.bindInfoData = [{ ...res.data }];
            console.log('bindInfo:', res.data);
          }
        });

        this.$Fetch({
          url: '/api/bind/friendInfo',
          method: 'get',
          params: {
            teaId: this.userDetailId,
          },
        }).then(res => {
          if (res && res.code === '0') {
            this.friendInfoData = res.data ;
          }
        });
      }
      
    },
    getWX_compang_img(id) {
      this.$Fetch({
        url: '/api/bind/bindStatus',
        method: 'get',
        params: {
          teaId: id,
        },
      }).then((res) => {
        if (res && res.code === '0') {
          this.titleImgStatus=res.data.bindStatus;
          this.titleImgName=res.data.commissionerName;
          if(res.data.bindStatus==1||res.data.bindStatus==2){
            this.wxImg=color_companyWX
          }else{
            this.wxImg=grey_companyWX
          }
        }
      });
    },
    // 点击用户名查看详情
    userDetail() {
      const {teaId, name, mobile, teaBu, interviewStateStr, trainTime, cipherTId} = this.currentTeaRow;
      this.userDetailDialog = true;
      this.userDetailId = teaId;
      this.bu = teaBu;
      this.userDetailName = name;
      this.userDetailMobile = mobile;
      this.userDetailInterviewStateStr = interviewStateStr;
      this.userDetailTrainTime = trainTime;
      this.getWX_compang_img(teaId);
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
        .catch((message) => {
          console.log('error:', message);
        });
      salaryAnPay({ teaId: id })
        .then((data) => {
          this.salaryAnPaylData = data;
        })
        .catch((message) => {
          this.salaryAnPaylData = null;
        });
      getTeaPersonalInfo({ teaId: id })
        .then((data) => {
          this.teaPersonalInfoData = data;
        })
        .catch((message) => {
          this.teaPersonalInfoData = null;
        });
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.$refs.basicMessageEle.viewVedioDialog = false;
      this.userDetailDialog = false;
      this.userDetailTabNumber = 'first';
      this.userDetailData = {};
      this.salaryAnPaylData = {};
      this.eduBackData = {};
      this.teaPersonalInfoData = {};
      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataTrainingRecords = [];
      this.userDetailDataReviewRecords = [];
      this.historyRecord = [];
    },
    confirmUserDetailDialog() {
      this.getTableData();
      this.closeUserDetailDialog();
    },
    confirmOfferNoticeSettingDialog() {
      this.offerNoticeSettingDialog = false;
    },
    OfferNoticeBUSetting(id) {
      this.currentID = id;
      this.offerNoticeSettingDialog = true;
    },
    cancelOfferNoticeSettingDialog() {
      this.offerNoticeSettingDialog = false;
    },
    // 用户详情tab键
    userDetailTab(tab) {
      if (tab.name === 'first') {
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
      if (tab.name === 'second') {
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
      if (tab.name === 'four') {
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
      newTrainControllerExport(this.exportOptions);
    },
    // 执行offer通知操作
    startOfferNotice(allMatch) {
      if (!!this.noticeTeacherId) {
        offerNotice({ teaId: this.noticeTeacherId })
          .then((data, message) => {
            this.$Message({
              message: !!message ? message : 'offer通知成功',
            });
            this.operationsState = false;
          })
          .catch((message) => {
            this.$Message({
              message,
            });
            this.operationsState = false;
          });
      } else {
        offerNotices({ teaIds: this.selectName })
          .then((data, message) => {
            // 定薪状态都满足，不弹出offer失败弹出
            if (allMatch) {
              this.$Message({
                message: !!message ? message : 'offer通知成功',
              });
            } else {
              // 部分成功，部分失败
              this.offerNoticeSalaryDialog = true;
              this.offerNoticeSalaryTitle = '部分老师发offer失败';
              this.offerNoticeCheckData = this.offerNoticeCheckData;
              this.offerCheckType = '批量';
            }
            this.operationsState = false;
          })
          .catch((message) => {
            this.offerNoticeSalaryDialog = true;
            this.offerNoticeSalaryTitle = '部分老师发offer失败';
            this.offerNoticeCheckData = this.offerNoticeCheckData;
            this.offerCheckType = '批量';
            let match = false;
            for (let i = 0; i < this.offerNoticeCheckData.length; i++) {
              if (this.offerNoticeCheckData[i].fixedSalaryState == 2) {
                match = true;
                break;
              }
            }
            if (match) {
              this.hasUnCheckIn = '批量未入库'; // 此时有老师未入库，需在定薪校验弹窗中给出提醒
            }
            this.operationsState = false;
          });
      }
    },
    // 只处理少儿，陪练的offer通知逻辑
    buChildTrainNotice(teacherId, teacherName, row) {
      if (!!teacherId) {
        this.$MessageBox
          .confirm(`确定要给${teacherName}老师发offer邮件吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            offerNotice({ teaId: teacherId })
              .then((data, message) => {
                this.$Message({
                  message: !!message ? message : '操作成功',
                });
                this.operationsState = false;
              })
              .catch((message) => {
                this.$Message({
                  message,
                });
                this.operationsState = false;
              });
          })
          .catch((message) => {
            this.operationsState = false;
          });
      } else {
        this.$MessageBox
          .confirm(`确定要给这些老师发offer邮件吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            offerNotices({ teaIds: this.selectName })
              .then((data, message) => {
                this.$Message({
                  message: !!message ? message : '操作成功',
                });
                this.operationsState = false;
              })
              .catch((message) => {
                this.$Message({
                  message,
                });
                this.operationsState = false;
              });
          })
          .catch((message) => {
            this.operationsState = false;
          });
      }
    },
    //Offer通知，打开验证弹窗
    offerNoticesSetting(teacherId, teacherName, row) {
      // 注意添加settimeout 阻止重复点击
      if (this.operationsState) {
        return;
      }
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      if (this.selectName.length != 0) {
        //判断是否存在bu老师
        if (this.isIncludePeilian(this.selectName)) {
          this.$Message({
            message:
              '当前选择的老师包含陪练BU,不支持批量Offer通知流程,请分开操作',
          });
          return;
        }
      }
      this.operationsState = true;
      this.noticeTeacherId = teacherId;
      this.noticeTeacherName = teacherName;
      if (!!teacherId) {
        // 单个老师offer通知
        if (row.teaBu != 1) {
          // 只处理少儿，陪练的offer通知逻辑
          this.buChildTrainNotice(teacherId, teacherName, row);
        } else {
          this.$MessageBox
            .confirm(
              `确定要给${this.noticeTeacherName}老师发offer邮件吗？`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }
            )
            .then(() => {
              // 定薪状态=已定薪 时，校验通过，可以发offer
              getSalaryStatus({
                teaIds: [row.teaId],
              })
                .then((res) => {
                  let curFixedSalaryState = res[0].fixedSalaryState;
                  if (curFixedSalaryState == 2) {
                    this.startOfferNotice(); // 状态符合条件，执行offer通知操作
                  } else {
                    // 定薪状态=未定薪/定薪待审核 时  不可发offer，弹窗提示
                    this.offerNoticeSalaryDialog = true;
                    this.offerNoticeSalaryTitle = '发offer失败';
                    this.offerNoticeCheckData = [row];
                    this.offerCheckType = '单个';
                    this.operationsState = false;
                  }
                })
                .catch((message) => {
                  this.$Message({
                    message,
                  });
                });
            });
        }
      } else {
        // 批量老师offer通知
        let oneFlg = false;
        for (let p = 0; p < this.offerNoticeCheckData.length; p++) {
          if (this.offerNoticeCheckData[p].teaBu == 1) {
            oneFlg = true;
          }
        }
        // 只处理少儿，陪练的offer通知逻辑
        if (!oneFlg) {
          this.buChildTrainNotice(teacherId, teacherName, row);
        } else {
          this.$MessageBox
            .confirm(`确定要给这些老师发offer邮件吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              let enableCount = 0;
              for (let i = 0; i < this.offerNoticeCheckData.length; i++) {
                if (this.offerNoticeCheckData[i].fixedSalaryState == 2) {
                  enableCount++;
                }
              }
              let tmp = JSON.parse(JSON.stringify(this.offerNoticeCheckData));
              this.offerNoticeCheckData = [];
              for (let i = 0; i < tmp.length; i++) {
                if (tmp[i].teaBu == 1) {
                  this.offerNoticeCheckData.push(tmp[i]);
                }
              }
              if (enableCount == 0) {
                // 定薪状态都不满足
                this.offerNoticeSalaryDialog = true;
                this.offerNoticeSalaryTitle = '部分老师发offer失败';

                this.offerCheckType = '批量';
                this.operationsState = false;
              } else {
                let allMatch = false;
                if (enableCount == this.selectName.length) {
                  allMatch = true;
                }
                this.startOfferNotice(allMatch); // 状态符合条件，执行offer通知操作
              }
            })
            .catch((message) => {
              this.operationsState = false;
            });
        }
      }
    },
    // 招师跟进
    handFollowUp(
      teacherId,
      interviewStateStr,
      name,
      trainTime,
      trainResultTypeStr,
      row
    ) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          type: 'warning',
          message: '请选择教师',
        });
        return;
      }
      if (row) {
        this.currentTeaRow = row;
      }
      this.interviewStateStr = !!interviewStateStr
        ? interviewStateStr
        : '批量操作';
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.followName = name;
      // this.salaryStatus=row.salaryStatus ;
      this.trainTimeProps = trainTime ? trainTime : '';
      this.followUpDialog = true;
      this.trainResultTypeStr = trainResultTypeStr;
      this.$nextTick(() => {
        if (this.interviewStateStr !== '批量操作')
          this.$refs.followUp.getLogs();
        this.$refs.followUp.getSelectList();
      });
    },
    handleCancelFollowUpDialog() {
      this.followUpDialog = false;
      this.$refs.followUp.handleReset();
    },
    handleConfirmFollowUpDialog() {
      this.followUpDialog = false;
      this.getTableData();
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
    //取消排课设置弹出框后
    cancelCourseSettingDialog() {
      this.courseSettingDialog = false;
    },
    //确定跑单后
    confirmOperationsSettingDialog() {
      this.operationsSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //跑单
    operationsSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.operationsSettingDialog = true;
    },
    //取消跑单弹出框后
    cancelOperationsSettingDialog() {
      this.operationsSettingDialog = false;
    },
    //确定修改状态后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //修改状态
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
    isIncludePeilian(data) {
      let include = false;
      for (let i = 0; i < data.length; i++) {
        let item = this.getTeaDataById(data[i]);
        if (!!item && item.teaBu == '3') {
          include = true;
        }
      }
      return include;
    },
    getTeaDataById(id) {
      let data = null;
      for (let i = 0; i < this.table_data.length; i++) {
        if (this.table_data[i].teaId == id) {
          data = this.table_data[i];
          break;
        }
      }
      return data;
    },
    //取消修改状态弹出框后
    cancelTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
    },
    //执行签定合同
    batchSignSetting(teacherId, teacherName) {
      if (this.batchSignState) {
        return;
      }
      if (this.selectName.length != 0) {
        //判断是否存在bu老师
        if (this.isIncludePeilian(this.selectName)) {
          let message =
            '当前选择的老师包含陪练BU，不支持批量签合同流程，请重新操作！';
          if (this.selectName.length == 1) {
            message = '陪练类型的教师不支持签合同操作';
          }
          this.$Message({
            message: message,
          });
          return;
        }
      }
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      let text;
      if (!!teacherId) {
        text = `确定要给${teacherName}老师签合同吗？`;
      } else {
        text = `确定要给这些老师签合同吗？`;
      }
      this.$MessageBox
        .confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.batchSignState = true;
          if (!!teacherId) {
            oneSignContract({ teaId: teacherId })
              .then((data) => {
                this.batchSignState = false;
                this.userDetailDialog = false;
                this.$Message({
                  message: '操作成功',
                });
                this.getTableData();
              })
              .catch((message) => {
                this.$Message({
                  message,
                });
                this.batchSignState = false;
              });
          } else {
            batchSignContract({ teaIds: [].concat(this.selectName) })
              .then((data) => {
                this.$Message({
                  message: '操作成功',
                });
                this.batchSignState = false;
                this.getTableData();
              })
              .catch((message) => {
                this.$Message({
                  message,
                });
                this.batchSignState = false;
              });
          }
        });
    },
    confirmTeaAuditSettingDialog() {
      this.teaAuditSettingDialog = false;
      this.auditTeaId = '';
      //重新请求教师资料数据
      getTeaPersonalInfo({ teaId: this.userDetailId })
        .then((data) => {
          this.teaPersonalInfoData = data;
        })
        .catch((message) => {
          this.teaPersonalInfoData = null;
        });
    },
    cancelFormalEntrySettingDialog() {
      this.currentID = '';
      this.formalEntrySettingDialog = false;
    },
    formalEntrySettingDialogSetting(id) {
      this.currentID = id;
      this.formalEntrySettingDialog = true;
    },
    confirmFormalEntrySettingDialog() {
      this.currentID = '';
      this.formalEntrySettingDialog = false;
      this.getTableData();
    },
    teaAudit(teaId, checkState) {
      this.auditTeaId = teaId;
      getReviewList({ teaId: teaId })
        .then((data) => {
          this.teaAuditSettingDialog = true;
          this.auditData = data;
          this.teaCheckState = checkState;
        })
        .catch((message) => {
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
      this.$nextTick(() => {
        this.$refs.resumePl.getHeaderUrl(data.teaId);
      });
    },
    cancelPreviewDialog() {
      this.previewDialog = false;
    },
    // 培训管理-查询待审核定薪数
    getTobeFixedSalaryData() {
      getTobeFixedSalaryCount({ type: 'bef_int' })
        .then((data) => {
          this.unCheckedDataCount = data || 0;
        })
        .catch((message) => {
          // this.$Message({
          //     message: message
          // });
        });
    },
    // 从后端获取教师资格状态列表
    getTeaCerList() {
      getTeaCertificateList({
        groupCode: 'TEACHER_CERTIFICATE',
        bu: 1,
      })
        .then((res) => {
          if (res && res.length > 0) {
            this.teaCerList = res;
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
                  label: '全部',
                  value: '',
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
    },
    getTeacherTypes() {
      this.teaTypeOption = [];
      commonCascade([{ dictCode: 'TEACHER_TYPE' }]).then((data) => {
        this.teaTypeOption = [{ label: '全部', value: '' }, ...data.children];
      });
    },
  },
  computed: {
    permission: function () {
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
    this.initPhase();
    this.initSubject();
    this.initTeaEdu();
    this.initTableList();
    this.$on('search', function (val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/pre_ent' });
    }
    // 获取教师资格状态列表
    this.getTeaCerList();
    // 培训管理-查询待审核定薪数
    this.getTobeFixedSalaryData();
    this.getTeacherTypes();
  },
  components: {
    'course-plane-seeting': coursePlaneSeeting,
    'tea-statue-change': teaStatueChange,
    'breach-of-train-contract': breachOfTrainContract,
    'basic-message': basicMessage,
    'tea-mes-audit': teaMesAudit,
    'order-record': orderRecord,
    'hand-over': handOver,
    'written-record': writtenRecord,
    'training-records': trainingRecords,
    'interview-records': interviewRecords,
    preview: require('../dialog/preview_new').default,
    'resume-pl': resumePl,
    'formal-entry': formalEntry,
    'offer-notice-dialog': offerNoticeDialog,
    followUp,
    offerNoticeSalaryCheck, // offer通知，校验定薪状态弹窗
    'operation-record-mix': operationRecordMix,
  },
};
</script>

<style lang="less">
.bindInfoDialog {
  .el-dialog__body {
    background: #fff;
  }
}
.full-time-container_before_interview {
  .table-wrap {
    position: relative;
    .setting-table {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99;
      width: 0;
      height: 0;
      border-top: 30px solid #409EFF;
      border-left: 33px solid transparent;
      cursor: pointer;
      .el-icon-setting {
        position: absolute;
        top: -26px;
        right: 3px;
        color: #fff;
      }
    }
    .pop-txt {
      display: inline-block;
      width: 90px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .titleImgBox{
    cursor: pointer;
    display: flex;
    flex-flow: column;
    width: 60px;
    height: 50px;
    margin-left: 10px;
    justify-content: center;
    border-radius: 5px;
    align-items: center;
   
  }
  .sort_titleImgBox{
    display: flex;
    flex-flow: column;
    width: 40px;
    height: 35px;
    margin-left: 10px;
    justify-content: center;
    border-radius: 5px;
    align-items: center;
  }
  .titleImgStatus0{
       background: #eee;
    };
    .titleImgStatus2{
       background: #d4eafd;
    color: #0878d8;
    };
    .titleImgStatus1{
       background:#fdf0d4;
    color: #e8a01c;
    }
  .titleImg {
    display: inline-block;
    width: 25px;
    height: auto;
  }
  .followUpDia {
    top: 0;
    width: 80%;
    left: 20%;
    height: 100%;
    bottom: 0;
    overflow: scroll;
    right: 0;
    margin-bottom: 0;
    transform: none;
    .el-dialog__header {
      border-bottom: 0;
    }
  }
}
.uncheck-point {
  position: relative;
}
.uncheck-point:after {
  position: absolute;
  top: 1px;
  right: -4px;
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: red;
}
.detailsBtn {
  color: #007fff;
  cursor: pointer;
}
.search-button {
  margin: 9px;
}
.setting-form {
  cursor: pointer;
  color: #409EFF;
}
</style>
