<template>
  <div class="full-time-container" v-if="permission">
    <p class="alert-warning" v-if="warnRecycleNum>0"> 面试管理中有<span @click="showWarnRecycle">{{warnRecycleNum}}人</span>即将进入回收站，请务必查看和确认！
    </p>
    <el-form :inline="true" :model="search_data" style="overflow:visible;" class="search-form">
      <el-form-item label="关键词">
        <el-input v-model="search_data.teaNameOrMobile" placeholder="输入姓名或手机号"></el-input>
      </el-form-item>
      <el-form-item label="所属BU">
        <el-select @change="buChange()" v-model="search_data.teaBu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="1对1" value="1"></el-option>
          <el-option label="少儿" value="2"></el-option>
          <el-option label="陪练" value="3"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="工作性质">
          <el-select v-model="search_data.timeType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="兼职" value="0"></el-option>
              <el-option label="公校兼职" value="3"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item label="年级">
        <el-select v-model="search_data.grade" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in phaseList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科目">
        <el-select v-model="search_data.subject" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item,index) in basesubList" :key="index" :label="item.label"
                     :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="培训结果">
          <el-select v-model="search_data.trainResult" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="培训通过" :value="2"></el-option>
              <el-option label="培训延期" :value="4"></el-option>
          </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="资料状态">
          <el-select v-model="search_data.dataState" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="待提交" :value="0"></el-option>
              <el-option label="待审核" :value="1"></el-option>
              <el-option label="审核通过" :value="2"></el-option>
              <el-option label="审核不通过" :value="3"></el-option>
          </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="老师状态">
          <el-select v-model="search_data.teaState" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="待培训" :value="3"></el-option>
              <el-option label="已完善资料" :value="5"></el-option>
              <el-option label="已签协议" :value="8"></el-option>
              <el-option label="待入库" :value="9"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item label="所属学校">
        <el-input v-model="search_data.school" placeholder="输入所属学校"></el-input>
      </el-form-item>
      <el-form-item label="最新推荐人">
        <el-input  v-model="search_data.teaReferKeywords" placeholder="推荐人姓名/手机号精准查询"></el-input>
      </el-form-item>
      <el-form-item label="培训主题">
        <el-input v-model="search_data.trainTheme" placeholder="输入主题名称"></el-input>
      </el-form-item>
      <el-form-item label="培训时间">
        <el-date-picker
          v-model="trainTime"
          type="daterange"
          range-separator="至"
          placeholder="请选择培训时间段">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="教师资格证">
        <el-select v-model="search_data.certificateState" placeholder="请选择">
          <el-option v-for="(item, index) in teaCerOptions" :key="index" :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>

      <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>

    </el-form>

    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>

      <div class="table-head">
        <span class="table-title" style="color:red;"
              v-if="search_data.isPreRecycle==1">共{{table_data_total}}个老师即将被回收</span>
        <span class="table-title" v-else>共{{table_data_total}}个老师</span>
        <el-button type="text" size="small" @click="offerNotices()">发送通知</el-button>
        <el-button type="text" size="small" @click="doRecruitFollow(true,'','','','')">招师跟进</el-button>
        <el-button type="text" size="small" @click="trainList">培训列表</el-button>
        <!-- <el-button type="text" size="small" @click="openInterviewAuditSettingDialog()">修改状态</el-button> -->
      </div>

      <el-table :data="table_data" @selection-change="selectTable" @sort-change="sortChangeBtn" style="width:100%">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="姓名" fixed>
          <template scope="scope">
            <el-button size="small" type="text" @click="userDetail(scope.row)">
              {{scope.row.teaName}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属BU">
          <template scope="scope">
            {{scope.row.teaBu | teaBuFilter}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template scope="scope">
            <span @click="getTeaSecret($event, scope.row.teaId, 'mobile')" class="detailsBtn">点击查看信息</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="工作性质" >
            <template scope="scope">
                {{scope.row.timeType | timeTypeFilters}}
            </template>
        </el-table-column> -->
        <!-- <el-table-column align="center" label="老师状态" >
            <template scope="scope">
                {{scope.row.teaState | teaStateFilter}}
            </template>
        </el-table-column> -->
        <!-- <el-table-column align="center" label="培训结果">
            <template scope="scope">
                {{scope.row.trainResult | trainResultFilter}}
            </template>
        </el-table-column> -->
        <el-table-column prop="grade" align="center" label="年级">
        </el-table-column>
        <el-table-column prop="subject" align="center" label="科目">
        </el-table-column>
        <el-table-column prop="school" align="center" label="所属学校">
        </el-table-column>
        <el-table-column align="center" label="培训状态">
          <template scope="scope">
            {{scope.row.trainState | trainStateFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="trainTheme" align="center" label="培训主题">
        </el-table-column>
        <el-table-column align="center" label="培训时间" prop="appointTrainTime" sortable="custom">
        </el-table-column>
        <el-table-column align="center" label="资料状态">
          <template scope="scope">
            {{scope.row.dataState | dataStateFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="certificateState" align="center" label="教师资格证" width="120">
          <template scope="scope" >
            {{scope.row.certificateType|certificateTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="referrerName" align="center" label="推荐人姓名">
        </el-table-column>
        <el-table-column prop="referMobile" align="center" width="100px" label="推荐人手机号">
          <template scope="scope">
            <el-button type="text" size="small" @click="getReferMobile(scope.row)"
                       class="detailsBtn" v-if="scope.row.referMobile&&!scope.row.currentRow">点击查看信息</el-button>
            <span v-show="scope.row.currentRow">{{scope.row.referMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button type="text" size="small"
                       @click="doRecruitFollow(false,scope.row.teaId,scope.row.teaName,scope.row.trainState,scope.row.appointTrainTime)">
              招师跟进
            </el-button>
            <!-- <el-button size="small" @click="orderTrainTime(scope.row.teaId)" type="text">预约培训时间</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40, 100, 500]" :page-size="search_data.pageSize"
                     layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>
    </div>

    <time-remark title="预约培训时间" time-title="培训时间" remark-title="备注" :show="orderTrainTimeDialog"
                 @cancel="cancelOrderTrainTime" @confirm="confirmOrderTrainTime"></time-remark>
    <time-remark title="发送通知" select-title="通知类型" :select-data="offerNoticesData" :show="offerNoticesDialog"
                 @cancel="cancelOfferNotices" @confirm="confirmOfferNotices"></time-remark>

    <el-dialog :white="true" title="修改状态" class="parttime-cstatus-dialog" v-model="interviewAuditSettingDialog"
               size="small" @close="cancelInterviewAuditSettingDialog">
      <el-form :model="partTimeTeacherStateForm" class="parttime-change-status" label-width="80px">
        <el-form-item label="老师状态">
          <el-select v-model="partTimeTeacherStateForm.state" placeholder="请选择">
            <template v-if="canChangeStatus">
              <el-option v-for="(item, key) in canChangeStatus" :key="key" :label="item.label"
                         :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" v-if="partTimeTeacherStateForm.state == 7">
          <el-select v-model="partTimeTeacherStateForm.reason" placeholder="请选择">
            <el-option label="未面试" value="未面试"></el-option>
            <el-option label="未培训" value="未培训"></el-option>
            <el-option label="面试不通过" value="面试不通过"></el-option>
            <el-option label="培训不通过" value="培训不通过"></el-option>
            <el-option label="未签协议" value="未签协议"></el-option>
            <el-option label="主动退出" value="主动退出"></el-option>
            <el-option label="已淘汰" value="已淘汰"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="6" v-model="partTimeTeacherStateForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelInterviewAuditSettingDialog">取消</el-button>
          <el-button type="primary" @click="submitTeacherState">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="selectTableText" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
      <div class="order_dialog_header">
        <!-- <div @click="orderTrainTime(userDetailId)" class="add-reserve" >
            <span>预约培训时间</span>
        </div> -->
        <!-- <div @click="openInterviewAuditSettingDialog(userDetailId)" class="add-reserve">
            <span>修改状态</span>
        </div> -->
        <div @click="offerNotices(userDetailId)" class="add-reserve">
          <span>发送通知</span>
        </div>
        <div @click="doRecruitFollow(false,userDetailId,userDetailName,userDetailState,userDetailTime)"
             class="add-reserve">
          <span>招师跟进</span>
        </div>
      </div>
      <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body rder_dialog_bodys">
        <el-tab-pane label="个人信息" name="first">
          <basic-message ref="basicRef"
            v-if="userDetailDialog"
            :tea-id="userDetailId"
            :cipherTId="cipherTId"
            @confirm="confirm"
            @cancel="cancel"
            :tea-statue="6"></basic-message>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="second">
          <operation-record v-if="userDetailTabNumber == 'second'" :tea-id="userDetailId"></operation-record>
        </el-tab-pane>
        <!-- <el-tab-pane label="历史纪录" name="third">
        </el-tab-pane> -->
      </el-tabs>
    </el-dialog>
    <recruit-follow ref="recruitFollowDialog" parent-page="train"></recruit-follow>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
  import partTimeTeacherFlowGetTeachers from 'api/action/partTimeTeacherFlowGetTeachers';
  import getWarnRecycleNumApi from 'api/action/getWarnRecycleNumApi';
  import interViewMixins from './compontent/mixin';
  import filterMixins from '@/mixins/filterMixins';
  import methodsMixins from '@/mixins/methodsMixins';
  import partTimeAction from 'api/action/partTimeAction';
  import {formatDate} from '@/components/date-picker/util';
  import {getTeaCertificateList} from '../../api/select/getTeaCertificate'

  import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo'; // 获取手机号

  import teacherCertificateMixin from '../full_times_dir/teacherCertificateMixin'
  import RecruitFollow from './compontent/RecruitFollow.vue';

  export default {
    components: {
      RecruitFollow
    },
    data() {
      return {
        teaCerOptions:[],
        requestTeaSecretState:false,//表示是否在请求教师信息
        requestTeaSecretTime:10,
        requestTeaSecretInterval:null,
        search_data: {
          teaBu: '', //所属BU
          // timeType:'', //工作性质
          grade: '', //年级
          subject: '', //科目
          // trainResult:'', //培训结果
          // dataState:'', //资料状态
          // teaState:'', //老师状态
          teaReferKeywords: '', //推荐人
          referMobile: '',
          teaNameOrMobile: '', //老师
          school: '', //所属学校
          trainTheme: '', //培训主题
          startAppointTrainTime: '', //培训时间
          endAppointTrainTime: '',
          certificateState: '',
          sortType: '',
          sortField: '',
          isPreRecycle: '',
          pageNo: 1,
          pageSize: 10,
        },
        warnRecycleNum: 0,
        trainTime: '',
        offerNoticesData: [{
          value: '报名成功通知',
          label: '报名成功通知'
        }, {
          value: '面试通知',
          label: '面试通知'
        }, {
          value: '面试提醒',
          label: '面试提醒'
        }, {
          value: '面试结果通知',
          label: '面试结果通知'
        }, {
          value: '培训通知',
          label: '培训通知'
        }, {
          value: '培训结果通知',
          label: '培训结果通知'
        }],
        phaseList: [],
        basesubList: [],
        userDetailDialog: false,
        orderTrainTimeDialog: false,
        offerNoticesDialog: false,
        page_size: 10,
        table_data: [],
        tableLoading: true,
        table_data_total: 0,
        interviewAuditSettingDialog: false,
        currentIDs: [],
        currentID: null,
        partTimeTeacherStateForm: {
          remark: '',
          state: null,
          reason: ''
        },
        canChangeStatus: null,
        // 资料卡弹层
        changeTeachStatusType: false,
        userDetailTabNumber: 'first',
        userDetailId: '',
        userDetailTime: "",
        userDetailState: "",
        userDetailName: '',
        userDetailMobile: '',
        selectTableText: '个人基本信息-个人信息'
      }
    },
    mixins: [filterMixins, methodsMixins, interViewMixins, teacherCertificateMixin],
    methods: {
      getTeaCerList() {
        getTeaCertificateList({
          groupCode: 'TEACHER_CERTIFICATE',
          bu: 1
        }).then(res => {
          if (res && res.length > 0) {
            let arr = res.map(item => {
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode: item.groupCode
              }
            });
            this.teaCerOptions = [...[{
              label: '全部',
              value: ''
            }], ...arr];
          }
        }).catch(message => {
          this.$Message({
            message
          });
        });
      },
      // 获取手机号信息
      getReferMobile(row){
        let elementList = document.querySelectorAll(".detailsBtn");
        for (let i = 0; i < elementList.length; i++) {
          elementList[i].innerText = "点击查看信息";
        }
        let parm = {
          teaId: row.teaId,
          infoType: 'referMobile'
        };
        row.referMobile = "正在查询...";
        getTeacherSecretInfo(parm).then(data => {
          row.referMobile = data;
          row.currentRow = true;
        }).catch(message => {
          row.referMobile = '消息不存在';
          row.currentRow = true;
          this.$Message({
            message
          });
        });
      },
      userDetailTab(val) {
        this.$nextTick(function(){
          this.$refs.basicRef.emergMobileSeen = false;
          this.$refs.basicRef.curUMobileSeen = false;
          this.$refs.basicRef.refeMobileSeen = false;
        });
      },
      trainList() {
        this.$router.push({path:'/train_list'});
      },
      sortChangeBtn(column) {
        if (!column.prop) {
          this.search_data.sortType = "";
          this.search_data.sortField = "";
        } else {
          const sortFieldObj = {
            'appointTrainTime': 'trainingTime'
          }
          this.search_data.sortType = column.order === "ascending" ? "asc" : "desc";
          this.search_data.sortField = sortFieldObj[column.prop];
        }
        this.getTableData();
      },
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      getWarnRecycleNum() {
        getWarnRecycleNumApi('/api/zm-teacher-recruit-web/api/partTimeTeacherFlow/warn_recycle_num', {processStage: 200})
          .then(data => {
            this.warnRecycleNum = data;
          }).catch(message => {
          this.$Message({
            message: message
          });
          this.tableLoading = false;
        });
      },
      showWarnRecycle() {
        this.search_data.isPreRecycle = 1;
        this.getTableData();
      },
      // 获取表单数据
      getTableData() {
        this.tableLoading = true;
        const [certificateType, certificateState] = this.search_data.certificateState.split('');
        partTimeTeacherFlowGetTeachers('/api/zm-teacher-recruit-web/api/partTimeTeacherFlow/getTrainTeachers', {
          ...this.search_data,
          certificateType,
          certificateState
        })
          .then(data => {
            this.table_data = data.list;
            this.table_data_total = data.total;
            this.tableLoading = false;
          }).catch(message => {
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
        // this.currentPage = 1;
        this.search_data.pageNo = 1;
        this.tableLoading = true;
        this.getTableData();
      },
      handleCurrentChange(currentPage) {
        // this.currentPage = currentPage;
        this.search_data.pageNo = currentPage;
        this.tableLoading = true;
        this.getTableData();
      },
      // 选择日期范围
      chooseDate() {
        this.search_data.startApplyDate = new Date(this.searchDateArea[0]).getTime();
        this.search_data.endApplyDate = new Date(this.searchDateArea[1]).getTime();
      },
      // 查询
      search() {
        this.tableLoading = true;
        this.search_data.pageNo = 1;
        this.search_data.isPreRecycle = "";
        this.getTableData();
      },
      orderTrainTime(id) {
        this.currentID = id;
        this.orderTrainTimeDialog = true;
      },
      cancelOrderTrainTime() {
        this.orderTrainTimeDialog = false;
      },
      confirmOrderTrainTime(val) {
        let now = new Date();
        partTimeAction({
          url: '/api/partTimeTeacherFlow/appointTrainTime',
          type: 'post',
          data: {
            "appointTrainTime": val.time,
            "currentDate": formatDate(now, 'yyyy-MM-ddTHH:mm:ss'),
            "remark": val.remark,
            "teaIds": [
              this.currentID
            ]
          }
        }).then(() => {
          this.$Message({
            message: '预约培训成功'
          });
          this.getTableData();
        }).catch(message => {
          this.$Message({
            message
          });
        })
        this.orderTrainTimeDialog = false;
      },
      doRecruitFollow(isBatch, teaId, teaName, state, time) {
        if (isBatch && this.currentIDs && this.currentIDs.length == 0) {
          return this.$Message('请先选择老师');
        }
        let _currentIDs = null;
        if (isBatch) {
          _currentIDs = this.currentIDs;
        } else {
          _currentIDs = [teaId];
        }
        this.$refs.recruitFollowDialog.show(isBatch, _currentIDs, teaName, state, time);
      }
    },
    computed: {
      permission: function () {
        return this.$store.getters.permission;
      }
    },
    mounted() {
      if (!this.permission) {
        this.$router.push({path: '/part_time'});
      } else {
        this.initPhase();
        this.initSubject();
        this.getTableData();
        this.getWarnRecycleNum();
      }
      this.$on("search", function (val) {
        this.search_data.keyWord = val.keyWord || '';
        this.getTableData();
      });
      this.getTeaCerList();
    },
    watch: {
      userDetailTabNumber(val) {
        switch (val) {
          case 'first':
            this.selectTableText = "个人基本信息-个人信息";
            break;
          case 'second':
            this.selectTableText = "个人基本信息-操作记录";
            break;
          case 'third':
            this.selectTableText = "个人基本信息-历史记录";
            break;
        }
      },
      trainTime(val) {
        if (val) {
          this.search_data.startAppointTrainTime = val[0] ? formatDate(val[0], 'yyyy-MM-dd') : '';
          this.search_data.endAppointTrainTime = val[1] ? formatDate(val[1], 'yyyy-MM-dd') : '';
        } else {
          this.search_data.startAppointTrainTime = '';
          this.search_data.endAppointTrainTime = '';
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .alert-warning {
    background-color: #fdf6ec;
    color: #808080;
    padding: 10px;
    border: 10px solid #fff;

    span {
      color: red;
      cursor: pointer;
    }
  }
.detailsBtn {
  color: #007fff;
  cursor: pointer;
}
</style>
<style>
  @import url('./compontent/partTime.css');
</style>
