<template>
  <div class="full-time-container" v-if="permission">
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="关键字" v-if="selectedFormKeys.includes('content')">
        <el-input
          ID="preTrainingKeyWords"
          v-model="search_data.content"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属BU" v-if="selectedFormKeys.includes('bu')">
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
      <el-form-item label="工作性质" v-if="selectedFormKeys.includes('timeType')">
        <el-select v-model="search_data.timeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" :value="1"></el-option>
          <el-option label="校招全职" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入职资料审核状态" v-if="selectedFormKeys.includes('entryState')">
        <el-select v-model="search_data.entryState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待提交" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="审核通过" value="2"></el-option>
          <el-option label="审核不通过" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电子签约状态" v-if="selectedFormKeys.includes('econtractState')">
        <el-select v-model="search_data.econtractState" placeholder="请选择">
          <el-option
            v-for="(item, i) of econtractStateOption"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老师状态" v-if="selectedFormKeys.includes('state')">
        <el-select v-model="search_data.state" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待入职" value="4"></el-option>
          <el-option label="待签合同" value="35"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好" v-if="selectedFormKeys.includes('grade')">
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
      <el-form-item label="第一擅长科目" v-if="selectedFormKeys.includes('subject')">
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
      <el-form-item label="职位类型" v-if="selectedFormKeys.includes('positionType')">
        <el-select v-model="search_data.positionType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="坐班" value="1"></el-option>
          <el-option label="非坐班" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师类型" v-if="selectedFormKeys.includes('teaType')">
        <el-select v-model="search_data.teaType" placeholder="请选择老师类型">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in teaTypeOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微信绑定状态" v-if="selectedFormKeys.includes('wxBindStatus')">
        <el-select
          v-model="search_data.wxBindStatus"
          placeholder="请选择"
        >
          <el-option
            v-for="item in wx_band_stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-button
        class="search-button"
        icon="search"
        type="normal"
        size="small"
        @click="search"
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
          size="small"
          @click="exportExcel()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:regular:export')"
          >导出Excel</el-button
        >
        <el-button
          size="small"
          @click="showSignOfflineSetting()"
          type="text"
          v-if="
            checkPermission(
              'recruit:process:fulltime:regular:signOfflineSetting'
            )
          "
          >签线下合同</el-button
        >
        <el-button type="text" size="small" @click="batchSignSetting()"
          >签电子合同</el-button
        >
        <!-- <el-button type="text" size="small" @click="inRecycleSetting()">跑单</el-button> -->
        <el-button
          size="small"
          @click="handFollowUp()"
          type="text"
          v-if="checkPermission('tea:process:ftime:entry:manage:multiFollowUp')"
          >招师跟进</el-button
        >
      </div>
      <div class="table-wrap">
        <el-table
          :data="table_data"
          :key="tableKey"
           @sort-change="sortChange"
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
          <el-table-column fixed align="center" type="selection" width="30">
          </el-table-column>
          <el-table-column
            v-for="item in selectedTableList"
            :key="item.value"
            :prop="item.value"
            align="center"
            :label="item.text"
            :fixed="item.value === 'teaName'"
            min-width="120"
          >
            <!-- 姓名 -->
            <template scope="scope" v-if="item.value === 'teaName'">
              <el-button
                size="small"
                type="text"
                @click="userDetail(scope.row, false)"
                >{{ scope.row.teaName }}</el-button
              >
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
            <!-- 邮箱 -->
            <template scope="prop" v-else-if="item.value === 'email'">
              <div v-if="prop.row.email">{{prop.row.email}}</div>
              <el-button
                v-else
                type="text"
                @click="getTeaSecret(prop.row)"
                size="small"
                class="detailsBtn"
                >点击查看信息</el-button
              >
            </template>
            <!-- 是否可签约 -->
            <template scope="scope" v-else-if="item.value === 'canSign'">
              {{ scope.row.canSign ? '是' : '否' }}
              <template v-if="!scope.row.canSign">
                原因：<span>{{ scope.row.signReason }}</span
                ><br />
                <p v-if="scope.row.showButton">
                  处理方案：<span
                    @click="openPostMatchDialog(scope.row)"
                    class="blue"
                    >点击查看</span
                  >
                </p>
              </template>
            </template>
            <!-- 所属bu -->
            <template scope="scope" v-else-if="item.value === 'bu'">
              {{ scope.row.bu | teaBuFilter }}
            </template>
            <!-- 教师资格证 -->
            <template scope="scope" v-else-if="item.value === 'certificateType'">
              {{ scope.row.certificateType | certificateTypeFilter }}
            </template>
            <!-- 工作性质 -->
            <template scope="scope" v-else-if="item.value === 'timeType'">
              {{ scope.row.timeType | timeTypeFilters }}
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
            <!-- 电子签约状态 -->
            <template scope="scope" v-else-if="item.value === 'econtractStateText'">
              <el-button
                v-if="scope.row.econtractState === 5 && !scope.row.checked"
                size="small"
                @click="
                  handlePreviewEcontractState(scope.row.teaId, scope.$index)
                "
                type="text"
                >{{ scope.row.econtractStateText }}</el-button
              >
              <div v-else>{{ scope.row.econtractStateText }}</div>
            </template>
            <!-- 入职资料的状态 -->
            <template scope="scope" v-else-if="item.value === 'entryState'">
              {{ scope.row.entryState | entryStateFilters }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="300">
            <template scope="scope">
              <el-button
                size="small"
                type="text"
                v-if="
                  checkPermission('tea:process:ftime:entry:manage:oneFollowUp')
                "
                @click="handFollowUp(scope.row)"
                >招师跟进</el-button
              >
              <el-button
                v-show="scope.row.bu == '3'"
                size="small"
                @click="formalEntrySettingDialogSetting(scope.row.teaId)"
                type="text"
                >正式入职</el-button
              >
              <el-button
                v-show="scope.row.bu != '3' && scope.row.entryState == '1'"
                size="small"
                @click="userDetail(scope.row, true)"
                type="text"
                >审核资料</el-button
              >
              <!-- scope.row.canSign 是否可签约 -->
              <el-button
                v-show="
                  scope.row.bu != '3' &&
                  scope.row.entryState == '2' &&
                  scope.row.canSign
                "
                size="small"
                @click="
                  batchSignSetting(
                    scope.row.teaId,
                    scope.row.teaName,
                    scope.row,
                    'one'
                  )
                "
                type="text"
                >签电子合同</el-button
              >
              <el-button
                v-if="scope.row.econtractState === 6"
                size="small"
                @click="handleContractAudit(scope.row.teaId)"
                type="text"
                >合同审核</el-button
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
      <div slot='title' style="display: inline-block;" >
        <span  style="display:flex;
          align-items: center;width:100%;">
          <span class="dia_title">{{userDetailName}}</span>
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
          v-if="checkPermission('tea:process:ftime:entry:manage:oneFollowUp')"
          @click="handFollowUp()"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>招师跟进</span>
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
            ref="basicMessageEle"
            currentRoute="wait_entry"
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
    <el-dialog
      title="老师&专员好友明细"
     v-model="bindInfoDialog"
     class="bindInfoDialog"
     :modal='false'
      width="30%" >
       <el-radio-group slot='title' v-model="tabVal" style="margin-bottom: 30px;">
          <el-radio-button label="left">绑定记录</el-radio-button>
          <el-radio-button label="right">老师&专员好友明细</el-radio-button>
        </el-radio-group>
      <el-table
           v-show="tabVal=='left'"
          :data="bindInfoData"
          border
          ref='bindInfoData'
          style="width: 100%">
          <el-table-column
           align='center'
            prop="externalNickName"
            label="绑定人（老师）"
           >
          </el-table-column>
          <el-table-column
            prop="externalUserID"
            align='center'
            label="外部联系人id"
            width="300px"
           >
          </el-table-column>
          <el-table-column
            prop="bindStatus"
            align='center'
            label="绑定状态">
            <template scope="prop">
              {{prop.row.bindStatus==1?'已绑定':'未绑定'}}
            </template>
          </el-table-column>
            <el-table-column
            prop="operatorName"
            align='center'
            label="操作人">
          </el-table-column>
           <el-table-column
            prop="bindTime"
            align='center'
            label="操作时间">
            <template scope="prop">
              {{ prop.row.bindTime?$DateTool.format(prop.row.bindTime, 'yyyy-MM-dd HH:mm:ss'):''}}
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
      <in-recycle-wait-entry
        :viewState="inRecycleSettingDialog"
        :currentID="currentID"
        @confirm="confirmInRecycleSettingDialog"
        @cancel="cancelInRecycleSettingDialog"
      ></in-recycle-wait-entry>
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
        type="4"
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
        type="5"
        apitype="0"
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
    <!--签电子合同dialog---批量-->
    <el-dialog
      :white="true"
      title="签电子合同"
      v-model="teaSignSettingDialog"
      size="small"
      @close="cancelSignSetting"
    >
      <sign
        :viewState="teaSignSettingDialog"
        :currentID="signTeaId"
        @confirm="confirmSignSetting"
        @cancel="cancelSignSetting"
      ></sign>
    </el-dialog>
    <!--签电子合同dialog-->
    <el-dialog
      :white="true"
      title="签电子合同"
      v-model="teaSign2SettingDialog"
      size="small"
      @close="cancelSignSetting"
    >
      <sign2
        :viewState="teaSign2SettingDialog"
        :currentID="signTeaId"
        @confirm="confirmSignSetting"
        @cancel="cancelSignSetting"
        :row="row"
      ></sign2>
    </el-dialog>
    <!--签线下合同dialog-->
    <el-dialog
      :white="true"
      id="signoffline-dialog"
      title="签线下合同"
      v-model="signOfflineSettingDialog"
      size="small"
      @close="cancelOfflineSignSetting"
    >
      <offline-sign
        :viewState="signOfflineSettingDialog"
        :currentID="offlineSignTeaId"
        @confirm="confirmOfflineSignSetting"
        @cancel="cancelOfflineSignSetting"
        ref="signOfflineSettringRef"
      ></offline-sign>
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
          tabState="入职管理"
          :salaryStatus='salaryStatus'
          :currentID="currentID"
          :cipherTId="cipherTId"
          @confirm="handleConfirmFollowUpDialog"
          @cancel="handleCancelFollowUpDialog"
        ></follow-up>
      </el-dialog>
    </transition>
    <!-- 合同审核 -->
    <el-dialog
      :white="true"
      title="合同审核"
      v-model="contractAuditDialog"
      size="small"
      @close="cancelCourseSettingDialog"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="contract_audit"
      >
        <h3 v-if="ruleForm.contractUrl">合同内容</h3>
        <iframe
          v-if="contractUrl"
          class="contract_details__iframe"
          :key="this.ruleForm.contractId"
          :src="contractUrl"
          frameborder="0"
        />
        <h3>审核结果</h3>
        <el-form-item label="审核结果：" prop="result">
          <el-radio-group v-model="ruleForm.result">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="ruleForm.result === '2'"
          label="拒绝原因："
          prop="desc"
        >
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="contractAuditDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitContractAudit('ruleForm')"
          :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 岗位匹配dialog -->
    <el-dialog
      :white="true"
      title="岗位匹配结果"
      v-model="PostMatchDialogVisible"
      width="500px"
      @close="closePostMatchHandle"
    >
      <post-match
        ref="post_match"
        v-if="PostMatchDialogVisible"
        :signReason="signReason"
        :teaId="currentTeaId"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="PostMatchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPostMatchHandle"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 确认岗位弹框 -->
    <el-dialog
      :white="true"
      title="请确认岗位信息"
      v-model="postMatchConfirmDialogVisible"
      width="500px"
      @close="postMatchConfirmDialogVisible = false"
    >
      <post-match-confirm
        v-if="postMatchConfirmDialogVisible"
        :teaId="currentTeaId"
        :teacherType="postMatchTeacherType"
        :bu="postMatchTeacherBu"
        @cancel="postMatchConfirmDialogVisible = false"
        @confirm="closePostMatchConfirmHandle"
      />
    </el-dialog>
    <!-- 批量发送合同结果弹框 -->
    <el-dialog
      :white="true"
      title="批量发合同结果"
      v-model="sendContractResultsVisible"
      width="500px"
    >
      <send-contract-results
        :send_results_info="sendResultsInfo"
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
      :disabledArr="['content']"
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
      :disabledArr="['teaName']"
      @save="saveTableList($event, 'table')"
    ></el-transfer-form>
  </div>
  <div v-else style="font-size: 32px; text-align: center; line-height: 80vh">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import { deepCopy } from '../../../src/utils/assist';
import inRecycleWaitEntry from '../dialog/in_recycle_wait_entry';
import coursePlaneSeeting from '../dialog/course_plane_seeting';
import teaStatueChange from '../dialog/tea_statue_change';
import sign from '../dialog/sign'; // 签电子合同
import sign2 from '../dialog/sign2'; // 签电子合同
import offlineSign from '../dialog/offline-sign'; // 签线下合同
import teaMesAudit from '../dialog/tea_mes_audit';
import teaEntryAudit from '../dialog/tea_entry_audit';
import basicMessage from '../userInfoItems/basic_message';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
import handOver from '../userInfoItems/hand_over';
import trainingRecords from '../userInfoItems/training_records';
import interviewRecords from '../userInfoItems/interview_records';
import introductionAudit from '../userInfoItems/introduction_audit';
import probationPeriod from '../userInfoItems/probation_period';
import fullMemberManage from '../userInfoItems/full_member_manage';
import waitEntry from '../userInfoItems/wait_entry';
import getProvinces from '../../api/select/getProvinces';
import testInfo from '../../api/select/testInfo';
import basicInfo from '../../api/select/basicInfo';
import getReserveRecords from '../../api/select/getReserveRecords';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getWaitEntryRecords from '../../api/select/getWaitEntryRecords';
import salaryAnPay from '../../api/select/salaryAnPay';
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import getEduBack from '../../api/select/getEduBack';
import getReviewList from '../../api/select/getReviewList';
import getSubject from '../../api/select/getSubject';
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';
import formalEntry from '../dialog/formal_entry';
import newEntryControllerExport from '../../api/action/newEntryControllerExport';
import getPhase from '../../api/select/getPhase';
import resumePl from '../dialog/resume_pl';
import historyRecordMixin from './historyRecordMixin';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import getTeaCerListService from '../../api/select/getTeaCerListService'; // 获取教师资格状态列表
import {
  getEcontractFailReason,
  auditContract,
  getTobeEcontract
} from '../../api/select/electronicContract';
import { econtractStateOption } from './options';
import followUp from '../dialog/followUp';
import uploadSingleVedioMixin from './uploadSingleVedioMixin';
import applicationRecordMixin from './applicationRecordMixin';
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';

import commonCascade from '../../api/select/commonCascade';
import PostMatch from '../dialog/post_match';
import PostMatchConfirm from '../dialog/post_match_confirm';
// 批量发合同结果弹框
import SendContractResults from '../dialog/send_contract_results';
import grey_companyWX from '../../../src/images/grey_companyWX.png';
import color_companyWX from '../../../src/images/color_companyWX.png';
import {
  getHeaderTableList,
  getTeaHeaderTable,
  saveTeaHeaderTable,
} from '../../api/select/getTransformList';
import {
  default_entry_form_list,
  default_entry_table_list,
} from './formConfig.js';

export default {
  mixins: [historyRecordMixin, uploadSingleVedioMixin, applicationRecordMixin],
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
      bindInfoDialog:false,
      bindInfoData:[],
      friendInfoData:[],
      grey_companyWX,
      color_companyWX,
      wxImg:null,
      wx_band_stateList:[
        { value: null, label: '全部' },
        { value: 2, label: '未绑定' },
        { value: 1, label: '已绑定' },
      ],
      loading: false,
      teaTypeOption: [],
      teaCerOptions: [], // 教师资格状态列表
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      basesubjectlist: [],
      signTeaId: null,
      offlineSignTeaId: null, // 签线下合同teaId
      auditEntryTeaId: '',
      auditEntryTeaName: '',
      teaEntryAuditSettingDialog: false,
      formalEntrySettingDialog: false,
      teaSignSettingDialog: false, // 签电子合同弹窗显示flg --批量
      teaSign2SettingDialog: false,
      signOfflineSettingDialog: false, // 签线下合同弹窗显示flg
      phaseList: [], //学段
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

      userIntroductionAuditRecords: [], //个人信息弹出框-个人介绍审核记录
      userProbationPeriod: [], //个人信息弹出框-试用期管理记录
      fullMemberData: [], //个人信息弹出框-转正管理记录
      waitEntryData: [],

      //对话框
      inRecycleSettingDialog: false, //回收站dialog
      courseSettingDialog: false, //排课设置dialog
      teaStatueSettingDialog: false, //修改状态dialog
      teaAuditSettingDialog: false, //修改状态dialog
      previewDialog: false,
      exportOptions: {},
      basesubList: [],
      bu: '',
      row: {},
      // 搜素字段
      search_data: {
        wxBindStatus:null,
        bu: '',
        timeType: '',
        state: '',
        entryState: '',
        gradeCode: '',
        grade: '',
        positionType: '',
        subjectCode: '',
        subject: '',
        trainTime: '',
        content: '',
        econtractState: '',
        certificateType: '',
        econtractState: '',
        pageNo: 1,
        pageSize: 10,
        teaReferKeywords: '',
        teaType: ''
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
      origin_table_data:[],
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
      econtractStateOption,
      followUpDialog: false, // 招师跟进dialog
      interviewStateStr: '',
      interviewStateStrArray: [],
      followName: '',
      salaryStatus:'',
      contractAuditDialog: false,
      ruleForm: {
        result: '',
        remark: '',
        contractId: '',
        teaId: ''
      },
      contractUrl: '',
      rules: {
        result: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ]
      },
      trainTimeProps: '',
      userDetailInterviewStateStr: '',
      userDetailTrainTime: '',
      PostMatchDialogVisible: false, // 岗位匹配弹框
      signReason: '', //
      currentTeaId: null, // 岗位匹配的teaid
      postMatchConfirmDialogVisible: false, // 岗位确认弹框
      sendContractResultsVisible: false, // 批量发送合同结果弹框
      sendResultsInfo: {
        failCount: 0,
        failedTeachers: [],
        successCount: 0
      },
      postMatchTeacherType: null, // 点击行老师的类型
      postMatchTeacherBu: null // 点击行老师的bu
    };
  },
  components: {
    'in-recycle-wait-entry': inRecycleWaitEntry,
    'course-plane-seeting': coursePlaneSeeting,
    'tea-statue-change': teaStatueChange,
    'basic-message': basicMessage,
    'order-record': orderRecord,
    'hand-over': handOver,
    'tea-mes-audit': teaMesAudit,
    'written-record': writtenRecord,
    'training-records': trainingRecords,
    'interview-records': interviewRecords,
    'introduction-audit': introductionAudit,
    'probation-period': probationPeriod,
    'full-member-manage': fullMemberManage,
    'wait-entry': waitEntry,
    'formal-entry': formalEntry,
    preview: require('../dialog/preview_new').default,
    'resume-pl': resumePl,
    sign: sign,
    sign2: sign2,
    offlineSign,
    'tea-entry-audit': teaEntryAudit,
    followUp,
    'operation-record-mix': operationRecordMix,
    PostMatch,
    PostMatchConfirm,
    SendContractResults
  },
  watch: {
    'search_data.subjectCode': function (val) {
      this.search_data.subject = this.getTextByCode(val, this.basesubList);
    },
    'search_data.gradeCode': function (val) {
      this.search_data.grade = this.getTextByCode(val, this.phaseList);
    },
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
        case 'historyRecord':
          this.selectTableText = '个人基本信息-历史记录';
          break;
        case 'operationRecordMix':
          this.selectTableText = '个人基本信息-操作记录';
          break;
        default:
      }
    }
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
      }
    },
    entryStateFilters(val) {
      let text = '';
      if (val == '0') {
        text = '待提交';
      }
      if (val == '1') {
        text = '待审核';
      }
      if (val == '2') {
        text = '审核通过';
      }
      if (val == '3') {
        text = '审核不通过';
      }
      return text;
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
    }
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
    reset() {
      this.search_data = {
        wxBindStatus:null,
        bu: '',
        timeType: '',
        state: '',
        entryState: '',
        gradeCode: '',
        grade: '',
        positionType: '',
        subjectCode: '',
        subject: '',
        trainTime: '',
        content: '',
        econtractState: '',
        certificateType: '',
        econtractState: '',
        pageNo: 1,
        pageSize: 10,
        teaReferKeywords: '',
        teaType: ''
      }
    },
    getTeacherTypes() {
      this.teaTypeOption = [];
      commonCascade([{ dictCode: 'TEACHER_TYPE' }]).then((data) => {
        this.teaTypeOption = [{ label: '全部', value: '' }, ...data.children];
      });
    },
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
    },
    getTextByCode(code, data) {
      let text = '';
      for (let i = 0; i < data.length; i++) {
        if (data[i].value == code) {
          text = data[i].label;
          break;
        }
      }
      return text;
    },
    entryAudit(id, name) {
      this.auditEntryTeaId = id;
      this.auditEntryTeaName = name;
      this.teaEntryAuditSettingDialog = true;
    },
    confirmTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = '';
      this.auditEntryTeaName = '';
      this.getTableData();
      this.teaEntryAuditSettingDialog = false;
      this.userDetailDialog = false;
    },
    cancelTeaEntryAuditSettingDialog() {
      this.auditEntryTeaId = '';
      this.auditEntryTeaName = '';
      this.teaEntryAuditSettingDialog = false;
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
    getTeaSecret(row) {
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
      let parm = {
        teaId: row.teaId,
        infoType: 'email'
      };
      getTeacherSecretInfo(parm)
        .then((data) => {
          this.requestTeaSecretState = false;
          row.email = data;
          this.requestTeaSecretInterval = window.setInterval(() => {
            if (this.requestTeaSecretTime >= 5) {
              window.clearInterval(this.requestTeaSecretInterval);
            } else {
              this.requestTeaSecretTime = this.requestTeaSecretTime + 1;
            }
          }, 1000);
        })
        .catch((message) => {
          this.requestTeaSecretTime = 5;
          this.requestTeaSecretState = false;
          this.$Message({
            message
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
            message
          });
        });
    },
    confirmSignSetting(resData) {
      this.signTeaId = null;
      this.teaSignSettingDialog = false;
      this.teaSign2SettingDialog = false;
      if (resData) {
        // 如果有值则展示结果弹框
        this.sendContractResultsVisible = true;
        this.sendResultsInfo = resData;
      }
      this.getTableData();
    },
    cancelSignSetting() {
      this.signTeaId = null;
      this.teaSignSettingDialog = false;
      this.teaSign2SettingDialog = false;
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
    //执行签定合同
    batchSignSetting(teacherId, teacherName, row, num) {
      if (this.selectName.length != 0) {
        //判断是否存在bu老师
        if (this.isIncludePeilian(this.selectName)) {
          let message =
            '当前选择的老师包含陪练BU，不支持批量签电子合同流程，请重新操作！';
          if (this.selectName.length == 1) {
            message = '陪练类型的教师不支持签电子合同操作';
          }
          this.$Message({
            message: message
          });
          return;
        }
      }
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师'
        });
        return;
      }
      if (!!teacherId) {
        this.signTeaId = teacherId;
      } else {
        this.signTeaId = this.selectName;
      }
      if (num == 'one') {
        this.teaSign2SettingDialog = true;
        this.row = row;
      } else {
        this.teaSignSettingDialog = true;
      }
    },
    // 关闭线下合同弹窗
    cancelOfflineSignSetting() {
      this.offlineSignTeaId = null;
      this.signOfflineSettingDialog = false;
    },
    // 签订线下合同
    showSignOfflineSetting() {
      if (!this.selectName.length) {
        this.$Message({
          message: '请选择需要签线下合同的老师'
        });
        return;
      }
      if (this.selectName.length > 1) {
        this.$Message({
          message: '一次只能选择一个老师签线下合同'
        });
        return;
      }

      this.offlineSignTeaId = this.selectName[0];
      let curRow = this.getTeaDataById(this.selectName[0]);
      if (curRow.entryState === '0') {
        this.$Message({
          message: '请先提交入职资料'
        });
        return;
      }
      if (curRow.entryState === '1') {
        this.$Message({
          message: '请先审核入职资料'
        });
        return;
      }
      if (curRow.entryState === '3') {
        this.$Message({
          message: '入职资料审核不通过，请重新提交入职资料'
        });
        return;
      }
      if (curRow.entryState !== '2') {
        this.$Message({
          message: '老师的入职资料状态未审核通过，无法签合同'
        });
        return;
      }
      this.signOfflineSettingDialog = true;
    },
    // 签线下合同提交
    confirmOfflineSignSetting() {
      this.offlineSignTeaId = null;
      this.signOfflineSettingDialog = false;
      this.getTableData();
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
        .catch((message) => {});
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
    initSubject() {
      this.search_data.teaGoodFirst = '';
      this.basesubList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm)
        .then((data) => {
          this.basesubList = data.children;
        })
        .catch((message) => {});
    },
    buChnage() {
      this.initPhase();
      this.initSubject();
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
        type: 'entry',
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
        if (!this.selectedFormList.length) this.selectedFormList = default_entry_form_list;
        if (!this.selectedTableList.length) this.selectedTableList = default_entry_table_list;
        // 设定筛选项list
        this.selectedFormKeys = [];
        this.selectedFormList.forEach(item => {
          this.selectedFormKeys.push(item.value);
        });
        // 更新列表
        this.tableKey = Math.random();
      });
    },
    // 保存配置项
    async saveTableList(data, opType) {
      const params = {
        config: JSON.stringify(data),
        opType,
        type: 'entry',
      };
      const refName = opType === 'form' ? 'transferForm' : 'transferTable';
      await saveTeaHeaderTable(params);
      this.$refs[refName].dialogVisible = false;
      this.$message.success('设置成功');
      this.initTableList();
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

      getWaitEntryRecords({ ...this.search_data, certificateType })
        .then((data) => {
          this.table_data = data.list.map(item => {
            item.email = '';
            return item
          });
           this.origin_table_data=this.table_data.slice(0);
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
    // 资料卡中招师跟进
    // userInfoFollowUp(row) {
    //   this.handFollowUp(
    //     this.userDetailId,
    //     this.userDetailInterviewStateStr,
    //     this.userDetailName,
    //     this.userDetailTrainTime,
    //     row
    //   );
    // },
     getWxBindDetail(userDetailId){
          if(this.wxImg==color_companyWX){
            this.bindInfoDialog=true
              this.$Fetch({
                  url: '/api/bind/bindInfo',
                  method: 'get',
                  params: {
                    teaId: this.userDetailId
                  }
                })
                .then((res) => {
                  if (res && res.code === '0') {
                    this.bindInfoData=[{...res.data}]
                    console.log('bindInfo:',res.data)
                  }})
              }

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

        },
        getWX_compang_img(id){
          this.$Fetch({
              url: '/api/bind/bindStatus',
              method: 'get',
              params: {
                teaId: id
              }
            })
            .then((res) => {
              if (res && res.code === '0') {
                this.titleImgStatus=res.data.bindStatus;
                this.titleImgName=res.data.commissionerName;
                if(res.data.bindStatus==1||res.data.bindStatus==2){
                      this.wxImg=color_companyWX
                    }else{
                      this.wxImg=grey_companyWX
                    }
              }})
        },
    // 点击用户名查看详情
    userDetail({teaId, teaName, mobile, bu, cipherTId, stateStr, trainTime}, isAudit) {
      this.userDetailDialog = true;
      this.userDetailId = teaId;
      this.cipherTId = cipherTId;
      this.bu = bu;
      this.userDetailName = teaName;
      this.userDetailMobile = mobile;
      this.userDetailInterviewStateStr = stateStr;
      this.userDetailTrainTime = trainTime;
            this.getWX_compang_img(teaId)
      if (!!isAudit) {
        window.setTimeout(() => {
          if (!!this.$refs.basicMessageEle) {
            this.$refs.basicMessageEle.selectMode = 'entryInfo';
          }
        }, 100);
      }

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
          getSubject({ bu })
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
      this.eduBackData = {};
      this.salaryAnPaylData = {};
      this.teaPersonalInfoData = {};

      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataReviewRecords = [];
      this.userDetailDataTrainingRecords = [];
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
      // if (tab.name==="seven") {
      //   getReviewList({teaId:this.userDetailId}).then(data => {
      //     this.userIntroductionAuditRecords = data;
      //   }).catch(message => {
      //     this.$Message({
      //         message
      //     });
      //   });
      // }
      if (tab.name === 'eight') {
        this.handleGetTeacherHistoryRecord(this.userDetailId);
        // html 代码已注释
        // operateLog({teaId:this.userDetailId}).then(data => {
        //   this.userProbationPeriod = data;
        // }).catch(message => {
        //   this.$Message({
        //       message
        //   });
        // });
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
      newEntryControllerExport(this.exportOptions);
    },
    selectTable(val) {
      let ids = [];
      val.forEach((value) => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
    },
    // 招师跟进
    handFollowUp(row) {
      let teacherId = null, interviewStateStr = '',  name = '', trainTime = '';
      if (row) {
        teacherId = row.teaId;
        interviewStateStr = row.stateStr;
        name = row.name;
        this.cipherTId = row.cipherTId;
      } else {
        teacherId = this.userDetailId;
        interviewStateStr = this.userDetailInterviewStateStr;
        name = this.userDetailName;
        trainTime = this.userDetailTrainTime;
      }
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
      // this.salaryStatus=row.salaryStatus;
      this.trainTimeProps = trainTime ? trainTime : '';
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
    //确定跑单至回收站后
    confirmInRecycleSettingDialog() {
      this.inRecycleSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //跑单至回收站设置
    inRecycleSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师'
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
          message: '请选择教师'
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
    // 查询签署失败原因
    handlePreviewEcontractState(teaId, index) {
      const contract = this.table_data[index];
      const { econtractStateText } = contract;

      contract.econtractStateText = '正在查询...';

      getEcontractFailReason({ teaId })
        .then(({ data }) => {
          contract.econtractStateText = `${econtractStateText}: ${data}`;
          contract.checked = true;
        })
        .catch((err) => {
          contract.econtractStateText = econtractStateText;
          this.$Message.error('查询异常，请稍后再试');
        });
    },
    // 获取合同地址
    async handleContractAudit(teaId) {
      const {
        data: { pageUrl, contractId } = {},
        code
      } = await getTobeEcontract({ teaId }).catch((err) => {
        this.$Message('异常：', err);
      });

      this.ruleForm = {
        ...this.ruleForm,
        contractId,
        teaId
      };

      if (code === '0') this.contractAuditDialog = true;
      this.contractUrl = pageUrl;
    },

    // 合同审核
    submitContractAudit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          auditContract(this.ruleForm)
            .then(({ code, data, message }) => {
              if (code === '0') {
                this.$Message.success(
                  this.ruleForm.result === '1' ? '审核通过！' : '审核拒绝！'
                );
                this.contractAuditDialog = false;
                this.loading = false;
                this.$refs[formName].resetFields();
                this.initRuleForm();
              }
            })
            .catch((err) => this.$Message.error(err || '没有找到签署记录'));
        } else {
          return false;
        }
      });
    },

    initRuleForm() {
      this.ruleForm = {
        result: '',
        remark: '',
        contractId: '',
        teaId: '',
        contractId: '',
        teaId: ''
      };
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
    openPostMatchDialog(row) {
      // 打开岗位匹配
      this.currentTeaId = row.teaId;
      this.postMatchTeacherType = row.timeType;
      this.postMatchTeacherBu = row.bu;
      this.signReason = row.signReason;
      this.PostMatchDialogVisible = true;
    },
    closePostMatchHandle() {},
    submitPostMatchHandle(cb) {
      // 打开岗位确认弹框
      this.$refs.post_match.selctPostMatchHandle((res) => {
        this.PostMatchDialogVisible = false;
        if (res) {
          this.postMatchConfirmDialogVisible = true;
        }
      });
    },
    openPostMatchConfirmDialog() {
      this.postMatchConfirmDialogVisible = true;
    },
    closePostMatchConfirmHandle() {
      this.postMatchConfirmDialogVisible = false;
      this.getTableData();
    },
    submitPostMatchConfirmHandle() {
      // 提交薪水与等级
      this.$refs.post_match_confirm.saveTeacherSalaryAndLevel();
    },
    openSendContractResultsModalHandle() {
      this.sendContractResultsVisible = true;
    },
    closeSendContractResultsModalHandle() {
      this.sendContractResultsVisible = false;
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
    this.initPhase();
    this.initSubject();
    this.initTableList();
    this.getProData();
    this.$on('search', function (val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/pre_ent' });
    }
    // 获取教师资格状态列表
    this.getTeaCerList();
    //老师类型
    this.getTeacherTypes();
  }
};
</script>

<style lang="less">
.bindInfoDialog{
    .el-dialog__body{
      background:#fff
    }
  }
.blue {
  color: #1d91fc;
}
.full-time-container {
  .search-button {
    margin: 9px;
  }
  .setting-form {
    cursor: pointer;
    color: #409EFF;
  }
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
  .contract_audit {
    h3 {
      // border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      line-height: 2;
    }
  }
  .el-dialog__footer {
    padding: 10px 20px 15px;
    text-align: right;
    box-sizing: border-box;
    background: #fff;
  }
  .detailsBtn {
    cursor: pointer;
  }
  #signoffline-dialog {
    .el-dialog__body {
      .content {
        max-height: 600px !important;
      }
    }
  }
}
.contract_details__iframe {
  display: block;
  width: 100%;

  max-width: 499px;
  height: 500px;
  margin: 20px auto 0;
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
</style>
