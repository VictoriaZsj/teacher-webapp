<template>
  <div class="container_pre_training" v-if="permission">
    <!-- 用户信息悬浮框 -->
    <zm-hover ref="popover1">
      <template scope="props">
        <template v-if="!props.data">
          <el-row style="text-align: center; color: black; line-height: 50px">
            <i class="el-icon-loading"></i>
          </el-row>
        </template>
        <template v-else>
          <div class="hover_panel">
            <div class="h_p_left">
              <div>性别：{{ !!props.data ? props.data.gender : '' }}</div>
              <div>
                报名年级：{{ !!props.data ? props.data.applyGrade : '' }}
              </div>
              <div>
                是否调剂：{{
                  !!props.data
                    ? getAcceptAdjusttext(props.data.acceptAdjust)
                    : ''
                }}
              </div>
              <div>毕业院校：{{ !!props.data ? props.data.college : '' }}</div>
              <div>
                毕业时间：{{ !!props.data ? props.data.graduatedYear : '' }}
              </div>
              <div v-if="props.data.teaBu != '3'">
                教师资格证：{{
                  !!props.data ? props.data.teacherCertificateStr : ''
                }}
              </div>
              <div>
                名单等级：{{
                  !!props.data ? props.data.teacherLevelDescription : ''
                }}
              </div>
            </div>
            <div class="h_p_right">
              <div>学历：{{ !!props.data ? props.data.degree : '' }}</div>
              <div>
                报名科目：{{ !!props.data ? props.data.applySubject : '' }}
              </div>
              <div>工作性质：{{ !!props.data ? props.data.timeType : '' }}</div>
              <div>联系方式：{{ !!props.data ? props.data.mobile : '' }}</div>
              <div>
                学校等级：{{ !!props.data ? props.data.collegeLevel : '' }}
              </div>
              <div v-if="props.data.teaBu != '3'">
                所在分区：{{ !!props.data ? props.data.teaRegion : '' }}
              </div>
            </div>
            <div
              v-if="
                (props.data.teaBu == 1 || props.data.teaBu == 2) &&
                  (props.data.timeType == '全职' ||
                    props.data.timeType == '校招全职')
              "
              class="advantage"
            >
              个人优势：{{ props.data.personalAdvantageStr || '' }}
            </div>
          </div>
        </template>
      </template>
    </zm-hover>
    <!-- 快捷筛选 -->
    <p class="recyclePerson">
      面试管理中有
      <span @click="search('1')">{{ recycleNum }} 人</span>
      即将进入回收站，请务必查看和确认！
    </p>
    <!--条件搜索框-->
    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="关键字" v-if="selectedFormKeys.includes('keyWord')">
        <el-input
          ID="preTrainingKeyWords"
          v-model="search_data.keyWord"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属BU" v-if="selectedFormKeys.includes('teaBu')">
        <el-select @change="teaBuFunc" v-model="search_data.teaBu" placeholder="请选择">
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
      <el-form-item label="老师状态" v-if="selectedFormKeys.includes('interviewState')">
        <el-select v-model="search_data.interviewState" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="待预约" value="0"></el-option>
          <el-option label="待面试" value="1"></el-option>
          <el-option label="待二面" value="10"></el-option>
          <el-option label="面试缺席" value="11"></el-option>
          <el-option label="待培训预约" value="2"></el-option>
          <el-option label="待培训通知" value="20"></el-option>
          <el-option label="培训延期" value="21"></el-option>
          <el-option label="培训缺席" value="22"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好" v-if="selectedFormKeys.includes('applyGradeCode')">
        <el-select v-model="search_data.applyGradeCode" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in applyGradeCodeList"
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
            v-for="(item, index) in applySubjectCodeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-form-item label="教资情况" v-if="selectedFormKeys.includes('certificateSituation')">
        <el-select
          v-model="search_data.certificateSituation"
          placeholder="请选择"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in certificateSituationList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资格证" v-if="selectedFormKeys.includes('certificateType')">
        <el-select v-model="search_data.certificateType" placeholder="请选择">
          <el-option
            v-for="item in certificateTypeList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
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
      <el-form-item label="报名时间" v-if="selectedFormKeys.includes('startApplyTime')">
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
      <el-form-item label="面试时间" v-if="selectedFormKeys.includes('startInterviewTime')">
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
      <el-form-item label="培训时间" v-if="selectedFormKeys.includes('startTrainTime')">
        <el-date-picker
          :editable="false"
          v-model="searchtrainDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期"
          @change="chooseTrainDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="下次跟进时间" v-if="selectedFormKeys.includes('startFollowupNextTime')">
        <el-date-picker
          :editable="false"
          v-model="searchFollowupDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseFollowupNextDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="最新推荐人" v-if="selectedFormKeys.includes('teaReferMobile')">
        <el-input
          v-model="search_data.teaReferMobile"
          placeholder="推荐人姓名/手机号精准查询"
        ></el-input>
      </el-form-item>
      <el-form-item label="跟进人" v-if="selectedFormKeys.includes('followPerson')">
        <el-input
          v-model="search_data.followPerson"
          placeholder="输入姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="跟进结果" v-if="selectedFormKeys.includes('followUpResult')">
        <el-select v-model="search_data.followUpResult" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="【预约面试】" value="1"></el-option>
          <el-option label="【淘汰】" value="2"></el-option>
          <el-option label="【待跟进-再次联系】" value="3"></el-option>
          <el-option label="【待跟进-N次联系不上】" value="4"></el-option>
          <el-option label="【主动放弃】" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院校等级" v-if="selectedFormKeys.includes('schoolLevel')">
        <el-select
          v-model="search_data.schoolLevel"
          placeholder="请选择"
          multiple
          clearable
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
      <el-form-item label="个人优势" v-if="selectedFormKeys.includes('personalAdvantage')">
        <el-select
          v-model="personalAdvantage"
          placeholder="请选择"
          multiple
          clearable
          collapse-tags
        >
          <el-option
            v-for="item in personalAdvantageList"
            :key="item.value"
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
            v-for="item in teaTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐岗位" v-if="selectedFormKeys.includes('stationNumber')">
        <el-select
          filterable
          v-model="search_data.stationNumber"
          placeholder="请选择推荐岗位"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in stationNumberList"
            :key="item.value"
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
    <!--列表容器-->
    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>
      <!--批量操作控件-->
      <div class="table-head">
        <el-button
          size="small"
          @click="exportExcel()"
          type="text"
          v-if="checkPermission('recruit:process:fulltime:interview:export')"
          >导出Excel</el-button
        >
        <el-button size="small" @click="remindTeacherExamSetting()" type="text"
          >发送通知</el-button
        >
        <el-button
          size="small"
          @click="trainingNoticeSetting()"
          type="text"
          v-if="
            checkPermission('recruit:process:fulltime:interview:train_notice')
          "
          >培训通知</el-button
        >
        <el-button size="small" @click="handOverSetting()" type="text"
          >移交</el-button
        >
        <el-button
          size="small"
          @click="handFollowUp()"
          type="text"
          v-if="
            checkPermission('recruit:process:fulltime:interview:multiFollowUp')
          "
        >
          招师跟进
        </el-button>
        <el-button
          size="small"
          :class="{ 'uncheck-point': unCheckedDataCount > 0 }"
          @click="batchCheckSalary()"
          type="text"
          v-if="checkPermission('full_times:teacher:batchCheck')"
        >
          批量审核薪资
        </el-button>
        <span class="table-title">共{{ table_data_total }}个老师</span>
      </div>
      <div class="quickList">
        今日 <span @click="search('2')">{{ newNum }}</span> 新名单, 总名单中
        <span @click="search('3')">{{ followingNum }}</span> 待跟进,
        <span @click="search('4')">{{ undoNum }}</span> 未处理,
        <span @click="search('5')">{{ uninterviewNum }}</span> 面试缺席,
        (面试时间 >1天)
      </div>
      <!--列表-->
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
            :fixed="item.value === 'name'"
            min-width="120"
            :sortable="sortableList.includes(item.value)"
          >
            <!-- 姓名 -->
            <template scope="scope" v-if="item.value === 'name'">
              <el-button
                @mouseenter.native="getTeaSimpleMessage(scope.row.teaId)"
                :MES="scope.row.teaId"
                v-hover="{ ref: $refs.popover1 }"
                size="small"
                type="text"
                @click="openBasicMessageComp(scope.row)"
                >{{ scope.row.name }}</el-button
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
            <!-- 所属BU -->
            <template scope="scope" v-else-if="item.value === 'teaBu'">
              {{ scope.row.teaBu | teaBuFilter }}
            </template>
            <!-- 名单等级 -->
            <template scope="scope" v-else-if="item.value === 'teacherLevel'">
              {{ scope.row.teacherLevelDescription }}
            </template>
            <!-- 是否主课老师 -->
            <template scope="scope" v-else-if="item.value === 'majorTeacher' && search_data.teaBu == '3'">
              {{ scope.row.majorTeacher | majorTeacherFilter }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template scope="scope">
              <el-button
                size="small"
                type="text"
                v-if="
                  checkPermission(
                    'recruit:process:fulltime:interview:oneFollowUp'
                  )
                "
                @click="
                  handFollowUp(
                    scope.row.teaId,
                    scope.row.interviewStateStr,
                    scope.row.name,
                    scope.row.trainTime,
                    scope.row.interviewTime,
                    scope.row
                  )
                "
              >
                招师跟进
              </el-button>
              <!-- <el-button v-if="checkPermission('recruit:process:fulltime:interview:move')" size="small" type="text" @click="handOverSetting(scope.row.teaId)">移交</el-button>
                      <el-button size="small" type="text" @click="interviewSetting(scope.row.teaId)">预约面试时间</el-button>
                      <el-button size="small" type="text" @click="trainSetting(scope.row.teaId)">预约培训时间</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="setting-table" @click="openTransferTable">
          <i class="el-icon-setting"></i>
        </div>
      </div>
      <!--分页控件-->
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
    <!--用户详情框-->
    <el-dialog
      :title="userDetailName"
      v-model="userDetailDialog"
      size="large"
      @close="closeUserDetailDialog"
    >
      <div slot="title" style="display: inline-block;">
        <span
          style="display:flex;
          align-items: center;width:100%;"
        >
          <span class="dia_title">{{ userDetailName }}</span>
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
          v-if="
            checkPermission('recruit:process:fulltime:interview:oneFollowUp')
          "
          @click="userInfoFollowUp"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>招师跟进</span>
        </div>
        <div @click="remindOneTeacherExam(userDetailId)" class="add-reserve">
          <i class="el-icon-plus"></i>
          <span>发送通知</span>
        </div>
        <div
          v-if="checkPermission('recruit:process:fulltime:interview:move')"
          @click="handOverSetting(userDetailId)"
          class="add-reserve"
        >
          <i class="el-icon-plus"></i>
          <span>移交</span>
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
            currentRoute="pre_training"
            :entry-info-enable="1"
            :name="userDetailName"
            :prodata="proData"
            :bu="bu"
            @audit="teaAudit"
            :viewState="userDetailDialog"
            :currentID="currentTeaRow.teaId"
            :cipherTId="currentTeaRow.cipherTId"
            @cancel="closeUserDetailDialog"
            @confirm="confirmUserDetailDialog"
            class="mg-20"
            :base-info="userDetailData"
            :teaStatue="1"
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
    <el-dialog
      title="老师&专员好友明细"
      v-model="bindInfoDialog"
      class="bindInfoDialog"
      width="30%"
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
    <!-- 查看面试者详情 -->
    <application-record-dialog ref="applicationRecordDialog" />
    <!-- 跟进dialog -->
    <transition name="fade">
      <el-dialog
        :white="true"
        v-model="followUpDialog"
        size="large"
        custom-class="followUpDia"
        lock-scroll
        top="0"
        :fullscreen="true"
        @close="handleCancelFollowUpDialog"
      >
      <!-- 不合理地方：currentID不应该一时是数组一时是字符串 -->
        <follow-up
          ref="followUp"
          :interviewStateStr="interviewStateStr"
          v-if="followUpDialog"
          :followName="followName"
          :salaryStatus="salaryStatus"
          :trainTimeProps="trainTimeProps"
          :interviewTimeProps="interviewTimeProps"
          tabState="面试管理"
          :currentID="currentID"
          :cipherTId="currentTeaRow.cipherTId"
          :bu="currentTeaRow.teaBu"
          @openBasicMessageComp="openBasicMessageComp"
          @confirm="handleConfirmFollowUpDialog"
          @cancel="handleCancelFollowUpDialog"
        ></follow-up>
      </el-dialog>
    </transition>
    <!--移交dialog-->
    <el-dialog
      :white="true"
      title="移交"
      v-model="handOverSettingDialog"
      size="small"
      @close="cancelHandOverSettingDialog"
    >
      <handed-over
        :recoveryStateData="recoveryStateData"
        :viewState="handOverSettingDialog"
        :MayTransferComissioners="MayTransferComissioners"
        :currentID="currentID"
        :selectedDataList="selectedDataList"
        @confirm="confirmHandOverSettingDialog"
        @cancel="cancelHandOverSettingDialog"
      >
      </handed-over>
    </el-dialog>
    <!--预约面试时间dialog-->
    <el-dialog
      :white="true"
      title="预约面试时间"
      v-model="interviewSettingDialog"
      size="small"
      @close="cancelInterviewSettingDialog"
    >
      <order-interview-time
        :viewState="interviewSettingDialog"
        :currentID="currentID"
        @confirm="confirmInterviewSettingDialog"
        @cancel="cancelInterviewSettingDialog"
      ></order-interview-time>
    </el-dialog>
    <!--预约培训时间dialog-->
    <el-dialog
      :white="true"
      title="预约培训时间"
      v-model="trainSettingDialog"
      size="small"
      @close="cancelTrainSettingDialog"
    >
      <order-train-time
        :viewState="trainSettingDialog"
        :currentID="currentID"
        @confirm="confirmTrainSettingDialog"
        @cancel="cancelTrainSettingDialog"
      ></order-train-time>
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
        type="0"
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
      v-model="standUpSettingDialog"
      size="small"
      @close="cancelStandUpSettingDialog"
    >
      <breach-of-contract
        :viewState="standUpSettingDialog"
        :currentID="currentID"
        @confirm="confirmStandUpSettingDialog"
        @cancel="cancelStandUpSettingDialog"
      ></breach-of-contract>
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
    <el-dialog
      v-model="penDialogVisible"
      title="请验证微信号是否正确"
      :destroy-on-close="true"
    >
      <el-table :data="wChatdata">
        <el-table-column
          prop="commissionerName"
          label="专员姓名"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="wChat" label="微信号" align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remindTeacherExamSetting('back')"
          >返回修改</el-button
        >
        <el-button type="primary" @click="remindTeacherExamSetting('send')"
          >正确，发送通知</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      v-model="sendAddWxNoticesDialog"
      title="不可再次发送通知"
      :destroy-on-close="true"
    >
      <div style="line-height: 40px; font-size: 14px">
        {{ sendAddWxNoticesDialogTeacherName }} 不可再次发送通知消息
      </div>
      <div style="line-height: 40px; font-weight: 600">
        原因：该老师在本月已经被发送{{ maxCount }}次通知，
      </div>
      <div style="font-weight: 600">你可以通过其他方式联系老师</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendAddWxNoticesDialog = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <qun-link
      :showQun_LinkDialog="showQun_LinkDialog"
      @close="handleClose"
      ref="qunLink"
    >
    </qun-link>
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
import hover from '../../../src/directives/hover';
import { deepCopy } from '../../../src/utils/assist';
import qun_link from './components/link';
import transfer from './components/transfer';
import handedOver from '../dialog/handed_over';
import followUp from '../dialog/followUp';
import orderInterviewTime from '../dialog/order_interview_time';
import orderTrainTime from '../dialog/order_train_time';
import teaStatueChange from '../dialog/tea_statue_change';
import breachOfContract from '../dialog/breach_of_contract';
import interviewRecords from '../userInfoItems/interview_records';
import trainingRecords from '../userInfoItems/training_records';
import identifyRecords from '../userInfoItems/identify_records';
import getProvinces from '../../api/select/getProvinces';
import basicMessage from '../userInfoItems/basic_message';
import teaMesAudit from '../dialog/tea_mes_audit';
import writtenRecord from '../userInfoItems/written_record';
import orderRecord from '../userInfoItems/order_record';
import handOver from '../userInfoItems/hand_over';
import operationRecordMix from '../userInfoItems/operation_record_mix';
import testInfo from '../../api/select/testInfo';
import basicInfo from '../../api/select/basicInfo';
import getEduBack from '../../api/select/getEduBack';
import getReserveRecords from '../../api/select/getReserveRecords';
import { querydDictService } from '../../api/dict';
import getInterviewTeachers from '../../api/select/getInterviewTeachers';
import getMayTransferComissioners from '../../api/select/getMayTransferComissioners';
import getTrainTopic from '../../api/select/getTrainTopic';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getTeaSummary from '../../api/select/getTeaSummary';
import multiTrainingNotice from '../../api/action/multiTrainingNotice';
import addCommunicateResult from '../../api/action/addCommunicateResult';
import addCommunicateRemark from '../../api/action/addCommunicateRemark';
import getSubject from '../../api/select/getSubject';
import getPhase from '../../api/select/getPhase';
import salaryAnPay from '../../api/select/salaryAnPay';
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo';
import newInterviewServiceExport from '../../api/action/newInterviewServiceExport';
import getReviewList from '../../api/select/getReviewList';
import getTobeFixedSalaryCount from '../../api/select/getTobeFixedSalaryCount'; // 获取面试管理查询待审核定薪数
import historyRecordMixin from './historyRecordMixin';
import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo';
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';
import uploadSingleVedioMixin from './uploadSingleVedioMixin';
import applicationRecordMixin from './applicationRecordMixin';
import fetch from '../../../src/utils/fetch';
import commonCascade from '../../api/select/commonCascade';
import grey_companyWX from '../../../src/images/grey_companyWX.png';
import color_companyWX from '../../../src/images/color_companyWX.png';
import {
  getHeaderTableList,
  getTeaHeaderTable,
  saveTeaHeaderTable,
} from '../../api/select/getTransformList';
import {
  default_interview_form_list,
  default_interview_table_list,
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
      selectedFormKeys: [],
      selectedFormList: [],
      selectedTableList: [],
      sortableList: ['teacherLevel', 'followUpTimeNext', 'applyTime', 'interviewTime', 'trainTime'],
      checked: true,
      friendInfoData:[],
      friendInfoDialog:false,
      bindInfoDialog:false,
      bindInfoData:[],
      grey_companyWX,
      color_companyWX,
      wxImg:null,
      wx_band_stateList: [
        { value: null, label: '全部' },
        { value: 2, label: '未绑定' },
        { value: 1, label: '已绑定' },
      ],
      currentTeaRow:{},
      showQun_LinkDialog: false,
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      certificateTypeList: [], // 教师资格状态列表
      basesubjectlist: [],
      userDetailDialog: false, // 个人信息弹出框控制
      userDetailTabNumber: 'first', //个人信息弹出框tab索引
      userDetailId: '', //个人信息弹出框用户ID
      userDetailName: '', //个人信息弹出框用户名
      userDetailMobile: '', //个人信息弹出框用户手机号
      userDetailData: {}, //个人信息弹出框-基本信息
      eduBackData: {}, //教育背景
      salaryAnPaylData: {},
      teaPersonalInfoData: {},
      userDetailDataPlus: [], //个人信息弹出框-笔试信息
      userDetailDataReserveRecords: [], //个人信息弹出框-预约记录
      userDetailDataHandsRecords: [], //个人信息糖醋狂-移交记录
      userDetailDataReviewRecords: [], //个人信息弹出框-面试记录
      userDetailDataTrainingRecords: [], //个人信息弹出框-培训记录
      userDetailDataIdentifyRecords: [], //个人信息弹出框-实名记录
      bu: '',
      applyGradeCodeList: [],
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
      certificateSituationList: [],
      applySubjectCodeList: [],
      teaCheckState: null,
      teaAuditSettingDialog: false, //修改状态dialog
      //对话框
      followUpDialog: false, // 招师跟进dialog
      handOverSettingDialog: false, //移交dialog
      interviewSettingDialog: false, //预约面试dialog
      trainSettingDialog: false, //预约培训dialog
      teaStatueSettingDialog: false, //修改状态dialog
      standUpSettingDialog: false, //跑单dialog
      unCheckedDataCount: 0, // 批量审核薪资，有待审核薪资时显示小圆点
      salaryStatus: '',
      //导出条件
      exportOptions: {},
      auditTeaId: '',
      // 搜素字段
      search_data: {
        wxBindStatus: null,
        stationNumber: '',
        certificateSituation: '',
        teaBu: '',
        teaEdu: '',
        testStatus: '',
        communicateResult: '',
        interviewState: '',
        timeType: '',
        applyGradeCode: '',
        applySubjectCode: '',
        trainTime: '',
        startTrainTime: '',
        endTrainTime: '',
        startApplyTime: '',
        endApplyTime: '',
        startInterviewTime: '',
        endInterviewTime: '',
        startFollowupNextTime: '',
        endFollowupNextTime: '',
        keyWord: '',
        followPerson: '',
        trianNo: '',
        qq: '',
        followUpResult: '',
        numType: '',
        teaReferMobile: '',
        pageNo: 1,
        pageSize: 10,
        certificateType: '',
        fixedSalaryState: '',
        schoolLevel: [],
        normalSchool: '',
        teaType: '',
      },
      personalAdvantage: [],
      recoveryStateData: null,
      //日期配置
      searchtrainDateArea: [],
      searchEnrollDateArea: [],
      searchInterviewDateArea: [],
      searchFollowupDateArea: [],
      pickerTodayOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
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
      trainTopicList: [],
      // 初始table数据
      table_data: [],
      auditData: [],
      tableLoading: true,
      table_data_total: 0,
      // 被选择的用户
      selectName: [],
      currentID: null,
      MayTransferComissioners: [],
      //教师简介信息
      teaSimpleMessage: {},
      //状态控制
      remindTeacherExamState: false,
      remindOneTeacherExamState: false,
      trainingNoticeState: false,
      //教师沟通状态修改字段控制
      lastTeaCommunicateResultID: '',
      lastCommunicateResult: '',
      //沟通类型字符串
      communicateResultList: [1022, 1023, 1024, 1016, 1, 2, 1025, 4],
      selectTableText: '个人基本信息-基本信息',
      //列表渲染状态判断
      listDataRenderState: true,
      remarkList: {}, //备注数组,用于没有修改则不发送修改备注
      proData: [],
      interviewStateStr: '',
      interviewStateStrArray: [],
      followName: '',
      recycleNum: 0,
      newNum: 0,
      followingNum: 0,
      undoNum: 0,
      uninterviewNum: 0,
      doubeInterviewNum: 0,
      qualificatedTeacherNum: 0,
      trainTimeProps: '',
      interviewTimeProps: '',
      userDetailInterviewStateStr: '',
      userDetailTrainTime: '',
      penDialogVisible: false,
      wChatdata: [],
      selectedDataList: [], // 已选中列表数据
      sendAddWxNoticesDialog: false,
      sendAddWxNoticesDialogTeacherName: '',
      maxCount: '',
      personalAdvantageList: [], // 个人优势
      teaTypeList: [], // 老师类型
      teaEduList: [], // 学历列表
      stationNumberList: [],
      origin_table_data:[],
    };
  },
  filters: {
    testStatueFilter(testStatue) {
      if (parseInt(testStatue) == 1) {
        return '未提交';
      }
      if (parseInt(testStatue) == 2) {
        return '已提交';
      }
      return testStatue;
    },
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
  directives: { hover },
  methods: {
    reset() {
      this.search_data = {
        wxBindStatus: null,
        stationNumber: '',
        certificateSituation: '',
        teaBu: '',
        teaEdu: '',
        testStatus: '',
        communicateResult: '',
        interviewState: '',
        timeType: '',
        applyGradeCode: '',
        applySubjectCode: '',
        trainTime: '',
        startTrainTime: '',
        endTrainTime: '',
        startApplyTime: '',
        endApplyTime: '',
        startInterviewTime: '',
        endInterviewTime: '',
        startFollowupNextTime: '',
        endFollowupNextTime: '',
        keyWord: '',
        followPerson: '',
        trianNo: '',
        qq: '',
        followUpResult: '',
        numType: '',
        teaReferMobile: '',
        pageNo: 1,
        pageSize: 10,
        certificateType: '',
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
    initHasCertificate() {
      this.$Fetch({
        url: `/api/dict/getDictByGroupCode`,
        method: 'get',
        params: { groupCode: 'CERTIFICATE_SITUATION', bu: 1 },
      }).then(res => {
        res.data.forEach(i => {
          this.certificateSituationList.push({
            value: i.itemCode,
            label: i.itemName,
          });
        });
      });
    },
    handleClose(val, status) {
      this.showQun_LinkDialog = val;
      if (status == 'success') {
        this.search('');
      }
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
    openThisDialog(id) {
      this.$refs.applicationRecordDialog.dialogVisible = true;
      this.$refs.applicationRecordDialog.getEvaluationUsing(id);
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
        });
    },
    cancelTeaAuditSettingDialog() {
      this.auditTeaId = '';
      this.teaAuditSettingDialog = false;
    },
    initPhase() {
      this.search_data.applyGradeCode = '';
      this.applyGradeCodeList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getPhase(parm)
        .then(data => {
          this.applyGradeCodeList = data.children;
        })
        .catch(message => {});
    },
    initSubject() {
      this.search_data.applySubjectCode = '';
      this.applySubjectCodeList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm)
        .then(data => {
          this.applySubjectCodeList = data.children;
        })
        .catch(message => {});
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
        type: 'interview',
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
        if (!this.selectedFormList.length) this.selectedFormList = default_interview_form_list;
        if (!this.selectedTableList.length) this.selectedTableList = default_interview_table_list;
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
      console.log(data, opType);
      const params = {
        config: JSON.stringify(data),
        opType,
        type: 'interview',
      };
      const refName = opType === 'form' ? 'transferForm' : 'transferTable';
      await saveTeaHeaderTable(params);
      this.$refs[refName].dialogVisible = false;
      this.$message.success('设置成功');
      await this.initTableList();
    },
    teaBuFunc() {
      this.initPhase();
      this.initSubject();
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
    },
    // 过滤空字段
    filterNull(obj) {
      obj = JSON.parse(JSON.stringify(obj));
      let newObj = {};
      for (var attr in obj) {
        if (obj[attr] !== '') {
          newObj[attr] = obj[attr];
        }
      }
      return newObj;
    },
    // 获取名单的参数
    getMumHandler(params) {
      return new Promise((resolve, reject) => {
        fetch({
          url: `/api/newInterviewService/getMum`,
          method: 'post',
          data: params,
        }).then(res => {
          const { code, data, message } = res;
          if (code == 0 && (data !== null || data !== '')) {
            resolve(data);
          } else {
            reject('数据不存在');
          }
        });
      });
    },
    /**
     * @获取面试管理名单
     *  今日新名单, 总名单中待跟进, 未处理, 面试缺席
     **/
    getFollowUpTeacher(numType) {
      let dataObj = {};
      if (numType !== 1) {
        dataObj = JSON.parse(JSON.stringify(this.search_data));
        delete dataObj.pageNo;
        delete dataObj.pageSize;
        dataObj = this.filterNull(dataObj);
      }
      dataObj.numType = numType;
      this.getMumHandler(dataObj).then(res => {
        if (numType === 1) this.recycleNum = res;
        if (numType === 2) this.newNum = res;
        if (numType === 3) this.followingNum = res;
        if (numType === 4) this.undoNum = res;
        if (numType === 5) this.uninterviewNum = res;
      });
    },
    /**
     * @考虑到接口查询速度问题
     * 后台做了分开查询
     */
    getFollowUpTeachers() {
      this.getFollowUpTeacher(1);
      this.getFollowUpTeacher(2);
      this.getFollowUpTeacher(3);
      this.getFollowUpTeacher(4);
      this.getFollowUpTeacher(5);
    },
    // 获取表单数据
    getTableData() {
      !!this.$parent.getOverview ? this.$parent.getOverview() : null; //更新tab数据
      this.tableLoading = true;
      if (this.personalAdvantage.length) {
        this.search_data.personalAdvantage = this.personalAdvantage.toString();
      } else {
        delete this.search_data.personalAdvantage;
      }
      getInterviewTeachers(this.search_data)
        .then(data => {
          this.listDataRenderState = false;
          this.table_data = this.transformListData(data.list);
          this.origin_table_data=this.table_data.slice(0);
          this.$nextTick(function() {
            this.listDataRenderState = true;
          });
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
    //列表数据处理
    transformListData(data) {
      let listData = data;
      let len = data.length;
      let item = null;
      for (let i = 0; i < len; i++) {
        item = listData[i];
        if (
          this.communicateResultList.indexOf(item.communicateResultType) == -1
        ) {
          item.communicateResultType = '';
        }
        this.remarkList[item.teaId] = {
          remark: item.communicateRemark,
          communicateResult: item.communicateResultType,
          testStatus: item.testStatus,
        };
        
      }
      return listData;
    },
    getAcceptAdjusttext(adjust) {
      if (adjust == '1') {
        return '是';
      }
      if (adjust == '0') {
        return '否';
      }
      return '';
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
    // 选择下次跟进时间范围
    chooseFollowupNextDate() {
      if (this.searchFollowupDateArea[0] == null) {
        this.search_data.startFollowupNextTime = '';
        this.search_data.endFollowupNextTime = '';
      } else {
        let sDate = new Date(this.searchFollowupDateArea[0]).getTime();
        let eDate = new Date(this.searchFollowupDateArea[1]).getTime();
        this.search_data.startFollowupNextTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endFollowupNextTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    // 查询
    search(type) {
      this.search_data.numType = type;
      this.exportOptions = deepCopy(this.search_data);
      this.search_data.pageNo = 1;
      this.getTableData();
      this.getFollowUpTeachers();
    },
    handleReset() {
      this.search_data = {
        teaBu: '',
        testStatus: '',
        communicateResult: '',
        interviewState: '',
        timeType: '',
        applyGradeCode: '',
        applySubjectCode: '',
        trainTime: '',
        startTrainTime: '',
        endTrainTime: '',
        startApplyTime: '',
        endApplyTime: '',
        startInterviewTime: '',
        endInterviewTime: '',
        keyWord: '',
        followPerson: '',
        trianNo: '',
        qq: '',
        followUpResult: '',
        numType: '',
        certificateType: '',
        pageNo: 1,
        pageSize: 10,
      };
      this.searchtrainDateArea = [];
      this.searchEnrollDateArea = [];
      this.searchInterviewDateArea = [];
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
        }).then(res => {
          if (res && res.code === '0') {
            this.bindInfoData = [{ ...res.data }];
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
      }).then(res => {
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
        .catch(message => {
          // console.log('error:', message);
        });
      salaryAnPay({ teaId })
        .then(data => {
          this.salaryAnPaylData = data;
        })
        .catch(message => {
          this.salaryAnPaylData = null;
          // console.log('error:', message);
        });
      getTeaPersonalInfo({ teaId })
        .then(data => {
          this.teaPersonalInfoData = data;
        })
        .catch(message => {
          this.teaPersonalInfoData = null;
          // console.log('error:', message);
        });
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailDialog = false;
      this.userDetailTabNumber = 'first';
      this.userDetailData = {};
      this.eduBackData = {};
      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
      this.userDetailDataHandsRecords = [];
      this.userDetailDataReviewRecords = [];
      this.userDetailDataTrainingRecords = [];
      this.userDetailDataIdentifyRecords = [];
      this.historyRecord = [];
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
      newInterviewServiceExport(this.exportOptions);
    },
    selectTable(val) {
      this.selectedDataList = val;
      let ids = [];
      this.interviewStateStrArray = [];
      val.forEach(value => {
        ids.push(value.teaId.toString());
        this.interviewStateStrArray.push(value.interviewStateStr);
      });
      this.selectName = ids;
      this.interviewStateStrArray = Array.from(
        new Set(this.interviewStateStrArray)
      );
    },
    //修改教师基本信息
    changeUserDetails() {},
    //确定移交后
    confirmHandOverSettingDialog() {
      this.handOverSettingDialog = false;
      //刷新列表
      this.userDetailDialog = false;
      this.getTableData();
    },
    // 批量审核薪资
    batchCheckSalary() {
      let batchCheckSalaryUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        '/teacher/#/full_times/batchCheckPreTraining?originPage=' +
        'pre_training';
      window.open(batchCheckSalaryUrl);
    },
    //移交设置
    handOverSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      getMayTransferComissioners()
        .then(data => {
          this.MayTransferComissioners = data;
          this.currentID = !!teacherId ? teacherId : this.selectName;
          this.handOverSettingDialog = true;
        })
        .catch(message => {
          this.$Message({
            message,
          });
        });
    },
    //取消移交设置后
    cancelHandOverSettingDialog() {
      this.handOverSettingDialog = false;
    },
    // 招师跟进
    handFollowUp(
      teacherId,
      interviewStateStr,
      name,
      trainTime,
      interviewTime,
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
      // this.salaryStatus=row.fixedSalaryState
      this.trainTimeProps = trainTime ? trainTime : '';
      this.interviewTimeProps = interviewTime ? interviewTime : '';
      this.followUpDialog = true;
      this.$nextTick(() => {
        this.$refs.followUp.setSubTrainDateDate();
        if (this.interviewStateStr !== '批量操作') {
          this.$refs.followUp.getLogs();
        }
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
      this.getFollowUpTeachers();
    },
    //确定预约面试时间
    confirmInterviewSettingDialog() {
      this.$Message({
        message: '预约面试时间成功',
      });
      this.interviewSettingDialog = false;
    },
    //预约面试时间设置
    interviewSetting(teacherId) {
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = teacherId;
      this.interviewSettingDialog = true;
    },
    //取消预约面试时间设置后
    cancelInterviewSettingDialog() {
      this.interviewSettingDialog = false;
    },
    //确定预约培训时间后
    confirmTrainSettingDialog() {
      this.$Message({
        message: '预约培训时间成功',
      });
      this.trainSettingDialog = false;
    },
    //预约培训时间设置
    trainSetting(teacherId) {
      if (window.isEmpty(teacherId)) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.trainSettingDialog = true;
    },
    //取消预约培训时间设置后
    cancelTrainSettingDialog() {
      this.trainSettingDialog = false;
    },
    //确定跑单操作后
    confirmStandUpSettingDialog() {
      this.standUpSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //跑单设置
    standUpSetting(teacherId) {
      if (window.isEmpty(teacherId) && this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.currentID = !!teacherId ? teacherId : this.selectName;
      this.standUpSettingDialog = true;
    },
    //取消跑单设置后
    cancelStandUpSettingDialog() {
      this.standUpSettingDialog = false;
    },
    //执行培训通知
    trainingNoticeSetting() {
      if (this.trainingNoticeState == true) {
        return;
      }
      if (this.selectName.length == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      this.trainingNoticeState = true;
          multiTrainingNotice({ teaIds: [].concat(this.selectName) })
            .then(data => {
              this.trainingNoticeState = false;
              this.$refs.qunLink.init(true, data);
            })
            .catch(message => {
              this.$Message({
                message,
              });
              this.trainingNoticeState = false;
            });
    },
    //执行批量发送通知
    remindTeacherExamSetting(type) {
      if (this.remindTeacherExamState == true) {
        return;
      }
      let selectNameLen = this.selectName.length;
      if (selectNameLen == 0) {
        this.$Message({
          message: '请选择教师',
        });
        return;
      }
      if (type === 'send') {
        this.$Fetch({
          url: '/api/newInterviewService/sendAddWxNotices',
          method: 'post',
          data: {
            teacherIds: this.selectName,
          },
        })
          .then(res => {
            if (res && res.code === '0') {
              this.penDialogVisible = false;
              if (res.data && res.data.teaList && res.data.teaList.length) {
                setTimeout(() => (this.sendAddWxNoticesDialog = true), 500);
                this.maxCount = res.data.maxCount || 2;
                let names = [];
                res.data.teaList.forEach(r => {
                  if (r.name) names.push(r.name);
                });
                if (names.length)
                  this.sendAddWxNoticesDialogTeacherName = names.toString();
              } else {
                this.$Message({
                  message: res.message || '发送成功',
                });
              }
            } else {
              this.$Message({
                message: message || '发送失败',
              });
            }
            setTimeout(() => this.getTableData(), 600);
          })
          .catch(message => {
            this.$Message({
              message: message || '发送失败 请稍后再试',
            });
          });
      } else if (type === 'back') {
        this.penDialogVisible = false;
      } else {
        this.$Fetch({
          url: '/api/newInterviewService/getCommissioners',
          method: 'post',
          data: {
            teaids: this.selectName,
          },
        })
          .then(res => {
            if (res.code === '0') {
              this.wChatdata = res.data;
              this.penDialogVisible = true;
            } else {
              const { message } = res.data;
              this.$Message({
                message,
              });
            }
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
    },
    //执行单个发送通知
    remindOneTeacherExam(teaId) {
      if (this.remarkList[teaId].testStatus == '已提交') {
        this.$Message({
          message: '已提交笔试',
        });
        return;
      }
      this.$MessageBox
        .confirm(`确定要发送通知吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.$Fetch({
            url: '/api/newInterviewService/sendAddWxNotices',
            method: 'post',
            data: {
              teacherIds: [teaId],
            },
          })
            .then(res => {
              if (res && res.code === '0') {
                this.penDialogVisible = false;
                if (res.data && res.data.teaList && res.data.teaList.length) {
                  setTimeout(() => (this.sendAddWxNoticesDialog = true), 500);
                  this.maxCount = res.data.maxCount || 2;
                  let names = [];
                  res.data.teaList.forEach(r => {
                    if (r.name) names.push(r.name);
                  });
                  if (names.length)
                    this.sendAddWxNoticesDialogTeacherName = names.toString();
                } else {
                  this.$Message({
                    message: res.message || '发送成功',
                  });
                }
              } else {
                this.$Message({
                  message: message || '发送失败',
                });
              }
              setTimeout(() => this.getTableData(), 600);
            })
            .catch(message => {
              this.$Message({
                message: message || '发送失败 请稍后再试',
              });
            });
        })
        .catch(message => {});
    },
    //确定执行修改状态后
    confirmTeaStatueSettingDialog() {
      this.teaStatueSettingDialog = false;
      this.userDetailDialog = false;
      this.getTableData();
    },
    //打开修改状态设置
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
    getTeaSimpleMessage(teaId) {
      if (!this.teaSimpleMessage[teaId]) {
        getTeaSummary({ teaId: teaId })
          .then(data => {
            this.teaSimpleMessage[teaId] = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
    },
    //修改教师沟通结果
    changeTeaCommunicateResult(teaId, communicateResult) {
      if (this.listDataRenderState == false) {
        return;
      }
      if (this.remarkList[teaId].communicateResult == communicateResult) {
        return;
      }
      if (
        teaId != this.lastTeaCommunicateResultID ||
        communicateResult != this.lastCommunicateResult
      ) {
        if (communicateResult == 4) {
          this.$Message({
            message: '不可以选择条件符合选项',
          });
          this.changeDataCommunicateResult(
            teaId,
            this.remarkList[teaId].communicateResult
          );
          return;
        }
        this.lastTeaCommunicateResultID = teaId;
        this.lastCommunicateResult = communicateResult;
        addCommunicateResult({
          teaId: teaId,
          communicateResultType: communicateResult,
        })
          .then(data => {
            this.$Message({
              message: '修改成功',
            });
            this.remarkList[teaId].communicateResult = communicateResult;
          })
          .catch(message => {
            this.$Message({
              message,
            });
            this.changeDataCommunicateResult(
              teaId,
              this.remarkList[teaId].communicateResult
            );
          });
      }
    },
    changeTeaCommunicateResultRemark(teaId, communicateRemark) {
      if (!communicateRemark) {
        return;
      }
      if (this.remarkList[teaId].remark == communicateRemark) {
        return;
      }
      addCommunicateRemark({ teaId: teaId, remark: communicateRemark })
        .then(data => {
          this.$Message({
            message: '修改成功',
          });
          this.remarkList[teaId].remark = communicateRemark;
        })
        .catch(message => {
          this.$Message({
            message,
          });
          this.changeDataRemark(teaId, this.remarkList[teaId].remark);
        });
    },
    changeDataRemark(teaId, value) {
      const len = this.table_data.length;
      let item = null,
        index = null;
      for (let i = 0; i < len; i++) {
        item = this.table_data[i];
        if (item.teaId == teaId) {
          index = i;
          break;
        }
      }
      if (index != null) {
        item.communicateRemark = value;
        this.table_data.splice(index, 1, item);
      }
    },
    changeDataCommunicateResult(teaId, value) {
      const len = this.table_data.length;
      let item = null,
        index = null;
      for (let i = 0; i < len; i++) {
        item = this.table_data[i];
        if (item.teaId == teaId) {
          index = i;
          break;
        }
      }
      if (index != null) {
        item.communicateResultType = value;
        this.table_data.splice(index, 1, item);
      }
    },
    chooseDate(startDate, endDate) {
      if (!!startDate && !!endDate) {
        let startTrainTime = startDate;
        let endTrainTime = endDate;
        this.search_data.trianNo = '';
        this.trainTopicList = [];
        getTrainTopic({ startTrainTime, endTrainTime })
          .then(data => {
            this.trainTopicList = data;
          })
          .catch(message => {
            this.$Message({
              message: message,
            });
          });
      }
    },
    // 面试管理-查询待审核定薪数
    getTobeFixedSalaryData() {
      getTobeFixedSalaryCount({
        type: 'pre_training',
      })
        .then(data => {
          this.unCheckedDataCount = data || 0;
        })
        .catch(message => {
        });
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
            this.certificateTypeList = [
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
    uploadSuccess(list) {
      // 上传成功后获取个人介绍里面的视频字段赋值
      this.$refs.basicMessageEle.teaPersonalInfoData.teaVideoUrl =
        list[0].fileUrl;
    },
    getSPECIAL_ADVANTAGE() {
      commonCascade([{ dictCode: 'SPECIAL_ADVANTAGE_T' }]).then(data => {
        this.personalAdvantageList = data.children;
      });
    },
    getTeacherTypes() {
      this.teaTypeList = [];
      commonCascade([{ dictCode: 'TEACHER_TYPE' }]).then(data => {
        this.teaTypeList = [{ label: '全部', value: '' }, ...data.children];
      });
    },
    getStationList() {
      this.$Fetch({
        url: '/api/teacherStation/stationList',
        method: 'get',
      }).then(res => {
        if (res.data && res.data.length)
          this.stationNumberList = res.data.map(i => {
            return {
              label: i.stationName,
              value: i.stationNumber,
            };
          });
      });
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
  computed: {
    permission: function() {
      return this.$store.getters.permission;
    },
  },
  created() {
    this.search_data.keyWord = this.$route.query.keyWord || '';
    this.search_data.interviewState = this.$route.query.interviewState || '';
    if (this.$store.getters.permission) {
      this.getTableData();
    }
  },
  mounted() {
    this.initPhase();
    this.initSubject();
    this.initTeaEdu();
    this.initHasCertificate();
    this.initTableList();
    this.getProData();
    this.getFollowUpTeachers();
    window.teaSimpleMessage = this.teaSimpleMessage;
    this.$on('search', function(val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/bef_int' });
    }
    window.preTraning = this;
    this.getTeaCerList(); // 获取教师资格状态列表
    this.getTobeFixedSalaryData();  // 面试管理-查询待审核定薪数
    this.getSPECIAL_ADVANTAGE(); // 个人优势
    this.getTeacherTypes();  //老师类型
    this.getStationList();  //推荐岗位
  },
  components: {
    'handed-over': handedOver,
    'order-interview-time': orderInterviewTime,
    'order-train-time': orderTrainTime,
    'basic-message': basicMessage,
    'tea-mes-audit': teaMesAudit,
    'order-record': orderRecord,
    'hand-over': handOver,
    'written-record': writtenRecord,
    'tea-statue-change': teaStatueChange,
    'interview-records': interviewRecords,
    'training-records': trainingRecords,
    'identify-records': identifyRecords,
    'breach-of-contract': breachOfContract,
    followUp,
    'qun-link': qun_link,
    'operation-record-mix': operationRecordMix,
    'transfer': transfer,
  },
};
</script>

<style lang="less">
.bindInfoDialog{
  .el-dialog__body{
    background:#fff
  }
}
.container_pre_training {
  .search-button {
    margin: 9px;
  }
  .setting-form {
    cursor: pointer;
    color: #409EFF;
  }
  .dia_title{
    line-height: 1;
    font-size: 16px;
    color: #383838;
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
  .hover_panel {
    display: inline-block;
  }
  .h_p_left,
  .h_p_right {
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
  }
  .hover_panel .advantage {
    padding-left: 5px;
  }
  .h_p_left div,
  .h_p_right div {
    padding: 5px;
  }
  .recyclePerson {
    width: 100%;
    padding: 10px 40px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color: #ffff99;
    font-size: 16px;
    border-bottom: 1px solid #f2f2f2;
  }
  .recyclePerson > span,
  .quickList > span {
    color: #ff341f;
  }
  .recyclePerson > span:hover,
  .quickList > span:hover {
    cursor: pointer;
  }
  .quickList {
    margin-bottom: 20px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    font-size: 16px;
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
  .searchButton {
    margin: 5px;
    width: 80px;
  }
  .el-select__tags-text {
    display: inline-block;
    vertical-align: top;
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
