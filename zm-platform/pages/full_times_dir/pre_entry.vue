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
        <el-select v-model="search_data.teaBu" placeholder="请选择">
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
      <el-form-item label="入职时间">
        <el-date-picker
          :editable="false"
          v-model="hireTime"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseHireDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="入职周数">
        <el-select v-model="search_data.readyWeeks" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="第一周" value="1"></el-option>
          <el-option label="第二周" value="2"></el-option>
          <el-option label="第三周" value="3"></el-option>
          <el-option label="第四周" value="4"></el-option>
          <el-option label="第五周" value="5"></el-option>
          <el-option label="第六周" value="6"></el-option>
          <el-option label="第七周" value="7"></el-option>
          <el-option label="第八周" value="8"></el-option>
          <el-option label="第九周" value="9"></el-option>
          <el-option label="第十周" value="10"></el-option>
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
      <el-form-item label="培训时间">
        <el-date-picker
          :editable="false"
          v-model="searchDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="学历">
        <el-select v-model="search_data.teaEdu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="本科" value="本科"></el-option>
          <el-option label="硕士" value="硕士"></el-option>
          <el-option label="博士及以上" value="博士"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习形式">
        <el-select v-model="search_data.isFullTime" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in styleClassOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测评课转化率(%)>=">
        <el-input
          v-model="search_data.conversionRate"
          placeholder="输入测评课转化率"
        ></el-input>
      </el-form-item>
      <el-form-item label="课时量">
        <el-input
          v-model="search_data.lesCount"
          placeholder="输入课时量"
        ></el-input>
      </el-form-item>
      <el-form-item label="正式生数">
        <el-input
          v-model="search_data.regularStuCount"
          placeholder="输入正式生数"
        ></el-input>
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
          v-if="checkPermission('recruit:process:fulltime:tryOut:export')"
          >导出Excel</el-button
        >
        <!-- <el-button size="small" @click="courseSetting()" type="text" >排课设置</el-button> -->
        <el-button size="small" @click="fullMemberSetting()" type="text"
          >添加转正结果</el-button
        >
        <!-- <el-button size="small" @click="teaStatueSetting()" type="text" v-if="checkPermission('recruit:process:fulltime:tryOut:modifyState')">修改状态</el-button> -->
        <el-button
          size="small"
          @click="downloadElectronicContract(newTryOutControllerDownEcontract)"
          type="text"
          v-if="
            checkPermission('recruit:process:fulltime:tryOut:downEcontract')
          "
          >下载电子合同</el-button
        >
        <el-button
          size="small"
          type="text"
          @click="toPartTimeJobSetting()"
          v-if="
            checkPermission('recruit:process:fulltime:tryOut:fulltimetopartime')
          "
          >全职转兼职</el-button
        >
        <!-- <el-button size="small" @click="handFollowUp()" type="text" v-if="checkPermission('recruit:process:fulltime:tryOut:multiFollowUp')">招师跟进</el-button> -->
        <el-button
          size="small"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:tryOut:pact')"
          @click="multiResignEcontract(0)"
          >重签合同</el-button
        >
      </div>

      <el-table
        :data="table_data"
        @selection-change="selectTable"
        style="width: 100%"
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
          prop="trainingTime"
          align="center"
          label="培训时间"
          width="220"
        >
        </el-table-column>
        <el-table-column
          prop="hireTime"
          align="center"
          label="入职时间"
          width="220"
        >
          <template scope="scope">
            {{ scope.row.hireTime | hireTimeFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="readyWeeks"
          align="center"
          label="入职周数"
          width="130"
        >
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
          prop="testLesCount"
          align="center"
          label="测评课数"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="regularStuCount"
          align="center"
          label="正式生数"
          width="190"
        >
        </el-table-column>
        <el-table-column
          prop="conversionRate"
          align="center"
          label="测评课转化率(%)"
          width="100"
        >
          <template scope="scope">
            {{ translatePercent(scope.row.conversionRate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lesCount"
          align="center"
          label="课时量"
          width="100"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          min-width="250"
        >
          <template scope="scope">
            <el-button
              size="small"
              v-if="
                scope.row.contractType == 2 && scope.row.econtractState == 6
              "
              @click="
                handlePreviewElectronicContract(
                  scope.row.teaId,
                  newTryOutControllerGetEcontractInfo,
                  'edit',
                  getTobeEcontract
                )
              "
              type="text"
              >审核合同</el-button
            >
            <el-button
              size="small"
              type="text"
              v-if="
                checkPermission('recruit:process:fulltime:tryOut:oneFollowUp')
              "
              @click="
                handFollowUp(
                  scope.row.teaId,
                  scope.row.stateStr,
                  scope.row.firstName
                )
              "
              >招师跟进</el-button
            >
            <!-- <el-button size="small" @click="courseSetting(scope.row.teaId)" type="text">排课设置</el-button> -->
            <el-button
              size="small"
              @click="fullMemberSetting(scope.row.teaId)"
              type="text"
              >添加转正结果</el-button
            >
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
            <!-- <el-button size="small" @click="inRecycleSetting(scope.row.teaId)" type="text">跑单至回收站</el-button> -->
          </template>
        </el-table-column>
      </el-table>

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
      <div class="order_dialog_header">
        <!-- <div @click="inRecycleSetting(userDetailId)" class="add-reserve" >
                    <i class="el-icon-edit"></i>
                    <span>跑单至回收站</span>
                </div> -->
        <div
          v-if="checkPermission('recruit:process:fulltime:tryOut:oneFollowUp')"
          @click="userInfoFollowUp"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>招师跟进</span>
        </div>
        <div @click="fullMemberSetting(userDetailId)" class="add-reserve">
          <i class="el-icon-edit"></i>
          <span>添加转正结果</span>
        </div>
        <!-- <div @click="courseSetting(userDetailId)" class="add-reserve" >
                    <i class="el-icon-plus"></i>
                    <span>排课设置</span>
                </div> -->
        <div
          @click="dimissionSetting(userDetailId, userDetailName, bu, timeType)"
          class="add-reserve"
        >
          <i class="el-icon-edit"></i>
          <span>申请离职</span>
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
            currentRoute="pre_ent"
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
            :teaStatue="3"
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
    <!--转正dialog-->
    <el-dialog
      :white="true"
      title="添加转正结果"
      v-model="fullMemberSettingDialog"
      size="small"
      @close="cancelFullMemberSettingDialog"
    >
      <full-member
        :viewState="fullMemberSettingDialog"
        :currentID="currentID"
        @confirm="confirmFullMemberSettingDialog"
        @cancel="cancelFullMemberSettingDialog"
      ></full-member>
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
        type="2"
        :viewState="teaStatueSettingDialog"
        :currentID="currentID"
        @confirm="confirmTeaStatueSettingDialog"
        @cancel="cancelTeaStatueSettingDialog"
      ></tea-statue-change>
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
        type="2"
        :viewState="courseSettingDialog"
        :currentID="currentID"
        @confirm="confirmCourseSettingDialog"
        @cancel="cancelCourseSettingDialog"
      ></course-plane-seeting>
    </el-dialog>
    <!--跑单至回收站dialog-->
    <el-dialog
      :white="true"
      title="跑单至回收站"
      v-model="inRecycleSettingDialog"
      size="small"
      @close="cancelInRecycleSettingDialog"
    >
      <breach-of-preentry-contract
        :viewState="inRecycleSettingDialog"
        :currentID="currentID"
        @confirm="confirmInRecycleSettingDialog"
        @cancel="cancelInRecycleSettingDialog"
      ></breach-of-preentry-contract>
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
        campName="新兵营"
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
        :viewState="toPartTimeJobSettingDialog"
        :currentName="dimissionTeaName"
        :bu="dimissionTeaBu"
        :currentID="dimissionTeaId"
        @confirm="confirmToPartTimeJobDialog"
        @cancel="toPartTimeJobClose"
      />
    </el-dialog>

    <!--签电子合同dialog-->
    <el-dialog
      :white="true"
      title="签电子合同"
      v-model="toPartTimePactDialog"
      size="small"
      @close="toPartTimePactClose"
    >
      <div>
        <div class="content">
          <el-row>
            <el-col :span="4">入职时间</el-col>
            <el-col :span="20">
              <el-date-picker v-model="pactForm.time" placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">备注</el-col>
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="2"
                v-model="pactForm.remark"
                placeholder="请输入备注"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="control">
          <el-button @click="toPartTimePactClose">取消</el-button>
          <el-button @click="multiResignEcontract(1)" type="primary"
            >确定</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!--查看合同-->
    <el-dialog
      :white="true"
      title="查看合同"
      top="1vh"
      v-model="electronicContractDialog"
      size="small"
      @close="cancelTeaEntryAuditSettingDialog"
    >
      <div v-if="!multiResignEcontractStatus" class="contract_details__time">
        入职时间： {{ electronicContractDetails.hireTime }}
      </div>
      <div v-if="!multiResignEcontractStatus" class="contract_details__time">
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
                style="
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 110px;
                "
              >
                {{ item.contractName }}
              </div>
            </el-tooltip>
          </span>
          <!-- <iframe class="contract_details__iframe" :src="item.contractUrl || item.pageUrl || item.url" frameborder="0"></iframe> -->
        </el-tab-pane>
      </el-tabs>
      <div style="min-height: 70vh">
        <iframe
          v-if="iframePageUrl"
          class="contract_details__iframe"
          :src="iframePageUrl"
          frameborder="0"
        ></iframe>
      </div>
      <el-form
        v-if="multiResignEcontractStatus && ruleForm.result != 2"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
      >
        <div style="font-size: 14px; font-weight: 600; margin: 20px 0 10px 0">
          审核结果
        </div>
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="ruleForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form
        v-if="multiResignEcontractStatus && ruleForm.result == 2"
        :model="ruleForm"
        :rules="rulesCopy"
        ref="ruleFormCopy"
        label-width="80px"
      >
        <div style="font-size: 14px; font-weight: 600; margin: 20px 0 10px 0">
          审核结果
        </div>
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="ruleForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="拒绝原因："
          label-width="90px"
          style="margin-top: 20px"
          prop="remark"
        >
          <el-input
            type="textarea"
            :rows="3"
            v-model="ruleForm.remark"
            placeholder="请输入拒绝原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-if="multiResignEcontractStatus" class="control">
        <el-button
          @click="
            tryOutAuditContract(
              ruleForm.result == 2 ? 'ruleFormCopy' : 'ruleForm',
              'cancel'
            )
          "
          >取消</el-button
        >
        <el-button
          @click="
            tryOutAuditContract(
              ruleForm.result == 2 ? 'ruleFormCopy' : 'ruleForm'
            )
          "
          type="primary"
          >确定</el-button
        >
      </div>
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
          :interviewStateStr="interviewStateStr"
          :followName="followName"
          :trainTimeProps="trainTimeProps"
          tabState="试用期管理"
          :currentID="currentID"
          :cipherTId="cipherTId"
          @confirm="handleConfirmFollowUpDialog"
          @cancel="handleCancelFollowUpDialog"
        ></follow-up>
      </el-dialog>
    </transition>

    <!-- 批量发送合同结果弹框 -->
    <el-dialog
      :white="true"
      title="批量发合同结果"
      v-model="sendContractResultsVisible"
      width="500px"
    >
      <send-contract-results
        :send_results_info="sendResultsInfo"
        :type="2"
        v-if="sendContractResultsVisible"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSendContractResultsModalHandle"
          >关闭</el-button
        >
      </span>
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
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import { deepCopy } from '../../../src/utils/assist';
import fullMember from '../dialog/full_member';
import coursePlaneSeeting from '../dialog/course_plane_seeting';
import teaStatueChange from '../dialog/tea_statue_change';
import dimission from '../dialog/dimission';

import breachOfPreentryContract from '../dialog/breach_of_preentry_contract';
import teaMesAudit from '../dialog/tea_mes_audit';
import teaEntryAudit from '../dialog/tea_entry_audit';

import resumePl from '../dialog/resume_pl';
import getProvinces from '../../api/select/getProvinces';
import basicMessage from '../userInfoItems/basic_message';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
import handOver from '../userInfoItems/hand_over';
import trainingRecords from '../userInfoItems/training_records';
import interviewRecords from '../userInfoItems/interview_records';
import introductionAudit from '../userInfoItems/introduction_audit';
import probationPeriod from '../userInfoItems/probation_period';
import waitEntry from '../userInfoItems/wait_entry';

import testInfo from '../../api/select/testInfo';
import getReserveRecords from '../../api/select/getReserveRecords';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getTeachersOfEntry from '../../api/select/getTeachersOfEntry';
import operateLog from '../../api/select/operateLog';

import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import getReviewList from '../../api/select/getReviewList';
import basicInfo from '../../api/select/basicInfo';
import getEduBack from '../../api/select/getEduBack';
import getSubject from '../../api/select/getSubject';
import salaryAnPay from '../../api/select/salaryAnPay';
import identifyRecords from '../userInfoItems/identify_records';
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';

import newTryOutControllerExport from '../../api/action/newTryOutControllerExport';

import historyRecordMixin from './historyRecordMixin';
import toPartTimeJob from '../dialog/to_part_time_job';

import electronicContractMixin from './electronicContractMixin';
import followUp from '../dialog/followUp';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import uploadSingleVedioMixin from './uploadSingleVedioMixin';
import applicationRecordMixin from './applicationRecordMixin';
import fetch from '../../../src/utils/fetch';
import commonCascade from '../../api/select/commonCascade';

// 批量发合同结果弹框
import SendContractResults from '../dialog/send_contract_results';

export default {
  mixins: [
    historyRecordMixin,
    electronicContractMixin,
    applicationRecordMixin,
    uploadSingleVedioMixin
  ],
  data() {
    return {
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      teaTypeOption: [],
      teaCerOptions: [], // 教师资格状态列表
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
      cipherTId: '', // 老师密文ID
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

      exportOptions: {},
      bu: '',
      //对话框

      fullMemberSettingDialog: false, //转正dialog
      teaStatueSettingDialog: false, //修改状态dialog
      inRecycleSettingDialog: false, //跑单设置
      courseSettingDialog: false, //排课设置dialog
      dimissionSettingDialog: false,
      teaAuditSettingDialog: false,
      previewDialog: false,
      hireTime: [null, null],
      // 搜素字段
      search_data: {
        regularStuCount: '',
        teaBu: '',
        readyWeeks: '', //string
        lesCount: '', //string
        conversionRate: '', //string
        startTrainingTime: '', //string
        endTrainingTime: '', //string
        keyWord: '', //string
        pageNo: 1, //number
        pageSize: 10, //number
        startHireTime: '', // (string) 开始入职时间
        endHireTime: '', // (string) 结束入职时间
        certificateType: '',
        contractType: '',
        teaEdu: '',
        isFullTime: '',
        teaType: '',
        teaReferKeywords: ''
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
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      // 初始table数据
      table_data: [],
      tableLoading: true,
      table_data_total: 0,
      selectTableText: '个人基本信息-基本信息',
      //被选择的用户
      selectName: [],
      auditData: [],
      auditTeaId: '',
      currentID: null,
      previewData: {},
      teaCheckState: null,
      proData: [],
      selectList: [],
      toPartTimeJobSettingDialog: false,
      followUpDialog: false, // 招师跟进dialog
      interviewStateStr: '',
      interviewStateStrArray: [],
      followName: '',
      trainTimeProps: '',
      userDetailInterviewStateStr: '',
      userDetailTrainTime: '',
      toPartTimePactDialog: false,
      pactForm: {
        time: '',
        remark: ''
      },
      ruleForm: {
        result: '',
        remark: ''
      },
      rules: {
        result: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      },
      rulesCopy: {
        result: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入拒绝原因', trigger: 'change' }
        ]
      },
      pactTeaId: '',
      multiResignEcontractStatus: false,
      styleClassOption: [],
      activeName: 'first0',
      iframePageUrl: '',
      sendContractResultsVisible: false, // 批量发送合同结果弹框
      sendResultsInfo: {
        failCount: 0,
        failedTeachers: [],
        successCount: 0
      }
    };
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
    teaBuFilter(val) {
      if (!val) return '';
      const teaBuObj = {
        1: '1对1',
        2: '少儿',
        3: '陪练',
        5: '优课'
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
    hireTimeFilter(val) {
      return window.dateTransform(val);
    }
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
        case 'operationRecordMix':
          this.selectTableText = '个人基本信息-操作记录';
          break;
        default:
          break;
      }
    }
  },
  methods: {
    closeSendContractResultsModalHandle() {
      this.sendContractResultsVisible = false;
    },
    getTeacherTypes() {
      this.teaTypeOption = [];
      commonCascade([{ dictCode: 'TEACHER_TYPE' }]).then((data) => {
        this.teaTypeOption = [{ label: '全部', value: '' }, ...data.children];
      });
    },
    getTeaSecret(e, teaID, type) {
      if (this.requestTeaSecretState) {
        this.$Message({
          message: '请等待上次查询完成'
        });
        return;
      }
      if (this.requestTeaSecretTime < 5) {
        this.$Message({
          message: '单次查询间隔为5秒钟'
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
        infoType: type
      };
      e.target.innerText = '正在查询...';
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
        .catch((message) => {
          e.target.innerText = '信息不存在';
          this.requestTeaSecretTime = 5;
          this.requestTeaSecretState = false;
          this.$Message({
            message
          });
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
    getProData() {
      getProvinces()
        .then((data) => {
          this.proData = data;
        })
        .catch((message) => {
          this.$Message({
            message
          });
        });
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    translatePercent(val) {
      if (isNaN(val)) {
        return val;
      }
      return (val * 100).toFixed(2);
    },
    // 获取表单数据
    getTableData() {
      !!this.$parent.getOverview ? this.$parent.getOverview() : null; //更新tab数据

      window.searchCatch = false;
      setTimeout(() => {
        if (window.searchCatch == false) {
          this.tableLoading = true;
        }
      }, 0);
      //转换百分比
      let parm = {};
      Object.assign(parm, this.search_data);

      if (isNaN(parm.conversionRate) == false) {
        parm.conversionRate = parm.conversionRate
          ? parm.conversionRate / 100
          : '';
      }

      const [certificateType] = this.search_data.certificateType.split('');

      getTeachersOfEntry({ ...parm, certificateType })
        .then((data) => {
          this.table_data = data.list;
          this.table_data_total = data.total;
          this.tableLoading = false;
        })
        .catch((message) => {
          this.$Message({
            message: message
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
        this.search_data.startTrainingTime = '';
        this.search_data.endTrainingTime = '';
      } else {
        let sDate = new Date(this.searchDateArea[0]).getTime();
        let eDate = new Date(this.searchDateArea[1]).getTime();
        this.search_data.startTrainingTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endTrainingTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    // 选择入职时间
    chooseHireDate() {
      if (this.hireTime[0] == null) {
        this.search_data.startHireTime = '';
        this.search_data.endHireTime = '';
      } else {
        let sDate = new Date(this.hireTime[0]).getTime();
        let eDate = new Date(this.hireTime[1]).getTime();
        this.search_data.startHireTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endHireTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
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
    // 点击用户名查看详情
    userDetail({teaId, cipherTId, name, mobile, teaBu, interviewStateStr, trainTime}) {
      this.userDetailDialog = true;
      this.userDetailId = teaId;
      this.cipherTId = cipherTId;
      this.bu = teaBu;
      this.userDetailName = name;
      this.userDetailMobile = mobile;
      this.userDetailInterviewStateStr = interviewStateStr;
      this.userDetailTrainTime = trainTime;
      basicInfo({ teaId: cipherTId })
        .then((data) => {
          this.userDetailData = data;
        })
        .catch((message) => {
          this.$Message({
            message
          });
        });
      getEduBack({ teaId })
        .then((_data) => {
          getSubject({ bu: teaBu })
            .then((data) => {
              this.eduBackData = _data;
              this.$refs.basicMessageEle.basesubject = data.children;
            })
            .catch((message) => {
              this.$Message({
                message: '基础科目获取异常'
              });
              this.basesubjectlist = [];
            });
        })
        .catch((message) => {
          console.log('error:', message);
        });
      salaryAnPay({ teaId })
        .then((data) => {
          this.salaryAnPaylData = data;
        })
        .catch((message) => {
          this.salaryAnPaylData = null;
          console.log('error:', message);
        });
      getTeaPersonalInfo({ teaId })
        .then((data) => {
          this.teaPersonalInfoData = data;
        })
        .catch((message) => {
          this.teaPersonalInfoData = null;
          console.log('error:', message);
        });
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailTabNumber = 'first';
      this.userDetailData = {};
      (this.eduBackData = {}),
        (this.salaryAnPaylData = {}),
        (this.teaPersonalInfoData = {});
      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataReviewRecords = [];
      this.userDetailDataTrainingRecords = [];
      this.userIntroductionAuditRecords = [];
      this.userProbationPeriod = [];
      this.historyRecord = [];
      this.waitEntryData = [];
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
          .then((data) => {
            this.userDetailDataPlus = data;
          })
          .catch((message) => {
            this.$Message({
              message
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
              message
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
          .then((data) => {
            this.userDetailDataReviewRecords = data;
          })
          .catch((message) => {
            this.$Message({
              message
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
          .then((data) => {
            this.userProbationPeriod = data;
          })
          .catch((message) => {
            this.$Message({
              message
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
      // if(tab.index == 10) this.handleGetTeacherHistoryRecord(this.userDetailId)
    },
    // 导出excel
    exportExcel() {
      newTryOutControllerExport(this.exportOptions);
    },
    selectTable(val) {
      this.selectList = val;
      let ids = [];
      val.forEach((value) => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
      this.selectTeachers = val;
    },
    // 招师跟进
    handFollowUp(teacherId, interviewStateStr, name) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          type: 'warning',
          message: '请选择教师'
        });
        return;
      }

      this.interviewStateStr = !!interviewStateStr
        ? interviewStateStr
        : '批量操作';
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.followName = name;
      this.followUpDialog = true;
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
    //确定转正设置后
    confirmFullMemberSettingDialog() {
      this.fullMemberSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //转正设置
    fullMemberSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师'
        });
        return;
      }
      this.currentID = teacherId ? [teacherId] : this.selectName;
      this.fullMemberSettingDialog = true;
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
    //取消转正设置
    cancelFullMemberSettingDialog() {
      this.fullMemberSettingDialog = false;
    },
    //确定修改状态后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //修改状态设置
    teaStatueSetting() {
      if (this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师'
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
    //确定排课设置后
    confirmCourseSettingDialog() {
      this.courseSettingDialog = false;
    },
    //排课设置
    courseSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师'
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
          message: '请选择教师'
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.inRecycleSettingDialog = true;
    },
    //取消跑单至回收站设置后
    cancelInRecycleSettingDialog() {
      this.inRecycleSettingDialog = false;
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
          console.log('error:', message);
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
    toPartTimeJobClose() {
      this.dimissionTeaId = '';
      this.dimissionTeaName = '';
      this.toPartTimeJobSettingDialog = false;
    },
    toPartTimePactClose() {
      this.toPartTimePactDialog = false;
      this.pactForm.time = '';
      this.pactForm.remark = '';
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

    multiResignEcontract(val) {
      if (this.selectName.length == 0) {
        this.$Message({ message: '请选择教师' });
        return;
      }
      if (val) {
        if (!this.pactForm.time) {
          this.$Message({ type: 'warning', message: '请选择入职时间' });
          return;
        }
        if (!this.pactForm.remark) {
          this.$Message({ type: 'warning', message: '请输入备注' });
          return;
        }
        let params = { ...this.pactForm };
        params.time = this.pactForm.time.getTime();
        params.teaIds = this.selectName;
        fetch({
          url: '/api/newTryOutController/multiResignEcontract',
          method: 'post',
          data: params
        })
          .then((res) => {
            // if (res.data.length) {
            //   let names = '';
            //   res.data.forEach((r) => {
            //     names += `${r.name}、`;
            //   });
            //   names = names.substring(0, names.length - 1);
            //   this.$Message({
            //     type: 'warning',
            //     duration: 8000,
            //     message: `${names}老师，不需要重签合同`
            //   });
            // } else {
            //   this.$Message({
            //     message: '合同签订成功'
            //   });
            // }

            if (res.data) {
              // 如果有值则展示结果弹框
              this.sendContractResultsVisible = true;
              this.sendResultsInfo = res.data;
            }

            this.toPartTimePactDialog = false;
          })
          .catch((message) => {
            this.$Message({
              type: 'warning',
              message
            });
          });
      } else {
        this.toPartTimePactDialog = true;
      }
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
        bu: 1
      })
        .then((res) => {
          if (res && res.length > 0) {
            let arr = res.map((item) => {
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode: item.groupCode
              };
            });
            this.teaCerOptions = [
              ...[
                {
                  label: '全部',
                  value: ''
                }
              ],
              ...arr
            ];
          }
        })
        .catch((message) => {
          this.$Message({
            message
          });
        });
    },

    // 审核合同
    tryOutAuditContract(formName, val) {
      if (val) {
        this.electronicContractDialog = false;
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            result: Number(this.ruleForm.result),
            remark: this.ruleForm.remark,
            teaId: this.pactTeaId
          };
          if (this.ruleForm.result == 1) delete data.remark;
          fetch({
            url: '/api/newTryOutController/tryOutAuditContract',
            method: 'post',
            data
          })
            .then((res) => {
              this.$Message({
                message: res.message
              });
              this.electronicContractDialog = false;
              this.ruleForm = {
                result: '',
                remark: ''
              };
              this.getTableData();
            })
            .catch((message) => {
              this.$Message({
                type: 'warning',
                message
              });
            });
        } else {
          if (!this.pactTeaId)
            return this.$Message({
              type: 'warning',
              message: '暂不能审核 请稍后再试'
            });
        }
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
    }
  },
  computed: {
    permission: function () {
      return this.$store.getters.permission;
    }
  },
  created() {
    this.search_data.keyWord = this.$route.query.keyWord || '';
    if (this.$store.getters.permission) {
      this.getTableData();
    }
  },
  mounted() {
    this.getProData();
    this.$on('search', function (val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/ent_list' });
    }
    // 获取教师资格状态列表
    this.getTeaCerList();
    commonCascade([{ dictCode: 'IS_FULL_TIME' }]).then((data) => {
      this.styleClassOption = data.children;
    });
    this.getTeacherTypes();
  },
  components: {
    dimission: dimission,
    'full-member': fullMember,
    'tea-statue-change': teaStatueChange,
    'course-plane-seeting': coursePlaneSeeting,
    'breach-of-preentry-contract': breachOfPreentryContract,
    'tea-mes-audit': teaMesAudit,
    'basic-message': basicMessage,
    'order-record': orderRecord,
    'hand-over': handOver,
    'written-record': writtenRecord,
    'training-records': trainingRecords,
    'interview-records': interviewRecords,
    'introduction-audit': introductionAudit,
    'probation-period': probationPeriod,
    preview: require('../dialog/preview_new').default,
    'resume-pl': resumePl,
    'wait-entry': waitEntry,
    'tea-entry-audit': teaEntryAudit,
    'identify-records': identifyRecords,
    'to-part-time-job': toPartTimeJob,
    followUp,
    'operation-record-mix': operationRecordMix,
    SendContractResults
  }
};
</script>

<style lang="less">
.full-time-container {
  .content {
    max-height: 400px;
    overflow-y: auto;
  }
  .control {
    text-align: right;
    padding-top: 20px;
    background-color: white;
  }
  .el-row {
    padding: 10px;
  }
  .el-row div:first-child {
    line-height: 30px;
  }
  .el-row:after {
    content: '';
    display: table;
    clear: both;
  }
  .trainTopicContent {
    line-height: 30px;
  }
  .followUpDia {
    top: 0;
    width: 80%;
    left: 20%;
    height: 100%;
    overflow: scroll;
    right: 0;
    margin-bottom: 0;
    transform: none;
    .el-dialog__header {
      border-bottom: 0;
    }
  }
  .dialog-width-760 {
    .el-dialog {
      width: 760px !important;
    }
  }
  .sign-tabs {
    .el-tabs__item {
      padding: 0 10px 0 0;
      font-size: 16px;
      margin-bottom: -10px;
    }
  }
  .contract_details__iframe {
    width: 100%;
    height: 70vh;
  }
}
</style>
