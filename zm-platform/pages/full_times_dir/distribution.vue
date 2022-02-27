<template>
  <div class="full-time-container" v-if="permission">
    <!-- 用户信息悬浮框 -->
    <zm-hover ref="popover1">
      <template scope="props">
        <template v-if="!props.data">
          <el-row style="text-align: center;color: black;line-height: 50px;">
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
              <div>QQ：{{ !!props.data ? props.data.qq : '' }}</div>
              <div>
                毕业时间：{{ !!props.data ? props.data.graduatedYear : '' }}
              </div>
              <div>
                学校等级：{{ !!props.data ? props.data.collegeLevel : '' }}
              </div>
              <div v-if="props.data.teaBu != '3'">
                教师资格证：{{
                  props.data.teacherCertificate | certificateTypeFilter
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
              <div>毕业院校：{{ !!props.data ? props.data.college : '' }}</div>
              <div v-if="props.data.teaBu != '3'">
                所在分区：{{ !!props.data ? props.data.teaRegion : '' }}
              </div>
            </div>
          </div>
        </template>
        <!-- {{ !!props.data ? props.data.subject : '' }} -->
      </template>
    </zm-hover>
    <!--条件搜索框-->
    <el-form :inline="true" :model="search_data" class="search-form">
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
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="笔试状态">
              <el-select v-model="search_data.testStatus" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="未提交" value="1"></el-option>
                <el-option label="已提交" value="2"></el-option>
              </el-select>
            </el-form-item> -->
      <el-form-item label="工作性质">
        <el-select v-model="search_data.timeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科目">
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
      <el-form-item label="年级">
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
      <el-form-item label="报名时间">
        <el-date-picker
          :editable="false"
          v-model="searchApplyDateArea"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          @change="chooseApplyDate"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input
          ID="preTrainingKeyWords"
          v-model="search_data.keyWord"
          placeholder="输入姓名或手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="最新推荐人">
        <el-input
          v-model="search_data.teaReferKeywords"
          placeholder="推荐人姓名/手机号精准查询"
        ></el-input>
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
      <el-button
        ID="preTrainingSearchBtn"
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
          v-if="checkPermission('unassgin-export')"
          >导出Excel</el-button
        >
        <el-button
          size="small"
          :loading="distributionImmediatelyLoading"
          @click="distributionImmediately()"
          type="text"
          v-if="checkPermission('unassgin-now-assgin')"
          >立即分配</el-button
        >
        <el-button
          size="small"
          @click="distributionRoster()"
          type="text"
          v-if="checkPermission('unassgin-hand-assgin')"
          >名单分配</el-button
        >
        <el-button
          size="small"
          @click="ImportExcel()"
          type="text"
          v-if="checkPermission('teacher-upload')"
          >导入Excel</el-button
        >

        <span class="table-title">共{{ table_data_total }}个老师</span>
      </div>
      <!--列表-->
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
              @mouseenter.native="getTeaSimpleMessage(scope.row.teaId)"
              :MES="scope.row.teaId"
              v-hover="{ ref: $refs.popover1 }"
              size="small"
              type="text"
              @click="
                userDetail(scope.row)
              "
              >{{ scope.row.name }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="qq" align="center" label="QQ" width="100">
        </el-table-column>
        <el-table-column prop="teaWeixin" align="center" label="微信">
        </el-table-column>
        <el-table-column prop="teaBu" align="center" label="所属BU">
          <template scope="scope">
            {{ scope.row.teaBu | teaBuFilter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="interviewStateStr"
          align="center"
          label="老师状态"
        >
        </el-table-column>
        <el-table-column prop="teaReferMobile" align="center" label="推荐人">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click="getReferMobile(scope.row)"
              class="detailsBtn"
              v-if="scope.row.teaReferMobile && !scope.row.currentRow"
              >点击查看信息</el-button
            >
            <span v-show="scope.row.currentRow">{{
              scope.row.teaReferMobile
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="teaReferName"
          align="center"
          label="推荐人姓名"
          width="200"
        >
        </el-table-column>

        <el-table-column
          prop="applyTime"
          align="center"
          label="报名时间"
          width="200"
        >
        </el-table-column>
      </el-table>
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
    <!--用户详情框-->
    <el-dialog
      :title="selectTableText"
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
            :entry-info-enable="1"
            :name="userDetailName"
            :prodata="proData"
            :bu="bu"
            :viewState="userDetailDialog"
            :currentID="userDetailId"
            :cipherTId="cipherTId"
            @cancel="closeUserDetailDialog"
            @confirm="confirmUserDetailDialog"
            class="mg-20"
            :base-info="userDetailData"
            :teaStatue="0"
            :eduBackData="eduBackData"
          ></basic-message>
        </el-tab-pane>
        <el-tab-pane label="实名记录" name="two">
          <identify-records
            :userDetailDataIdentifyRecords="userDetailDataIdentifyRecords"
          ></identify-records>
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="historyRecord">
          <history-record :historyRecord="historyRecord"></history-record>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      title="名单分配"
      v-model="nameConfig.nameConfigDialog"
      size="small"
      class="showAdd"
      @close="closeNameConfigDialog"
    >
      <div class="content" style="font-size:14px;">
        <div class="_head">
          待分配名单：<br />
          <el-row>
            <el-col style="text-align:center;" :span="8"
              >掌门1对1:{{ nameConfig.count.one }}</el-col
            >
            <el-col style="text-align:center;" :span="8"
              >掌门少儿:{{ nameConfig.count.two }}</el-col
            >
            <el-col style="text-align:center;" :span="8"
              >掌门陪练:{{ nameConfig.count.three }}</el-col
            >
          </el-row>
        </div>
        <div class="item">
          分配专员：<br />
          <el-row>
            <el-col style="text-align:center;" :span="8">
              <div class="item_content_item">
                <input
                  v-model="nameConfig.butype.one"
                  class="dragCheck"
                  type="checkbox"
                />
                <span>掌门1对1</span>
                <div class="mask" @click="changeItemState(1)"></div>
              </div>
            </el-col>
            <el-col style="text-align:center;" :span="8">
              <div class="item_content_item">
                <input
                  v-model="nameConfig.butype.two"
                  class="dragCheck"
                  type="checkbox"
                />
                <span>掌门少儿</span>
                <div class="mask" @click="changeItemState(2)"></div>
              </div>
            </el-col>
            <el-col style="text-align:center;" :span="8">
              <div class="item_content_item">
                <input
                  v-model="nameConfig.butype.three"
                  class="dragCheck"
                  type="checkbox"
                />
                <span>掌门陪练</span>
                <div class="mask" @click="changeItemState(3)"></div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="search_item">
          <div>
            <span>姓名：</span>
            <el-input
              class="search_input"
              placeholder="请输入姓名"
              v-model="name"
            >
            </el-input>
          </div>
          <div>
            <span>手机号：</span>
            <el-input
              class="search_input"
              placeholder="请输入手机号"
              v-model="mobile"
            >
            </el-input>
          </div>
          <div>
            <el-button type="primary" @click="setNameConfig">查询</el-button>
          </div>
        </div>
        <br />
        <div
          class="_content"
          style="width:100%;max-height:300px;min-height:150px;margin-top:20px;overflow-y:auto;"
        >
          <div
            v-for="(item, index) in nameConfig.data"
            :key="index"
            class="_item"
            style="margin:5px;"
          >
            <input v-model="item.select" type="checkbox" name="" value="" />
            {{ item.commissionerName }}
            {{ item.commissionerMobile }}
            <span class="input-panel">
              <input
                v-for="(_item, _index) in item.buConfigs"
                :key="_index"
                :placeholder="getplaceholdertext(_item.bu)"
                type="text"
                name=""
                v-model="_item.averageUserConfig"
                class="input"
              />
            </span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span class="distribution-type-block">
          <span class="distribution-type">分配类型</span>
          <el-select v-model="nameConfig.assginType">
            <el-option label="渠道分配" value="1"></el-option>
            <el-option label="转介绍" value="2"></el-option>
          </el-select>
        </span>

        <el-button @click="closeNameConfigDialog">取 消</el-button>
        <el-button
          :loading="nameConfigState"
          type="primary"
          @click="configsSetting()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">
    没有该模块权限，请联系相关负责人为你添加
  </div>
</template>

<script>
import hover from '../../../src/directives/hover';
import { deepCopy } from '../../../src/utils/assist';
import interviewRecords from '../userInfoItems/interview_records';
import trainingRecords from '../userInfoItems/training_records';
import basicMessage from '../userInfoItems/basic_message';
import identifyRecords from '../userInfoItems/identify_records';
import teaMesAudit from '../dialog/tea_mes_audit';
import writtenRecord from '../userInfoItems/written_record';
import testInfo from '../../api/select/testInfo';
import orderRecord from '../userInfoItems/order_record';
import basicInfo from '../../api/select/basicInfo';
import getEduBack from '../../api/select/getEduBack';
import getUnAssignTeachers from '../../api/select/getUnAssignTeachers';
import getTeaSummary from '../../api/select/getTeaSummary';
import getInterviewRecords from '../../api/select/getInterviewRecords';
import getTrainingRecords from '../../api/select/getTrainingRecords';
import getHandAssignInfo from '../../api/select/getHandAssignInfo';
import getProvinces from '../../api/select/getProvinces';
import handAssign from '../../api/action/handAssign';
import getSubject from '../../api/select/getSubject';
import getPhase from '../../api/select/getPhase';
import distributionServiceExport from '../../api/action/distributionServiceExport';
import distributionImmediately from '../../api/action/distributionImmediately';
import historyRecordMixin from './historyRecordMixin';
import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo';
import { getTeaCertificateList } from '../../api/select/getTeaCertificate';

export default {
  mixins: [historyRecordMixin],
  data() {
    return {
      requestTeaSecretState: false, //表示是否在请求教师信息
      requestTeaSecretTime: 10,
      requestTeaSecretInterval: null,
      teaCerOptions: [], // 教师资格状态列表
      nameConfigState: false,
      basesubjectlist: [],
      userDetailDialog: false, // 个人信息弹出框控制
      userDetailTabNumber: 'first', //个人信息弹出框tab索引
      userDetailId: '', //个人信息弹出框用户ID
      cipherTId: '', // 老师密文ID
      userDetailName: '', //个人信息弹出框用户名
      userDetailMobile: '', //个人信息弹出框用户手机号
      userDetailData: {}, //个人信息弹出框-基本信息
      eduBackData: {}, //教育背景
      userDetailDataPlus: [], //个人信息弹出框-笔试信息
      userDetailDataReserveRecords: [], //个人信息弹出框-预约记录
      userDetailDataReviewRecords: [], //个人信息弹出框-面试记录
      userDetailDataTrainingRecords: [], //个人信息弹出框-培训记录
      userDetailDataIdentifyRecords: [], //个人信息弹出框-实名记录
      distributionImmediatelyLoading: false,
      phaseList: [], //学段
      basesubList: [],
      //导出条件
      exportOptions: {},
      searchApplyDateArea: [],
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
      nameConfig: {
        nameConfigDialog: false,
        count: {
          one: 0,
          two: 0,
          three: 0,
        },
        butype: {
          one: true,
          two: true,
          three: true,
        },
        loading: false,
        data: [],
        assginType: '1', // 分配类型
      },
      mobile: '',
      name: '',
      // 搜素字段
      search_data: {
        teaBu: '',
        testStatus: '',
        timeType: '',
        applyGradeCode: '',
        applySubjectCode: '',
        startApplyTime: '', //报名开始时间
        endApplyTime: '', //报名结束时间
        trainTime: '',
        teaReferMobile: '', //推荐人
        certificateType: '', //教师资格证
        keyWord: '',
        pageNo: 1,
        pageSize: 10,
      },
      // 初始table数据
      table_data: [],
      tableLoading: true,
      table_data_total: 0,
      // 被选择的用户
      selectName: [],
      currentID: null,
      //教师简介信息
      teaSimpleMessage: {},
      bu: '',
      //状态控制
      selectTableText: '个人基本信息-基本信息',
      //列表渲染状态判断
      listDataRenderState: true,
      proData: [],
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
    // 获取手机号信息
    getReferMobile(row) {
      let elementList = document.querySelectorAll('.detailsBtn');
      for (let i = 0; i < elementList.length; i++) {
        elementList[i].innerText = '点击查看信息';
      }
      let parm = {
        teaId: row.teaId,
        infoType: 'referMobile',
      };
      row.teaReferMobile = '正在查询...';
      getTeacherSecretInfo(parm)
        .then(data => {
          row.teaReferMobile = data;
          row.currentRow = true;
        })
        .catch(message => {
          row.teaReferMobile = '消息不存在';
          row.currentRow = true;
          this.$Message({
            message,
          });
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
    // 选择报名范围
    chooseApplyDate() {
      if (this.searchApplyDateArea[0] == null) {
        this.search_data.startApplyTime = '';
        this.search_data.endApplyTime = '';
      } else {
        let sDate = new Date(this.searchApplyDateArea[0]).getTime();
        let eDate = new Date(this.searchApplyDateArea[1]).getTime();
        this.search_data.startApplyTime =
          this.$DateTool.format(sDate, 'yyyy-MM-dd') + ' 00:00:00';
        this.search_data.endApplyTime =
          this.$DateTool.format(eDate, 'yyyy-MM-dd') + ' 23:59:59';
      }
    },
    initPhase() {
      this.search_data.applyGradeCode = '';
      this.phaseList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getPhase(parm)
        .then(data => {
          this.phaseList = data.children;
        })
        .catch(message => {});
    },
    initSubject() {
      this.search_data.applySubjectCode = '';
      this.basesubList = [];
      let parm = {};
      if (this.search_data.teaBu != '') {
        parm.bu = this.search_data.teaBu;
      }
      getSubject(parm)
        .then(data => {
          this.basesubList = data.children;
        })
        .catch(message => {});
    },
    buChnage() {
      this.initPhase();
      this.initSubject();
    },
    configsSetting() {
      let oneTotal = 0,
        twoTotal = 0,
        threeTotal = 0,
        _data = this.nameConfig.data,
        len = this.nameConfig.data.length,
        item = null,
        error = '',
        parm = [];
      for (let i = 0; i < len; i++) {
        item = _data[i];
        if (item.select) {
          let oneCount = 0,
            twoCount = 0,
            threeCount = 0;
          for (let j = 0; j < item.buConfigs.length; j++) {
            parm.push({
              commissionerId: item.id,
              bu: item.buConfigs[j].bu,
              averageUserConfig: item.buConfigs[j].averageUserConfig,
            });
            if (item.buConfigs[j].bu == '1') {
              oneCount = item.buConfigs[j].averageUserConfig;
            }
            if (item.buConfigs[j].bu == '2') {
              twoCount = item.buConfigs[j].averageUserConfig;
            }
            if (item.buConfigs[j].bu == '3') {
              threeCount = item.buConfigs[j].averageUserConfig;
            }
          }
          if (isNaN(oneCount) || isNaN(twoCount) || isNaN(threeCount)) {
            error = '存在非数字';
            break;
          } else {
            oneTotal = oneTotal + parseInt(oneCount);
            twoTotal = twoTotal + parseInt(twoCount);
            threeTotal = threeTotal + parseInt(threeCount);
          }
        }
      }

      if (error != '') {
        this.$Message({
          message: error,
        });
        return;
      }
      if (oneTotal > this.nameConfig.count.one) {
        this.$Message({
          message: '1对1个数溢出',
        });
        return;
      }
      if (twoTotal > this.nameConfig.count.two) {
        this.$Message({
          message: '少儿个数溢出',
        });
        return;
      }
      if (threeTotal > this.nameConfig.count.three) {
        this.$Message({
          message: '陪练个数溢出',
        });
        return;
      }
      let _parm = {
        teacherIds: this.selectName,
        assginInfo: parm,
        assginType: this.nameConfig.assginType,
      };
      this.nameConfigState = true;
      handAssign(_parm)
        .then(data => {
          this.nameConfigState = false;
          this.$Message({
            message: '操作成功',
          });
          this.closeNameConfigDialog();
          this.getTableData();
        })
        .catch(message => {
          this.nameConfigState = false;
          this.$Message({
            message,
          });
        });
    },
    changeItemState(val) {
      if (val == 1) {
        this.nameConfig.butype.one = !this.nameConfig.butype.one;
      }
      if (val == 2) {
        this.nameConfig.butype.two = !this.nameConfig.butype.two;
      }
      if (val == 3) {
        this.nameConfig.butype.three = !this.nameConfig.butype.three;
      }
      this.setNameConfig();
    },
    closeNameConfigDialog() {
      this.nameConfig = {
        nameConfigDialog: false,
        count: {
          one: 0,
          two: 0,
          three: 0,
        },
        butype: {
          one: true,
          two: true,
          three: true,
        },
        loading: false,
        data: [],
        assginType: '',
      };
      this.name = '';
      this.mobile = '';
    },
    checkPermission(permissionName) {
      return (
        (this.$store.getters.permissionList || []).indexOf(permissionName) > -1
      );
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
    // 获取表单数据
    getTableData() {
      !!this.$parent.getOverview ? this.$parent.getOverview() : null; //更新tab数据
      this.tableLoading = true;
      getUnAssignTeachers(this.search_data)
        .then(data => {
          this.listDataRenderState = false;
          this.table_data = data.list;
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
    setNameConfig() {
      this.nameConfig.loading = true;
      this.nameConfig.data = [];
      this.nameConfig.assginType = '1';
      let parm = {
        teacherIds: this.selectName,
        name: this.name,
        mobile: this.mobile,
      };
      let bu = [];
      if (this.nameConfig.butype.one) {
        bu.push(1);
      }
      if (this.nameConfig.butype.two) {
        bu.push(2);
      }
      if (this.nameConfig.butype.three) {
        bu.push(3);
      }
      parm.bu = bu;
      getHandAssignInfo(parm)
        .then(data => {
          if (data.assginBuInfo) {
            for (let i = 0; i < data.assginBuInfo.length; i++) {
              if (data.assginBuInfo[i].bu == '1') {
                this.nameConfig.count.one = data.assginBuInfo[i].unAssignCount;
              }
              if (data.assginBuInfo[i].bu == '2') {
                this.nameConfig.count.two = data.assginBuInfo[i].unAssignCount;
              }
              if (data.assginBuInfo[i].bu == '3') {
                this.nameConfig.count.three =
                  data.assginBuInfo[i].unAssignCount;
              }
            }
          }

          this.nameConfig.data = this.translateNameConfigData(
            data.commissioner ? data.commissioner : []
          );
        })
        .catch(message => {
          this.$Message({
            message: message,
          });
          this.nameConfig.loading = false;
        });
    },
    translateNameConfigData(data) {
      let _data = data;
      for (let i = 0; i < _data.length; i++) {
        _data[i].select = false;
      }
      return _data;
    },
    getplaceholdertext(val) {
      if (val == '1') {
        return '1对1名单数';
      }
      if (val == '2') {
        return '少儿名单数';
      }
      if (val == '3') {
        return '陪练名单数';
      }
      return '';
    },
    // 转化时间格式
    transformDate(row, column) {
      return this.$DateTransform(row[column.property]);
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
      this.bu = teaBu;
      this.cipherTId = cipherTId;
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
    },
    // 关闭用户详情弹窗
    closeUserDetailDialog() {
      this.userDetailDialog = false;
      this.userDetailTabNumber = 'first';
      this.userDetailData = {};
      this.eduBackData = {};
      this.userDetailDataPlus = [];
      this.userDetailDataReserveRecords = [];
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
      if (tab.index == 1) {
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
      if (tab.index == 2) {
        this.handleGetTeacherHistoryRecord(this.userDetailId);
        // getIdentifyRecords({teacherId:this.userDetailId}).then(data => {
        //     this.userDetailDataIdentifyRecords = data;
        // }).catch(message => {
        //     this.$Message({
        //         message
        //     });
        // });
      }
      if (tab.index == 3) {
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
      if (tab.index == 4) {
        getTrainingRecords({ teaId: this.userDetailId })
          .then(data => {
            this.userDetailDataTrainingRecords = data;
          })
          .catch(message => {
            this.$Message({
              message,
            });
          });
      }
    },
    distributionRoster() {
      if (this.selectName.length == 0) {
        this.$Message({
          message: '请至少选择一个老师',
        });
        return;
      }
      this.nameConfig.nameConfigDialog = true;
      this.setNameConfig();
    },
    distributionImmediately() {
      if (!this.table_data_total) {
        this.$Message({
          message: '没有查找到待分配的名单',
        });
        return;
      }
      this.$MessageBox
        .confirm(`确认进行立即分配吗？`, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.distributionImmediatelyLoading = true;
          distributionImmediately()
            .then(data => {
              this.distributionImmediatelyLoading = false;
              this.$Message({
                message: '立即分配成功',
              });
              this.getTableData();
            })
            .catch(message => {
              this.distributionImmediatelyLoading = false;
              this.$Message({
                message,
              });
            });
        })
    },
    // 导出excel
    exportExcel() {
      distributionServiceExport(this.exportOptions);
    },
    // 导入Excel
    ImportExcel() {
      this.$router.push({
        path: '/importExcel',
      });
    },
    selectTable(val) {
      let ids = [];
      val.forEach(value => {
        ids.push(value.teaId.toString());
      });
      this.selectName = ids;
    },
    //修改教师基本信息
    changeUserDetails() {},
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
    if (this.$store.getters.permission) {
      this.getTableData();
    }
  },
  mounted() {
    this.initPhase();
    this.initSubject();
    this.getProData();
    window.teaSimpleMessage = this.teaSimpleMessage;
    this.$on('search', function(val) {
      this.search_data.keyWord = val.keyWord || '';
      this.getTableData();
    });
    if (!this.permission) {
      this.$router.push({ path: '/full_times/pre_training' });
    }
    window.preTraning = this;
    // 获取教师资格状态列表
    this.getTeaCerList();
  },
  components: {
    'basic-message': basicMessage,
    'tea-mes-audit': teaMesAudit,
    'order-record': orderRecord,
    'written-record': writtenRecord,
    'interview-records': interviewRecords,
    'training-records': trainingRecords,
    'identify-records': identifyRecords,
  },
};
</script>
<style scoped>
.hover_panel {
  display: inline-block;
}
.h_p_left,
.h_p_right {
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
}
.h_p_left div,
.h_p_right div {
  padding: 5px;
}
.item_title {
  width: 100px;
  float: left;
}
.item_content {
  padding-left: 100px;
}
.item_content_item {
  position: relative;
  display: inline-block;
  width: 100px;
}
.dragCheck {
  vertical-align: middle;
  margin-top: -2px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}
.mask {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 28px;
  z-index: 1000;
  cursor: pointer;
}
._content .input {
  margin-left: 10px;
  border: 1px solid rgb(183, 166, 166);
  width: 80px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  background-color: transparent;
}
._content .input-panel {
  float: right;
}
.search_item {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 35px;
}
.search_item > div:not(:nth-child(3)) {
  width: 41%;
  margin-right: 5px;
}
.search_item > div:nth-child(3) {
  margin-left: 10px;
}
.search_item > div > span {
  display: inline-block;
  margin-right: 5px;
}
.search_item > div > .search_input {
  width: 70%;
}
.distribution-type {
  position: relative;
  margin-right: 5px;
}
.distribution-type-block {
  margin-right: 40px;
}
</style>
