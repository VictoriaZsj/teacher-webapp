<template>
  <div class="followUp">
    <div class="followUpContent">
      <!-- 第一行 -->
      <div class="topTitle" :class="{ border: tabState === '入职管理' }">
        <div v-if="tabState === '面试管理' || tabState === '培训管理'">
          <span v-if="interviewStateStr !== '批量操作'" class="span1"
            ><span>{{ followName }} </span></span
          >
          <span v-if="interviewStateStr !== '批量操作'" class="span2"
            >ID：<span>{{ currentID }}</span>
          </span>
          <span v-if="interviewStateStr !== '批量操作'" class="span3"
            >状态：<span>{{ interviewStateStr }} </span></span
          >
          <span
            style="color: red; padding-top: 8px; padding-left: 20px"
            class="span4"
            v-if="teacherHeadInfo.stationFit == 0"
            >（提示：该老师的个人信息和推荐岗位不一致，若需修改请在资料卡调整）</span
          >
        </div>
        <!-- 第二行 -->

        <div style="margin-top: 8px">
          <span
            v-if="interviewStateStr !== '批量操作'"
            style="margin-right: 20px"
          >
            名单等级：<span
              >{{ teacherHeadInfo.teacherLevelDescription }}
            </span>
          </span>
          <span v-if="interviewStateStr !== '批量操作'">
            是否可约面：<span
              >{{ teacherHeadInfo.permitAppoint == 0 ? '不可约面' : '可约面' }}
            </span>
          </span>
          <span
            v-if="interviewStateStr !== '批量操作' && tabState === '面试管理'"
            >信息完善度：<el-button
              type="text"
              size="mini"
              @click="openCompletionRatio"
              >{{
                teacherHeadInfo.completionRatio
                  ? teacherHeadInfo.completionRatio + '%'
                  : ''
              }}</el-button
            >
          </span>

          <!-- 面试 -->
          <span
            v-if="
              interviewStateStr !== '批量操作' &&
                tabState === '面试管理' &&
                activeName == 'first'
            "
          >
            推荐岗位：
            <el-button
              type="text"
              size="mini"
              @click="handleRecommend(teacherHeadInfo.recommendStation)"
              >{{
                teacherHeadInfo.recommendStation
                  ? teacherHeadInfo.recommendStation.stationName
                  : ''
              }}
            </el-button>
          </span>
          <span
            v-if="
              interviewStateStr !== '批量操作' &&
                tabState === '面试管理' &&
                activeName == 'first'
            "
          >
          <!-- 面试管理，当前跟进展示 -->
            当前符合/ 使用的推荐岗位：
            <span>
              <template v-if="teacherHeadInfo.resultStationStr">
                <span> {{teacherHeadInfo.resultStationStr}} </span>
              </template>
              <template v-else-if="currentStationNameList.length">
                <el-tooltip v-if="currentStationNameList.length > 1">
                  <div slot="content">
                    <div
                      v-for="(item, index) in currentStationNameList"
                      :key="index"
                      style="margin: 4px 0;"
                    >
                      {{ item }}
                    </div>
                  </div>
                  <div style="display: inline-block;">
                    {{ `${currentStationNameList.slice(0, 2).join('，')}...` }}
                  </div>
                </el-tooltip>
                <div v-else>
                  {{ currentStationNameList.join('，') }}
                </div>
              </template>
              <div v-else></div>
            </span>
          </span>
          <span
            v-if="
              interviewStateStr !== '批量操作' &&
                tabState === '面试管理' &&
                activeName == 'second'
            "
          >
            当前岗位：
            <el-button
              type="text"
              size="mini"
              @click="handleCurrentPostStation(currentPostStation)"
              >{{ currentPostStation ? currentPostStation.postName : '' }}
            </el-button>
          </span>
          <!-- 培训/入职 -->
          <span
            v-if="interviewStateStr !== '批量操作' && tabState === '培训管理'"
          >
            培训主题：<span> {{ teacherHeadInfo.trainTheme }}</span>
          </span>
          <span
            v-if="interviewStateStr !== '批量操作' && tabState === '培训管理'"
          >
            培训时间：<span>{{ teacherHeadInfo.trainTime }}</span>
          </span>

          <span
            v-if="
              interviewStateStr !== '批量操作' &&
                (tabState === '培训管理' || tabState === '入职管理')
            "
          >
            当前岗位：
            <el-button
              type="text"
              size="mini"
              @click="handleCurrentPostStation(currentPostStation)"
              >{{ currentPostStation ? currentPostStation.postName : '' }}
            </el-button>
          </span>
        </div>
      </div>
      <br />
      <!-- 第三行 -->
      <el-form ref="form" :model="form" label-width="122px">
        <div style="margin-top: 20px">
          <tabs
            v-if="
              (tabState === '面试管理' || tabState === '培训管理') &&
                (teaBU == 1 || teaBU == 5 || teaBU == 2) &&
                interviewStateStr !== '批量操作'
            "
            style="margin-left: 20px"
            v-model="activeName"
            :before-leave="handleBeforeLeave"
            @tab-click="TabHandleClick"
          >
            <tab-pane label="跟进结果" name="first"></tab-pane>
            <tab-pane label="定薪" name="second">
              <fixedSalaryInfoComponents
                @openBasicMessageComp="openBasicMessageComp"
                @refreshFixedSalary="getHeadInfo"
                ref="fixedSalaryInfoComponents"
                @cancel="handleCancel"
                :currentID="currentID"
                :cipherTId="cipherTId"
                :periodState="tabState === '面试管理' ? 2 : 3"
              />
            </tab-pane>
          </tabs>
        </div>
        <br />
        <!-- 内容部分 -->
        <div v-if="activeName !== 'second'">
          <el-form-item
            required
            label="跟进结果："
            v-if="tabState === '面试管理'"
          >
            <el-radio-group
              v-if="interviewStateStr === '批量操作'"
              v-model="form.followUpResult"
              @change="handleChangeState"
            >
              <!-- <el-radio label="1">预约面试</el-radio> -->
              <!-- <el-radio label="2">设置培训时间</el-radio> -->
              <!--<el-radio label="3">发送培训通知</el-radio>-->
              <el-radio label="4">待跟进</el-radio>
              <el-radio label="5">淘汰</el-radio>
              <el-radio label="6">主动放弃</el-radio>
            </el-radio-group>
            <el-radio-group
              v-else
              v-model="form.followUpResult"
              @change="handleChangeState"
            >
              <el-radio
                v-if="
                  interviewStateStr !== '待预约培训' &&
                    interviewStateStr !== '待培训通知' &&
                    interviewStateStr !== '培训延期' &&
                    interviewStateStr !== '培训不通过'
                "
                label="1"
                >预约面试</el-radio
              >
              <el-radio
                v-if="
                  interviewStateStr === '待预约培训' || //
                    interviewStateStr === '培训延期' ||
                    interviewStateStr === '培训不通过'
                "
                label="2"
                >设置培训时间</el-radio
              >
              <el-radio v-if="interviewStateStr === '待培训通知'" label="2"
                >设置培训时间</el-radio
              >
              <!-- <el-radio v-if="interviewStateStr === '待培训通知'" label="3">发送培训通知</el-radio> -->
              <el-radio label="4">待跟进</el-radio>
              <el-radio label="5">淘汰</el-radio>
              <el-radio label="6">主动放弃</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            required
            label="跟进结果："
            v-if="tabState === '培训管理' || tabState === '入职管理'"
          >
            <el-radio-group
              v-model="form.connectResult"
              @change="handleChangeState"
            >
              <el-radio
                label="2"
                v-if="
                  tabState === '培训管理' && trainResultTypeStr == '延期培训'
                "
                >设置培训时间</el-radio
              >
              <el-radio label="5">淘汰</el-radio>
              <el-radio label="6">主动放弃</el-radio>
            </el-radio-group>
            <span class="tip" v-if="isShow">注：{{ tipContent }}</span>
          </el-form-item>

          <el-form-item
            required
            label="跟进结果："
            v-if="tabState === '试用期管理'"
          >
            <el-radio-group
              v-model="form.connectResult"
              @change="handleChangeState"
            >
              <el-radio label="6">主动放弃</el-radio>
            </el-radio-group>
            <span class="tip" v-if="isShow">注：{{ tipContent }}</span>
          </el-form-item>
          <el-form-item
            v-if="tabState === '面试管理' && judgeVal === '1' && interviewStateStr !== '批量操作'"
            required
            label="面试时间："
          >
            <el-date-picker
              v-model="interViewDateTime.day"
              style="width: 130px"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-select
              placeholder="选择时间"
              style="width: 120px"
              v-model="interViewDateTime.time"
              :loading="timeLoading"
            >
              <el-option
                v-for="item in interviewedTimeOptions"
                :key="item.target"
                :label="`${item.target}:00 (${item.count})`"
                :value="`${item.target}:00`"
                :disabled="!item.canAppoint"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="tabState === '面试管理' && judgeVal === '4'"
            required
            label="待跟进原因："
          >
            <el-select v-model="form.followUpReason" placeholder="请选择">
              <el-option
                v-for="item in followUpOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-checkbox
              v-if="tableData && tableData.length >= 3"
              v-model="form.goingRecycle"
            >
              直接进入回收站
            </el-checkbox>
          </el-form-item>
          <el-form-item
            v-if="
              tabState === '面试管理' &&
                judgeVal === '4' &&
                form.followUpReason === '1'
            "
            required
            label="再次联系时间："
          >
            <el-date-picker
              v-model="form.subDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="clearable"
              @change="handleChangeConnectDate"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 下次跟进时间 -->
          <el-form-item
            v-if="
              tabState === '面试管理' &&
                judgeVal === '4' &&
                form.followUpReason === '2'
            "
            required
            label="下次跟进时间："
          >
            <el-date-picker
              v-model="form.subDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="clearable"
              @change="handleChangeConnectDate"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="
              (tabState === '面试管理' ||
                (tabState === '培训管理' &&
                  trainResultTypeStr == '延期培训')) &&
                judgeVal === '2' &&
                interviewStateStr !== '批量操作'
            "
            required
            label="培训时间："
          >
            <el-date-picker
              ref="datePicker"
              v-model="form.subTrainDate"
              :picker-options="pickerDateOptions"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="预约培训时间（精确到秒）"
              @change="handleChangeTrainDate"
              @focus="handleFocusTrainDate"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="judgeVal === '5'" required label="淘汰原因：">
            <el-select v-model="form.obsoleteReason" placeholder="请选择">
              <el-option
                v-for="item in obsoleteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="tabState !== '试用期管理' && judgeVal === '6'"
            required
            label="主动放弃："
          >
            <el-select v-model="form.giveUpReason" placeholder="请选择">
              <el-option
                v-for="item in giveUpOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="备注：">
            <el-input
              type="textarea"
              v-model="form.remarks"
              placeholder="请输入(限制15字)"
              :maxlength="maxlength"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进记录：">
            <div class="record" v-if="interviewStateStr !== '批量操作'">
              <el-table :data="tableData" border center>
                <el-table-column
                  prop="createdTime"
                  label="操作时间"
                  width="150"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="createdUser"
                  label="操作人"
                  width="100"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="teaStateStr"
                  label="状态操作"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="teaPeriodStr"
                  label="操作阶段"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="operateTypeStr"
                  width="200"
                  label="操作类型"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="operateDetail"
                  width="150"
                  label="操作详情"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  width="200"
                  label="备注"
                  align="center"
                >
                </el-table-column>
              </el-table>
              <!-- <div class="buttonGroup">
                  <el-button @click="handleCancel">取消</el-button>
                  <el-button type="primary" @click="handleConfirm">确定</el-button>
                </div> -->
            </div>
          </el-form-item>
        </div>
        <div class="buttonGroup" v-if="activeName !== 'second'">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </el-form>
    </div>

    <el-dialog
      title="确认最终使用岗位"
      class="followup-dialog"
      v-model="finalStationVisiable"
      :modal="true"
      size="small"
      @close="stationNumber = ''"
      append-to-body
    >
    <!-- 提示 -->
    <p>请选择最终使用的推荐岗位，选中后系统会自动更新对应的信息</p>

      <el-radio-group v-model="stationNumber" class="finalStation">
        <el-row>
          <el-col  v-for="(i, index) in currentStationList" :span="12" :key="index">
             <el-radio
               :label="i.stationNumber"
               :class="{'final-radio-top0':index>1}"
               :key="index">
               {{ i.stationName }}
             </el-radio>
          </el-col>
        </el-row>
        <!-- <el-radio
          :label="i.stationNumber"
          v-for="(i, index) in currentStationList"
          :key="index"
          >{{ i.stationName }}</el-radio
        > -->
      </el-radio-group>
      <br />
      <p style="margin-top:20px;">
        注意：若定薪状态=定薪待审核/已定薪，重新确认岗位后，将会重置定薪状态，请重新定薪，提交审核
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finalStationVisiable = false">取 消</el-button>
        <el-button type="primary" @click="confirmFinalPost">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :modal="false"
      title="老师信息"
      v-model="openteaInfo_h5"
      :append-to-body="true"
      custom-class="openteaInfo_h5"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          height: 500px;
          overflow-y: scroll;
        "
      >
        <open-teaInfo-h5 :currentID="currentID" ref="openTeaInfoH5">
        </open-teaInfo-h5>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openteaInfo_h5 = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="岗位匹配结果"
      v-model="showResultDialog"
      :modal="false"
      width="30%"
      class="resultDialog"
    >
      <div style="background:#ffffff">
        <h3>提示：老师当前岗位和基础信息不匹配，无法定薪，有以下处理方案</h3>
        <br />

        <el-radio v-model="resultObj.postCode" label="again"
          >修改老师信息，重新定薪</el-radio
        >
        <p style="margin:20px 0 10px 0" v-if="postList && postList.length > 0">
          使用系统推荐岗位
        </p>

        <div :key="index" v-for="(i, index) in postList">
          <el-radio v-model="resultObj.postCode" :label="i.postCode">
            系统推荐岗位：{{ i.postName }} <br />
          </el-radio>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="showResultDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmResult()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <tea-station-tag ref="teaStationTag" :isModal="false"></tea-station-tag>

    <tea-post-tag ref="teaPostTag" :isModal="false"></tea-post-tag>

    <div class="tip-train-box" ref="tipTrain">
      <span :class="tipTrain.bLimit ? 'red':''">已约培/上限：{{tipTrain.count}}/{{tipTrain.limit}}</span>
    </div>
  </div>
