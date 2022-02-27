<template>
<div class="full-time-container" v-if="permission">
  <p class="alert-warning" v-if="warnRecycleNum>0"> 面试管理中有<span @click="showWarnRecycle">{{warnRecycleNum}}人</span>即将进入回收站，请务必查看和确认！</p>
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
    <el-form-item label="年级">
      <el-select v-model="search_data.grade" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item,index) in phaseList" :key="index" :label="item.label" :value="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="科目">
      <el-select v-model="search_data.subject" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item,index) in basesubList" :key="index" :label="item.label" :value="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属学校">
      <el-input v-model="search_data.school" placeholder="输入学校"></el-input>
    </el-form-item>
    <el-form-item label="资料状态">
        <el-select v-model="search_data.introState" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待提交" value="0"></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核不通过" :value="3"></el-option>
        </el-select>
    </el-form-item>
    <!-- <el-form-item label="资料审核时间">
        <el-date-picker
            v-model="introAuditTime"
            type="daterange"
            range-separator="至"
            placeholder="请选择资料审核时间">
        </el-date-picker>
    </el-form-item> -->
    <!-- <el-form-item label="协议状态">
      <el-select v-model="search_data.signState" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="未签协议" value="0"></el-option>
        <el-option label="已签协议" value="1"></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item label="教师资格证">
        <el-select v-model="search_data.certificateState" placeholder="请选择">
            <el-option v-for="(item, index) in teaCerOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
    </el-form-item>
    <el-form-item label="最新推荐人">
      <el-input v-model="search_data.teaReferKeywords" placeholder="推荐人姓名/手机号精准查询"></el-input>
    </el-form-item>

    <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>

  </el-form>

  <div class="context-body">
    <Spin size="large" fix v-if="tableLoading"></Spin>

    <div class="table-head">
      <span class="table-title" style="color:red;" v-if="search_data.isPreRecycle==1">共{{table_data_total}}个老师即将被回收</span>
      <span class="table-title" v-else>共{{table_data_total}}个老师</span>
      <el-button type="text" size="small" @click="offerNotices()">发送通知</el-button>
        <el-button type="text" size="small" @click="doRecruitFollow(true,'','','')">招师跟进</el-button>
    </div>

    <el-table :data="table_data" @selection-change="selectTable" @sort-change="sortChangeBtn" style="width:100%">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" label="姓名">
            <template scope="scope">
                <el-button size="small" type="text" @click="userDetail(scope.row)">{{scope.row.teaName}}</el-button>
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
        <el-table-column prop="grade" align="center" label="年级">
        </el-table-column>
        <el-table-column prop="subject" align="center" label="科目">
        </el-table-column>
        <el-table-column prop="teaSuoshuschool" align="center" label="所属学校">
        </el-table-column>
        <el-table-column  align="center" label="资料状态"><template scope="scope">
               {{scope.row.introState | introStateFilters}}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="introAuditTime" align="center" label="资料审核时间" width="120px" sortable="custom">
        </el-table-column>  -->
        <!-- <el-table-column prop="signState" align="center" label="协议状态">
        </el-table-column> -->
        <el-table-column prop="certificateState" align="center" label="教师资格证" width="120">
          <template scope="scope" >
            {{scope.row.certificateType|certificateTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="referrerName" align="center" label="推荐人姓名">
        </el-table-column>
        <el-table-column prop="referMobile" width="100px" align="center" label="推荐人手机号">
          <template scope="scope">
            <el-button type="text" size="small" @click="getReferMobile(scope.row)"
                       class="detailsBtn" v-if="scope.row.referMobile&&!scope.row.currentRow">点击查看信息</el-button>
            <span v-show="scope.row.currentRow">{{scope.row.referMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template scope="scope">
                <el-button type="text" size="small" @click="doRecruitFollow(false,scope.row.teaId,scope.row.teaName,scope.row.introState)">招师跟进</el-button>
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
      v-bind:total="table_data_total">
    </el-pagination>
  </div>

    <time-remark title="发送通知" select-title="通知类型" :select-data="offerNoticesData" :show="offerNoticesDialog" @cancel="cancelOfferNotices" @confirm="confirmOfferNotices"></time-remark>
    <el-dialog :title="selectTableText" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
        <div class="order_dialog_header">
            <div @click="offerNotices(userDetailId)" class="add-reserve" >
                <span>发送通知</span>
            </div>
            <div @click="doRecruitFollow(false,userDetailId,userDetailName,userDetailState)" class="add-reserve">
                <span>招师跟进</span>
            </div>
        </div>
        <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body rder_dialog_bodys">
            <el-tab-pane label="个人信息" name="first">
                <basic-message
                  currentRoute="entry"
                    v-if="userDetailDialog"
                    :tea-id="userDetailId"
                    :cipherTId="cipherTId"
                    @confirm="confirm"
                    @cancel="cancel"
                    :tea-statue="6"
                    page-info="招师-兼职-面试管理-个人信息-基本信息"></basic-message>
            </el-tab-pane>
            <el-tab-pane label="操作记录" name="second">
                <operation-record v-if="userDetailTabNumber == 'second'" :tea-id="userDetailId"></operation-record>
            </el-tab-pane>
            <!-- <el-tab-pane label="历史纪录" name="third">
            </el-tab-pane> -->
        </el-tabs>
    </el-dialog>
    <recruit-follow ref="recruitFollowDialog" parent-page="entry"></recruit-follow>

</div>
<div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import partTimeTeacherFlowGetTeachers from 'api/action/partTimeTeacherFlowGetTeachers';
import getWarnRecycleNumApi from 'api/action/getWarnRecycleNumApi';
import filterMixins from '@/mixins/filterMixins';
import methodsMixins from '@/mixins/methodsMixins';
import interViewMixins from './compontent/mixin';
import {formatDate} from '@/components/date-picker/util';
import RecruitFollow from './compontent/RecruitFollow.vue';
import teacherCertificateMixin from '../full_times_dir/teacherCertificateMixin'
import {getTeaCertificateList} from '../../api/select/getTeaCertificate'
import getTeacherSecretInfo from 'api/select/getTeacherSecretInfo'; // 获取手机号

export default {
    components:{
      RecruitFollow
    },
    data() {
      return {
        teaCerOptions:[],
        requestTeaSecretState:false,//表示是否在请求教师信息
        requestTeaSecretTime:10,
        requestTeaSecretInterval:null,
            search_data: {
                introState:"",
                // signState:"",
                certificateState :"",
                teaBu: '', //所属BU
                grade: '', //年级
                subject: '', //科目
                // startIntroAuditTime:'',//开始资料审核时间
                // endIntroAuditTime:'',//结束资料审核时间
                teaNameOrMobile: '', //老师
                referMobile: '', //推荐人手机号
                school: '', //所属学校
                sortType:'',
                sortField:'',
                isPreRecycle:'',
                pageNo: 1,
                pageSize: 10,
                teaReferKeywords:""
            },
            warnRecycleNum:0,
            introAuditTime: '',
            offerNoticesDialog:false,
            offerNoticesData:[{
                    value:'报名成功通知',
                    label:'报名成功通知'
                },{
                    value:'面试通知',
                    label:'面试通知'
                },{
                    value:'面试提醒',
                    label:'面试提醒'
                },{
                    value:'面试结果通知',
                    label:'面试结果通知'
                },{
                    value:'培训通知',
                    label:'培训通知'
                },{
                    value:'培训结果通知',
                    label:'培训结果通知'
            }],
            phaseList: [],
            basesubList: [],
            currentID:'',
            currentIDs: [],
            userDetailDialog: false,
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 被选择的用户
            selectName: [],
            /**个人信息弹窗所需数据 */
            userDetailState:'',
            userDetailTabNumber: 'first',//个人信息弹出框tab索引
            userDetailId: '',//个人信息弹出框用户ID
            userDetailName: '',//个人信息弹出框用户名
            userDetailMobile: '',//个人信息弹出框用户手机号
            userDetailData: {},//个人信息弹出框-基本信息
            salaryAnPaylData:{},
            eduBackData:{},//教育背景
            teaPersonalInfoData:{},
            userDetailDataPlus: [],//个人信息弹出框-笔试信息
            userDetailDataReserveRecords: [],//个人信息弹出框-预约记录
            userDetailDataHandsRecords:[],//个人信息糖醋狂-移交记录
            userDetailDataReviewRecords: [],//个人信息弹出框-面试记录
            userDetailDataTrainingRecords:[],//个人信息弹出框-培训记录
            userDetailDataIdentifyRecords:[],//个人信息弹出框-实名记录
            exportOptions:{},
            bu:'',
            proData: [],
            selectTableText: '个人基本信息-个人信息',
        }
    },
    mixins: [filterMixins, methodsMixins, interViewMixins,teacherCertificateMixin],

    methods: {
      // 从后端获取教师资格状态列表
      getTeaCerList() {
        getTeaCertificateList({
          groupCode:'TEACHER_CERTIFICATE',
          bu:1
        }).then(res => {
          if(res&&res.length>0){
            let arr= res.map(item=>{
              return {
                label: item.itemName,
                value: item.itemCode,
                groupCode:item.groupCode
              }
            });
            this.teaCerOptions = [...[{
              label: '全部',
              value: ''
            }],...arr];
          }
        }).catch(message => {
          this.$Message({
            message
          });
        });

        // //获取 离职原因 下拉项 字典
        // getTeaCerListService([{"dictCode":"TEA_LEAVE_REASON"}]).then(data => {
        //   this.teaLeaveReasonOptions = data.children
        // }).catch(message => {
        //   this.$Message({
        //     message
        //   });
        // });
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
        sortChangeBtn(column) {
            if(!column.prop){
                this.search_data.sortType = "";
                this.search_data.sortField = "";
            }else{
                const sortFieldObj = {
                    'introAuditTime':'introAuditTime'
                }
                this.search_data.sortType =  column.order === "ascending"?"asc":"desc";
                this.search_data.sortField = sortFieldObj[column.prop];
            }
            this.getTableData();
        },
        showWarnRecycle(){
            this.search_data.isPreRecycle = 1;
            this.getTableData();
        },
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        getWarnRecycleNum(){
            getWarnRecycleNumApi('/api/zm-teacher-recruit-web/api/partTimeTeacherFlow/warn_recycle_num',{processStage:300})
            .then(data => {
                this.warnRecycleNum = data;
            }).catch(message => {
                this.$Message({
                    message: message
                });
                this.tableLoading = false;
            });
        },
        // 获取表单数据
        getTableData() {
            this.tableLoading = true;
            const [certificateType, certificateState] = this.search_data.certificateState.split('');
            partTimeTeacherFlowGetTeachers('/api/zm-teacher-recruit-web/api/partTimeTeacherFlow/getEntryTeachers',{ ...this.search_data, certificateType, certificateState}).then(data => {
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
        // 查询
        search() {
            this.tableLoading = true;
            this.search_data.pageNo = 1;
            this.search_data.isPreRecycle = '';
            this.getTableData();
        },
        doRecruitFollow(isBatch,teaId,teaName,state){
            if (isBatch && this.currentIDs && this.currentIDs.length == 0) {
                return this.$Message('请先选择老师');
            }
            let _currentIDs = null;
            if(isBatch){
                _currentIDs = this.currentIDs;
            }else{
                _currentIDs = [teaId];
            }
            this.$refs.recruitFollowDialog.show(isBatch,_currentIDs,teaName,state);
        }
    },
    computed: {
        permission: function() {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        this.initPhase();
        this.initSubject();
        if (!this.permission) {
            this.$router.push({
                path: '/part_time'
            });
        } else {
            this.getTableData();
            this.getWarnRecycleNum();
        }
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
        introAuditTime(val) {
            if (val) {
                this.search_data.startIntroAuditTime = val[0] ? formatDate(val[0], 'yyyy-MM-dd') : '';
                this.search_data.endIntroAuditTime = val[1] ? formatDate(val[1], 'yyyy-MM-dd') : '';
            } else {
                this.search_data.startIntroAuditTime = '';
                this.search_data.endIntroAuditTime = '';
            }
        },
    }
}
</script>
<style lang="less" scoped>
.alert-warning{
    background-color: #fdf6ec;
    color: #808080;
    padding:10px;
    border:10px solid #fff;
    span{
        color:red;
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