</template>

<script>
import getReasonDictionary from '../../api/select/getReasonDictionary';
import getFollowUpLogs from '../../api/select/getFollowUpLogs';
import getInterviewTimePeriodLimit from '../../api/select/getInterviewTimePeriodLimit';
import getTrainTimePeriodLimit from '../../api/select/getTrainTimePeriodLimit';
import setInterviewOneFollowUp from '../../api/action/setInterviewOneFollowUp';
import setInterviewMultiFollowUp from '../../api/action/setInterviewMultiFollowUp';
import setTrainOneFollowUp from '../../api/action/setTrainOneFollowUp';
import setTrainMultiFollowUp from '../../api/action/setTrainMultiFollowUp';
import setEntryOneFollowUp from '../../api/action/setEntryOneFollowUp';
import setEntryMultiFollowUp from '../../api/action/setEntryMultiFollowUp';
import setTryOutOneFollowUp from '../../api/action/setTryOutOneFollowUp';
import setTryOutMultiFollowUp from '../../api/action/setTryOutMultiFollowUp';
import basicInfo from '../../api/select/basicInfo';
import fetch from '../../../src/utils/fetch';
import fixedSalaryInfoComponents from './fixedSalaryInfo';
import teaStationTag from '../config_list_station/component/teaStationTag';
import teaPostTag from '../config_list_station/teaPostTag.vue';

import openTeaInfoH5 from './components/openTeaInfo_h5.vue';
import { Tabs, TabPane } from 'element-ui';
import moment from 'moment';
import Spin from '../../../src/components/spin/spin.vue';

export default {
  components: {
    Tabs,
    TabPane,
    fixedSalaryInfoComponents,
    teaStationTag,
    teaPostTag,
    openTeaInfoH5,
    Spin,
  },
  data() {
    return {
      resultObj: {
        postCode: '',
        postVersion: '',
      },
      visibleTest: false,
      showResultDialog: false,
      postList: [],
      openteaInfo_h5: false,
      stationNumber: '',
      finalStationVisiable: false,
      teacherHeadInfo: {
        completionRatio: null,
        currentPost: null, // 当前岗位
        currentStations: [], // 符合的推荐岗位清单
        permitAppoint: null,
        recommendStation: null,
        resultStation: null, 
        resultStationStr:null, // 当前使用的推荐岗位
        stationFit: null,
        teacherLevelDescription: null,
        trainTheme: null,
        trainTime: null,
      },
      currentStationList: [],
      currentStationNameList: [],
      currentPostStation: {
        postName: '',
      },
      form: {
        followUpResult: '1',
        date: '',
        subDate: '',
        subTrainDate: '',
        interviewDate: '',
        followUpReason: '',
        obsoleteReason: '',
        giveUpReason: '',
        remarks: '',
        connectResult: '',
        connectDate: '',
        trainDate: '',
        teaId: '',
        teaIds: [],
        goingRecycle: false,
      },
      completionRatio: '',
      interViewDateTime: {
        // 面试的时间，因需求拆分
        day: '',
        time: '',
      },
      tableData: [],
      isShow: false,
      tipContent: '',
      judgeVal: '',
      followUpOptions: [],
      obsoleteOptions: [],
      giveUpOptions: [],
      options: {
        groupCode: 'followUpReason',
      },
      maxlength: 15,
      clearable: false,
      activeName: 'first',
      teaBU: '',
      interviewedTimeOptions: [],
      timePeriodCount: {},
      tipTrain: {
        count: '数据加载中...',
        limit: '数据加载中...',
        time: 0,
        bLimit: false,
      },
      pickerDateOptions: {
        disabledDate: time => {
          const date = new Date(time);
          let isD = false;
          if (this.timePeriodCount.targetDate) {
            const m = new Date(this.timePeriodCount.targetDate);
            if (
              date.getFullYear() === m.getFullYear() &&
              date.getMonth() === m.getMonth() &&
              this.timePeriodCount.timePeriodCountDtoList.length
            ) {
              this.timePeriodCount.timePeriodCountDtoList.forEach(item => {
                if (item.target === date.getDate()) {
                  isD = !item.canAppoint;
                }
              });
            }
          }
          return isD;
        },
      },
      timeLoading: false,
    };
  },
  props: [
    'interviewStateStr',
    'followName',
    'tabState',
    'currentID',
    'cipherTId',
    'trainTimeProps',
    'interviewTimeProps',
    'trainResultTypeStr',
    'salaryStatus',
    'bu',
  ],
  watch: {
    interviewStateStr(newVal, oldVal) {
      if (this.tabState === '面试管理') {
        this.interviewStateStr === '待培训通知'
          ? [(this.form.followUpResult = '2'), (this.judgeVal = '2')]
          : this.interviewStateStr === '待预约培训' ||
            this.interviewStateStr === '培训延期' ||
            this.interviewStateStr === '培训不通过'
          ? [(this.form.followUpResult = '2'), (this.judgeVal = '2')]
          : [(this.form.followUpResult = '1'), (this.judgeVal = '1')];
        this.options.groupCode = 'followUpReason';
        this.interviewStateStr === '批量操作' &&
          (this.form.followUpResult = '3');
      }
      if (this.tabState === '培训管理') {
        this.form.connectResult = '5';
        this.judgeVal = '5';
        this.options.groupCode = 'obsoleteReasonOfTrain';
      }
      if (this.tabState === '入职管理') {
        this.form.connectResult = '5';
        this.judgeVal = '5';
        this.options.groupCode = 'obsoleteReasonOfEntry';
      }
      if (this.tabState === '试用期管理') {
        this.form.connectResult = '6';
        this.judgeVal = '6';
        this.options.groupCode = 'giveUpReason';
        this.isShow = true;
        this.tipContent = '选择主动放弃，该老师将自动进入回收站';
      }
      this.setSubTrainDateDate();
    },
    interViewDateTime: {
      handler(val) {
        let day,
          time,
          dateStr = '';
        if (val.day && !val.time) {
          day = this.$DateTransform(+new Date(val.day)).split(' ')[0];
          this.handleChangeDate(day);
        }

        if (val.day && val.time) {
          day = this.$DateTransform(+new Date(val.day)).split(' ')[0];
          time = val.time + ':00';
          dateStr = day + ' ' + time;
          this.handleChangeDate(dateStr);
        }

        if (!val.day) {
          this.form.interviewDate = '';
        }
      },
      deep: true,
    },
    'form.subTrainDate': async function(val) {
      // 培训时间 改变。如果月份变化需要拉取数据
      this.getTrainTimePeriodLimit(val);
    },
  },
  created() {
    console.log('followUp.vue')
    this.initInterviewState();
    this.setSubTrainDateDate();
  },
  methods: {
    handleClickDay(e) {
      setTimeout(async () => {
        const head = this.$refs.datePicker.popperElm.getElementsByClassName(
          'el-date-picker__time-header'
        )[0];
        const inptBox = head.getElementsByClassName(
          'el-date-picker__editor-wrap'
        );
        const date = inptBox[0].getElementsByTagName('input')[0];
        const time = inptBox[1].getElementsByTagName('input')[0];
        await this.getTrainTimePeriodLimit(`${date.value} ${time.value}`);
      });
    },
    handleAddLimitBox() {
      const p = this.$refs.datePicker.popperElm.getElementsByClassName(
        'el-picker-panel__footer'
      )[0];
      const tipTrainBox = p.getElementsByClassName('tip-train-box')[0];
      // 添加点击日期天数事件
      const chil = this.$refs.datePicker.popperElm.getElementsByClassName('el-date-table')[0];
      const available = chil.getElementsByTagName('td');
      for (let i = 0; i < available.length; i++) {
        available[i].removeEventListener('click', this.handleClickDay, false);
        available[i].addEventListener('click', this.handleClickDay, false);
      }
      // 如果存在元素则不需要重复添加
      if (tipTrainBox) return;
      this.$refs.tipTrain.style.opacity = 1;
      p.appendChild(this.$refs.tipTrain);
    },
    // 每个日期元素添加点击事件
    handleFocusTrainDate() {
      setTimeout(() => {
        this.handleAddLimitBox();
      }, 0);
    },
    // 培训时间 改变。如果月份变化需要拉取数据
    async getTrainTimePeriodLimit(val) {
      this.timeLoading = true
      if (val && this.judgeVal === '2') {

        const str = moment(val).format('YYYY-MM-DD HH:mm:ss');
        const t = new Date(val);
        const months = t.getMonth() + 1;

        if (
          !this.timePeriodCount.targetDate ||
          new Date(this.timePeriodCount.targetDate).getMonth() + 1 !== months
        ) {
          const res = await getTrainTimePeriodLimit({
            targetMonth: str,
            teaId: parseInt(this.currentID),
          });
          this.timePeriodCount = res || {};
        }
        this.filterTipTrainIfo(str);
      }
      this.timeLoading = false;
    },
    filterTipTrainIfo(time) {
      if (this.timePeriodCount.targetDate && time) {

        const m = new Date(this.timePeriodCount.targetDate);
        const m2 = new Date(time);

        if (
          m.getMonth() === m2.getMonth() &&
          this.timePeriodCount.timePeriodCountDtoList.length
        ) {
          const day = m2.getDate();
          this.timePeriodCount.timePeriodCountDtoList.forEach(item => {
            if (item.target === day) {
              this.tipTrain.count = item.count;
              this.tipTrain.limit = item.limit;
              this.tipTrain.bLimit = (item.count / item.limit) >= 0.9;
            }
          });
        }
      }
      this.tipTrain.time = time.split(' ')[0];
    },
    saveStatus() {
      if (!this.fixedSalaryInfo) return;
      if (this.fixedSalaryInfo.fixedSalaryState == 2) this.headleState = true;
    },
    //校验岗位
    handleValidateStation() {
      return fetch({
        url: `/api/teacherPost/validate`,
        method: 'get',
        params: {
          teaId: this.currentID,
        },
      });
    },
    confirmResult() {
      if (this.resultObj.postCode == 'again') {
        this.showResultDialog = false;
        this.$emit('openBasicMessageComp');
      } else {
        this.resultObj.postVersion = this.postList.filter(i => {
          return i.postCode == this.resultObj.postCode;
        })[0].postVersion;
        fetch({
          url: `/api/teacherPost/changePost`,
          method: 'get',
          params: {
            teaId: this.currentID,
            postCode: this.resultObj.postCode,
            postVersion: this.resultObj.postVersion,
          },
        }).then(res => {
          this.showResultDialog = false;
          this.activeName = 'second';
          this.$refs.fixedSalaryInfoComponents.TabHandleClick('second', {
            teaId: this.currentID,
          });
          this.getHeadInfo();
        });
      }
    },
    openBasicMessageComp() {
      this.$emit('openBasicMessageComp');
    },
    openCompletionRatio() {
      this.openteaInfo_h5 = true;
      this.$nextTick(() => {
        this.$refs.openTeaInfoH5.init();
      });
    },
    handleRecommend(obj) {
      this.$refs.teaStationTag.init('show', obj, true);
    },
    handleCurrentPostStation(obj) {
      this.$refs.teaPostTag.init('show', obj);
    },
    getInterviewNum() {
      if (this.tabState === '面试管理' && this.judgeVal === '1' && this.interviewStateStr !== '批量操作') {
        getInterviewTimePeriodLimit({
          targetDate: this.form.interviewDate + ' 00:00:00',
          teaId: parseInt(this.currentID),
        }).then(res => {
          this.interviewedTimeOptions = res.timePeriodCountDtoList || [];
        });
      }
    },
    setSubTrainDateDate() {
      // 设置默认面试的时间
      if (this.tabState === '面试管理' && this.judgeVal === '1') {
        this.form.date = this.interviewTimeProps || this.getNextTuesday(true);
        // 设置默认面试默认日期
        this.form.interviewDate = this.form.date.split(' ')[0];
        this.interViewDateTime.day = this.form.date.split(' ')[0];
        this.interViewDateTime.time = '';
      }
      // 设置默认培训的时间
      if (
        this.tabState === '面试管理' &&
        (this.judgeVal === '2' || this.judgeVal === '3')
      ) {
        this.form.subTrainDate = this.trainTimeProps || this.getNextTuesday();
        this.form.trainDate = this.trainTimeProps || this.getNextTuesday();
      }
      // 设置默认培训的时间
      if (
        this.tabState === '培训管理' &&
        this.trainResultTypeStr == '延期培训' &&
        this.judgeVal === '2'
      ) {
        this.form.subTrainDate = this.getNextTuesday();
        this.form.trainDate = this.getNextTuesday();
      }
      // 设置默认培训的时间
      if (this.tabState === '面试管理' && this.judgeVal === '4') {
        this.form.subDate = this.getNextTuesday(true);
        this.form.connectDate = this.getNextTuesday(true);
      }

      this.activeName = 'first'; // 默认跟进结果
    },
    // 获取下周二或者获取次日
    getNextTuesday(nextDay = false) {
      let Stamp;
      Stamp = new Date();
      let num;
      if (!nextDay) {
        num = 7 - Stamp.getDay() + 2;
      } else {
        num = 1;
      }
      Stamp.setDate(Stamp.getDate() + num);

      let year = Stamp.getFullYear();
      let month = Stamp.getMonth() + 1;

      let mvar = month < 10 ? '0' + month : month + '';

      let day = Stamp.getDate();
      let dvar = day < 10 ? '0' + day : day + '';
      if (this.bu == 1) {
        return `${year}-${mvar}-${dvar} 09:30:00`;
      } else {
        return `${year}-${mvar}-${dvar} 10:00:00`;
      }
    },
    initInterviewState() {
      if (this.tabState === '面试管理') {
        this.interviewStateStr === '待培训通知'
          ? [(this.form.followUpResult = '2'), (this.judgeVal = '2')]
          : this.interviewStateStr === '待预约培训' ||
            this.interviewStateStr === '培训延期' ||
            this.interviewStateStr === '培训不通过'
          ? [(this.form.followUpResult = '2'), (this.judgeVal = '2')]
          : [(this.form.followUpResult = '1'), (this.judgeVal = '1')];
        this.tipContent = '';
        this.options.groupCode = 'followUpReason';
        this.interviewStateStr === '批量操作' &&
          (this.form.followUpResult = '3');
      }
      if (this.tabState === '培训管理' || this.tabState === '入职管理') {
        this.form.connectResult = '5';
        this.form.followUpResult = '5';
        this.judgeVal = '5';
        this.isShow = true;
        this.tipContent = '选择淘汰，该老师将自动进入回收站';
      }
      if (this.tabState === '培训管理')
        this.options.groupCode = 'obsoleteReasonOfTrain';
      if (this.tabState === '入职管理')
        this.options.groupCode = 'obsoleteReasonOfEntry';
      if (this.tabState === '试用期管理') {
        this.form.connectResult = '6';
        this.form.followUpResult = '6';
        this.judgeVal = '6';
        this.isShow = true;
        this.tipContent = '选择主动放弃，该老师将自动进入回收站';
        this.options.groupCode = 'giveUpReason';
      }
      // if (this.options.groupCode) this.getSelectList()
    },
    handleChangeState(val) {
      this.judgeVal = val;
      val === '4'
        ? [
            (this.isShow = true),
            (this.tipContent = '到了下次联系时间，系统自动置顶该老师'),
          ]
        : val === '5'
        ? [
            (this.isShow = true),
            (this.tipContent = '选择淘汰，该老师将自动进入回收站'),
          ]
        : val === '6'
        ? [
            (this.isShow = true),
            (this.tipContent = '选择主动放弃，该老师将自动进入回收站'),
          ]
        : [(this.isShow = false), (this.tipContent = '')];
      if (this.tabState === '面试管理') {
        if (val === '4') this.options.groupCode = 'followUpReason';
        if (val === '5') this.options.groupCode = 'obsoleteReason';
        if (val === '6') this.options.groupCode = 'giveUpReason';
      }
      if (this.tabState === '培训管理') {
        if (val === '4') this.options.groupCode = 'followUpReason';
        if (val === '5') this.options.groupCode = 'obsoleteReasonOfTrain';
        if (val === '6') this.options.groupCode = 'giveUpReasonOfTrain';
      }
      if (this.tabState === '入职管理') {
        if (val === '4') this.options.groupCode = 'followUpReason';
        if (val === '5') this.options.groupCode = 'obsoleteReasonOfEntry';
        if (val === '6') this.options.groupCode = 'giveUpReasonOfEntry';
      }
      if (this.options.groupCode) {
        this.getSelectList();
      }
      this.setSubTrainDateDate();
    },
    handleChangeDate(date) {
      this.form.interviewDate = date;
      this.form.connectDate = '';
      this.form.trainDate = '';
      this.getInterviewNum();
    },
    handleChangeConnectDate(date) {
      this.form.interviewDate = '';
      this.form.connectDate = date;
      this.form.trainDate = '';
    },
    handleChangeTrainDate(date) {
      this.form.interviewDate = '';
      this.form.connectDate = '';
      this.form.trainDate = date;
    },
    getSelectList() {
      getReasonDictionary(this.options).then(res => {
        if (this.options.groupCode == 'followUpReason') {
          this.followUpOptions = res;
          // 默认再次沟通 value=1
          this.form.followUpReason = '1';
        }
        if (
          this.options.groupCode === 'obsoleteReason' ||
          this.options.groupCode === 'obsoleteReasonOfEntry' ||
          this.options.groupCode === 'obsoleteReasonOfTrain'
        ) {
          this.obsoleteOptions = res;
        }
        if (
          this.options.groupCode == 'giveUpReason' ||
          this.options.groupCode == 'giveUpReasonOfTrain' ||
          this.options.groupCode == 'giveUpReasonOfEntry'
        ) {
          this.giveUpOptions = res;
        }
      });
      this.activeName = 'first'; // 默认跟进结果
      if (this.interviewStateStr !== '批量操作') {
        this.getHeadInfo();
      }
    },
    getHeadInfo() {
      fetch({
        url: '/api/teacherInfo/getTeacherHeadInfo',
        method: 'get',
        params: { teaId: this.currentID },
      })
        .then(result => {
          const data = result.data;
          const code = result.code;
          const message = result.message;

          console.log('getHeadInfo res:',result)

          if (code == 0) {
            this.teacherHeadInfo = data;
            this.currentStationList = this.teacherHeadInfo.currentStations.map(
              element => {
                return {
                  version: element.version,
                  stationNumber: element.stationNumber,
                  stationName: element.stationName,
                };
              }
            );
            this.currentStationNameList = this.teacherHeadInfo.currentStations.map(
              element => {
                return element.stationName;
              }
            );

            // currentPost（当前岗位）
            this.currentPostStation = this.teacherHeadInfo.currentPost
              ? this.teacherHeadInfo.currentPost
              : {};
          } else {
            console.log(message);
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
          // reject(err);
        });
    },
    testTrainDate() {
      if (!this.form.trainDate) {
        this.$Message({
          type: 'warning',
          message: '请选择培训时间',
        });
        return false;
      }
      const day = new Date(this.form.trainDate).getDate();
      let isAppoint = false;
      if (
        this.timePeriodCount.targetDate &&
        Array.isArray(this.timePeriodCount.timePeriodCountDtoList)
      ) {
        this.timePeriodCount.timePeriodCountDtoList.forEach(item => {
          if (item.target === day && !item.canAppoint) {
            isAppoint = true;
          }
        });
      }
      return isAppoint;
    },
    handleSave() {
      //处理预约面试后的岗位选择
      if (this.judgeVal === '1' && this.currentStationNameList.length > 0) {
        // 是否需要判断是否选择了面试时间
        // 因为面试请求接口 interviewDate 不选时分秒 不需要带 ' 00:00:00'，确定提交信息接口需要完整的时间格式
        if (
          !this.form.interviewDate ||
          this.form.interviewDate.indexOf(':') === -1
        ) {
          this.$Message({
            type: 'warning',
            message: '请选择面试时间',
          });
          return;
        }
        this.finalStationVisiable = true;
      } else {
        this.handleSaveFunc();
      }
    },
    handleSaveFunc() {
      this.finalStationVisiable = false;
      if (this.judgeVal === '1') {
        // 因为面试请求接口 interviewDate 不选时分秒 不需要带 ' 00:00:00'，确定提交信息接口需要完整的时间格式
        if (
          !this.form.interviewDate ||
          this.form.interviewDate.indexOf(':') === -1
        ) {
          this.$Message({
            type: 'warning',
            message: '请选择面试时间',
          });
          return;
        }
      }
      if (this.judgeVal === '2') {
        if (this.testTrainDate()) {
          this.$Message({
            type: 'warning',
            message: '培训时段人数已满，不可预约',
          });
          return false;
        }
      }
      if (this.judgeVal === '4') {
        if (!this.form.followUpReason) {
          this.$Message({
            type: 'warning',
            message: '请选择待跟进原因',
          });
          return;
        }
        if (this.form.followUpReason === '1' && !this.form.connectDate) {
          this.$Message({
            type: 'warning',
            message: '请选择再次联系时间',
          });
          return;
        }
      }
      if (this.judgeVal === '5') {
        if (!this.form.obsoleteReason) {
          this.$Message({
            type: 'warning',
            message: '请选择淘汰原因',
          });
          return;
        }
      }
      if (this.tabState === '面试管理') {
        if (this.interviewStateStr !== '批量操作') {
          //多岗位
          if (this.currentStationList && this.currentStationList.length > 1) {
            this.form.stationNumber = this.stationNumber;
            this.currentStationList.forEach(i => {
              if (i.stationNumber == this.stationNumber) {
                this.form.stationVersion = i.version;
                return;
              }
            });
          } else if (this.currentStationNameList.length == 1) {
            //一个岗位

            this.form.stationNumber = this.currentStationList[0].stationNumber;
            this.form.stationVersion = this.currentStationList[0].version;
          }

          this.form.teaId = this.currentID;
          setInterviewOneFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        } else {
          this.form.teaIds = this.currentID;
          setInterviewMultiFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        }
      }

      if (this.tabState === '培训管理') {
        if (this.interviewStateStr !== '批量操作') {
          this.form.subTrainDate = new Date(this.form.subTrainDate).format(
            'yyyy-MM-dd hh:mm:ss'
          );
          this.form.teaId = this.currentID;
          setTrainOneFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        } else {
          this.form.teaIds = this.currentID;

          setTrainMultiFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        }
      }

      if (this.tabState === '入职管理') {
        if (this.interviewStateStr !== '批量操作') {
          this.form.teaId = this.currentID;
          setEntryOneFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        } else {
          this.form.teaIds = this.currentID;
          setEntryMultiFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        }
      }

      if (this.tabState === '试用期管理') {
        if (this.interviewStateStr !== '批量操作') {
          this.form.teaId = this.currentID;
          setTryOutOneFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        } else {
          this.form.teaIds = this.currentID;
          setTryOutMultiFollowUp(this.form)
            .then(message => {
              this.$Message(
                {
                  type: 'success',
                  message,
                },
                this.$emit('confirm')
              );
            })
            .catch(message => {
              this.$Message({
                type: 'error',
                message,
              });
            });
        }
      }
      this.handleReset();
    },
    confirmFinalPost(){
      // 从 handleSaveFunc copy更改
      // 确认最终岗位，没有选择岗位不让确认
      if(!this.stationNumber) {
        this.$Message({
          type: 'error',
          message:'请选择最终使用的推荐岗位！',
        });
        return
      }
      // 
      if(this.currentStationList) {
        // 从选择的岗位radio中查找匹配
        this.form.stationNumber = this.stationNumber;
        this.currentStationList.forEach(i => {
          if (i.stationNumber == this.stationNumber) {
            this.form.stationVersion = i.version;
            return;
          }
        });
      }

      this.form.teaId = this.currentID;
      setInterviewOneFollowUp(this.form)
        .then(message => {
          this.$Message(
            {
              type: 'success',
              message,
            },
          );
          // 关闭确认最终确认岗位弹框
          this.$emit('confirm')
          this.finalStationVisiable = false
        })
          .catch(message => {
            this.$Message({
              type: 'error',
              message,
            });
          });
    },
    async getLogs() {
      getFollowUpLogs({ teaId: this.currentID }).then(res => {
        this.tableData = res;
      });
      let user = await basicInfo({ teaId: this.cipherTId });
      if (!user) return;
      this.teaBU = user.teaBu;

      this.getInterviewNum();
    },
    handleConfirm() {
      this.handleSave();
    },
    handleCancel() {
      this.$emit('cancel');
      this.handleReset();
    },
    handleReset() {
      this.form = {
        ...this.form,
        date: '',
        subTrainDate: '',
        subDate: '',
        interviewDate: '',
        followUpReason: '',
        obsoleteReason: '',
        giveUpReason: '',
        remarks: '',
        connectDate: '',
        trainDate: '',
        teaId: '',
        teaIds: [],
        goingRecycle: false,
        stationNumber: '',
        stationVersion: '',
      };
      // 重新设置时间
      this.setSubTrainDateDate();
    },
    handleBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName == 'first') {
        return new Promise((resolve, reject) => {
          fetch({
            url: '/api/teacherPost/validate',
            method: 'get',
            params: { teaId: this.currentID },
          })
            .then(result => {
              const data = result.data;
              const code = result.code;
              const message = result.message;
              if (code == 0) {
                if (!data.matched) {
                  this.showResultDialog = true;
                  this.postList = data.matchedPosts;
                  reject();
                } else {
                  this.$refs.fixedSalaryInfoComponents.TabHandleClick(
                    'second',
                    {
                      teaId: this.currentID,
                    }
                  );
                  resolve();
                }
              } else {
                console.log(message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        });
      } else {
        this.$refs.fixedSalaryInfoComponents.TabHandleClick('second', {
          teaId: this.currentID,
        });
        return true;
      }
    },
    // 获取定薪
    async TabHandleClick(val) {
      this.$refs.fixedSalaryInfoComponents.TabHandleClick(val, {
        teaId: this.currentID,
      });
    },
  },
  destroyed() {
    this.interViewDateTime.day = '';
    this.interViewDateTime.time = '';
  },
};
</script>

<style lang="less">
.el-date-picker.has-time {
  width: 324px;
}
.el-picker-panel {
  .tip-train-box {
    position: absolute;
    top: 6px;
    left: 6px;
    text-align: left;
    color: rgb(71, 141, 1);
    .tip-train-icon-arrow {
      color: rgba(0,0,0,0.8);
      position: absolute;
      top: -6px;
    }
    .red{
      color: red;
    }
    .mt10 {
      margin-top: 10px;
    }
    .el-icon-close {
      font-size: 12px;
      position: absolute;
      top: 10px;
      right: 10px;
      font-weight: initial;
    }
  }
}

.followUp {
  .el-tabs__item {
    &:focus {
      outline: none;
    }
  }
  .el-dialog--small {
  }
  .openteaInfo_h5 {
    width: 30%;
  }
  .topTitle {
    position: absolute;
    width: 90%;
    padding-left: 15px;
    top: 10px;
    &.border {
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;
    }
    span {
      &:not(:first-child) {
        margin-right: 20px;
      }
    }
    .span1 {
      display: inline-block;
      font-size: 22px;
      font-weight: bold;
      text-align: end;
    }
    .span2 {
    }
    .span3 {
    }
  }

  .el-tabs__nav-wrap {
    box-shadow: 0 19px 11px -15px rgba(0, 0, 0, 0.1);
    .el-tabs__nav-scroll {
      border-bottom: 1px solid #eeeeee;
      .el-tabs__nav {
        .el-tabs__item {
          padding: 0 35px 0 0;
        }
      }
    }
  }
  .tip-train-box {
    opacity: 0;
  }
  .blue {
    color: #30aede;
  }
}

.finalStation {
  .el-radio {
    margin: 15px 0;
    display: block;
  }
  .fade-enter-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
.el-form-item {
  margin-bottom: 15px;
}
.record {
  width: 100%;
}
.record > p {
  width: 95%;
  // margin-left: 5%;
  margin-bottom: 30px;
  padding-bottom: 20px;
  // border-bottom: 1px solid #797671;
}
.tip {
  margin-left: 5%;
  margin-bottom: 15px;
  color: #999999;
}
.buttonGroup {
  text-align: right;
  margin: 40px 0;
}

// 确认最终使用岗位dialog样式
.followup-dialog{
  .el-dialog__body{
    background: #fff !important;
  }

  .el-dialog__footer{
    background: #fff !important;
  }

  // 内容区域高度
  .finalStation{
    max-height: 700px;
    overflow: auto;
    // 修复选择radio区域，偶现出现横向滚动条的问题
    overflow-x: hidden;

    .final-radio-top0{
      margin-top: 0px !important;
    }
  }
}
</style>
