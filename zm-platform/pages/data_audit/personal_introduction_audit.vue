<template>
  <div class="full-time-container" v-if="permission">
    <!--条件搜索框-->
    <el-form :inline="true" :model="searchData" class="search-form" style="overflow:visible;">
      <el-form-item label="搜索老师">
        <el-input ID="preTrainingKeyWords" v-model="searchData.keyword" placeholder="支持姓名/手机号/ID查询"></el-input>
      </el-form-item>
      <el-form-item label="所属BU">
        <el-select v-model="searchData.teaBu" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in buList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="工作性质">
        <el-select v-model="searchData.timeType" placeholder="请选择">
          <el-option label="全部性质" value=""></el-option>
          <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="老师阶段">
        <el-select v-model="searchData.periodState" placeholder="请选择">
          <el-option label="全部阶段" value=""></el-option>
          <el-option v-for="(item, index) in stageList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级偏好">
        <el-select v-model="searchData.grade" placeholder="请选择">
          <el-option label="全部偏好" value=""></el-option>
          <el-option v-for="(item, index) in phaseList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
         <el-form-item label="授课科目">
        <el-select v-model="searchData.subject" placeholder="请选择">
          <el-option label="全部科目" value=""></el-option>
          <el-option v-for="(item, index) in subjectList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker :editable="false" v-model="searchApplyDateArea" type="daterange" align="right" placeholder="选择日期范围" @change="chooseApplyDate" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="待审内容">
        <el-select v-model="searchData.toBeAudit" placeholder="请选择">
          <el-option label="全部内容" value=""></el-option>
          <el-option v-for="(item, index) in trialContentList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教师资格证">
          <el-select v-model="searchData.teacherCertificateTypes" placeholder="请选择" multiple>
            <el-option v-for="(item,index) in teaCerOptions" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox-group v-model="searchData.isTobeCertificate">
          <el-checkbox label="1">仅查看待审教资状态老师</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="">
        <el-button  class="search-btn" type="normal" size="small" @click="handleReset">重置</el-button>
        <el-button  class="search-btn" icon="search" type="normal" size="small" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="context-body">
      <div class="table-head">
        <span class="table-title">共{{tableDataTotal}}个老师</span>
      </div>

      <el-table :data="tableData" border  style="width:100%" @row-click="handleRowClick">
        <el-table-column prop="isRealName" align="center" label="姓名" width="80">
          <template scope="scope">
            <el-button size="small" type="text" @click.stop="userDetail(scope.row)">{{scope.row.isRealName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="teaBu" align="center" label="所属BU" width="80" >
          <template scope="scope">
            {{scope.row.teaBu === '1' ? '1对1' : scope.row.teaBu === '2' ? '少儿' :scope.row.teaBu === '5'?'优课': '陪练' }}
          </template>
        </el-table-column>
        <el-table-column prop="timeType" align="center" label="老师性质" width="80" >
          <template scope="scope">
            {{scope.row.timeType | timeTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="periodState" align="center" label="老师阶段" width="80" >
          <template scope="scope">
            {{scope.row.periodState | periodFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="toBeAudit" align="center" label="待审内容" >
        </el-table-column>
        <el-table-column prop="certificateState" align="center" label="教资状态" width="80" >
          <template scope="scope">
            {{scope.row.certificateState === 1 ? '待审' : '--'}}
          </template>
        </el-table-column>
        <el-table-column prop="grade" align="center" label="年级" width="120" >
        </el-table-column>
        <el-table-column prop="subject" align="center" label="科目" width="80" >
        </el-table-column>
        <el-table-column prop="submitTime" align="center" label="提交时间" width="150" >
        </el-table-column>
        <el-table-column prop="lastAuditResult" align="center" label="上次审核结果" width="100" >
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button size="small" type="text"
              v-if="checkPermission('recruit:process:fulltime:interview:oneFollowUp')"
              @click="handVerify(scope.row)">
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页控件-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="searchData.pageSize" layout="sizes, prev, pager, next" v-bind:total="tableDataTotal">
      </el-pagination>
    </div>

    <!-- 审核弹框 -->
    <el-dialog
      class="personalIntroduceDialog"
      v-model="dialogVisible"
      width="1000px"
      :show-close="showClose"
      @close="beforeHandleClose"
    >
      <personal-introduce ref="personalIntroduce" :bu="bu" :rowData="rowData"></personal-introduce>
      <div class="btnGroup">
        <span class="btnCancle" @click="handleClickCancle">取消</span>
        <span class="btn-preview" @click="previewPC" v-if="bu == 1">预览（PC版）</span>
        <span class="btn-preview" @click="previewH5" v-if="bu == 1">预览（H5版）</span>
        <span class="btn-preview" @click="previewPC" v-if="bu == 2">预览</span>
        <span class="btnConfirm" @click="handleClickConfirm">确定</span>
      </div>
    </el-dialog>
    <!--用户详情框-->
    <el-dialog :title="userDetailName" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
      <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body rder_dialog_bodys">
        <el-tab-pane label="基本信息/简历" name="first">
          <basic-message ref="basicMessageEle" :name="userDetailName" :prodata="proData" :bu="bu"  @preview="confirmPreviewDialog" @audit="teaAudit" @confirm="confirmUserDetailDialog()" @cancel="closeUserDetailDialog()" :cipherTId="cipherTId" :currentID="userDetailId" :viewState="userDetailDialog" :teaStatue="2" class="mg-20" :base-info="userDetailData" :eduBackData="eduBackData" :salaryAnPaylData="salaryAnPaylData" :teaPersonalInfoData="teaPersonalInfoData"></basic-message>
        </el-tab-pane>
        <el-tab-pane label="笔试信息" name="second">
          <written-record :userDetailDataPlus="userDetailDataPlus"></written-record>
        </el-tab-pane>
        <el-tab-pane label="移交记录" name="four">
          <hand-over :userDetailDataHandsRecords="userDetailDataHandsRecords"></hand-over>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="operationRecordMix">
          <operation-record-mix ref="operationRecordMix"></operation-record-mix>
        </el-tab-pane>
        <el-tab-pane label="历史记录" name="historyRecord">
          <history-record :historyRecord="historyRecord"></history-record>
        </el-tab-pane>
        <el-tab-pane label="应聘记录" name="applicationRecord">
          <application-record ref="applicationRecordRef" @open-this-dialog="openThisDialog"></application-record>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--教师审核dialog-->
    <el-dialog :white="true" title="教师审核" v-model="teaAuditSettingDialog" size="small" @close="cancelTeaAuditSettingDialog">
      <tea-mes-audit  :teaCheckState="teaCheckState" :auditData="auditData" :viewState="teaAuditSettingDialog"  :currentID="auditTeaId" @confirm="confirmTeaAuditSettingDialog" @cancel="cancelTeaAuditSettingDialog"></tea-mes-audit>
    </el-dialog>

    <!--预览pc版1对1 图片 dialog-->
    <el-dialog :white="true" title="预览1对1" v-model="previewOneVoneImgDialog" size="large" @close="cancelPreviewOneVoneImgDialog">
      <el-radio-group class="preview-big" v-model="previewPCTab" @tab-click="pcTabChange">
        <el-radio-button label="new">个人介绍（新版）</el-radio-button>
      </el-radio-group>
      <img class="preview-pc-img" :src="previewPCUrl" />
    </el-dialog>

    <!--预览pc版少儿 页面 dialog-->
    <el-dialog :white="true" title="预览少儿" v-model="previewChildPageDialog" size="large" @close="cancelPreviewChildPageDialog">
      <el-radio-group class="h5-tab-radio" v-model="previewChildModel" @change="previewChildTabChange">
        <el-radio-button label="new">个人介绍（新版）</el-radio-button>
        <el-radio-button label="old" v-if="previewOldNewFlg">个人介绍（旧版）</el-radio-button>
      </el-radio-group>
      <div class="preview-child-iframe" >
        <iframe :src="previewPCChildPageUrl" height="800" width="100%"></iframe>
      </div>
    </el-dialog>

    <!--预览H5 页面 dialog-->
    <preview-h5  :teaId="teaId" ref="previewH5Ref"
     :view-state="previewH5ShowFlg" v-if="previewH5ShowFlg"
      @cancel="cancelPreviewH5Dialog"
      :tea-data="previewH5Data" :h5RowData="h5RowData"></preview-h5>

    <!-- 查看面试者详情 -->
    <application-record-dialog ref="applicationRecordDialog" />
    <!--预览dialog-->
    <preview :teaData="previewData" :eduBackData="eduBackData"  v-show="previewDialog && bu != 3" @cancel="cancelPreviewDialog" :viewState="previewDialog"  :currentID="userDetailId" ></preview>
    <resume-pl ref="resumePl" :teaData="previewData" v-show="previewDialog  && bu == 3" @cancel="cancelPreviewDialog" :viewState="previewDialog"  :currentID="userDetailId" ></resume-pl>
  </div>
  <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>
<script>
  import getAllDicCode from '../../api/select/getAllDicCode'
  import getOneVonePreviewImgUrl from '../../api/select/getOneVonePreviewImgUrl'; // 获取1对1的预览图片url
  import getChildPreviewImgUrl from '../../api/select/getChildPreviewImgUrl'; // 获取少儿的预览图片url
  import getIntroduceAuditList from '../../api/select/getIntroduceAuditList'
  import personalIntroduce from '../component/personalIntroduce'
  import previewH5 from './preview-h5';
  import userInfoMixin from './userInfoMixin';
  import filterMixin from './filterMixin';
  import { buList, trialContentList, timeTypeList, pickerOptions } from '../../../src/enum';
  import getReviewList from '../../api/select/getReviewList'; // 获取近期审核记录
  import {getTeaCertificateList} from '../../api/select/getTeaCertificate'

 // 配置少儿的预览访问url
// let localhostUrl = 'https://zmkids-h5.zmpeiyou.com/kids-pad/';
// let curHash = window.location.href;
// if (curHash.indexOf('b.zmlearn.com:') > -1 || curHash.indexOf('p-test.zmlearn.com') > -1) {
//   localhostUrl = 'https://kids-active.zmaxis.com/pad/';
// } else if (curHash.indexOf('p.uat.zmops.cc') > -1){
//   localhostUrl = 'https://zmkids-h5.uat.zmops.cc/kids-pad/';
// } else {
//   localhostUrl = 'https://zmkids-h5.zmpeiyou.com/kids-pad/';
// }

  const VUE_APP_RUN_ENV = process.env.VUE_APP_RUN_ENV;
  // 少儿预览环境地址配置
  const kidPreviewUrlMap = {
    'dev': 'https://test-chat.zhangmenkid.com/external/teacherintro',
    'fat': 'https://test-chat.zhangmenkid.com/external/teacherintro',
    'uat': 'https://chat-kids.uat.zmops.cc/external/teacherintro',
    'prod':'https://chat.zhangmenkid.com/external/teacherintro'
  }
  // 少儿预览地址
  const kidPreviewUrl = kidPreviewUrlMap[VUE_APP_RUN_ENV] || kidPreviewUrlMap.prod

  export default {
    mixins: [userInfoMixin, filterMixin],
    data() {
      return {
        teaCerOptions: [], // 教师资格状态列表
        searchData: {
          keyword: '',
          periodState: '',
          teaBu: '',
          submitTimeStart: '',
          submitTimeEnd: '',
          grade: '',
          subject: '',
          toBeAudit: '',
          timeType: '',
          isTobeCertificate: 0,
          pageNo: 1,
          pageSize: 10,
          teacherCertificateTypes:''
        },
        stageList: [],
        phaseList: [],
        subjectList: [],
        searchApplyDateArea:[],
        pickerOptions: pickerOptions,
        tableData: [],
        tableDataTotal: 0,
        allDicData: [],
        dialogVisible: false,
        teaId: '',
        previewPCUrl: '', // 一对一：预览pc版url
        previewOneVoneImgDialog: false, // 一对一：预览pc版弹窗显示flg
        previewChildPageDialog: false, // 少儿：预览pc版弹窗显示flg
        previewPCChildPageUrl: '', // 少儿：预览pc版页面url
        previewPCTab: 'new', // pc新版旧版切换tab
        previewChildModel: 'new', // 少儿：tab切换val
        previewH5ShowFlg: false, // 预览h5显示flg
        previewH5Data: {}, // 预览h5 接口i获取的data
        h5RowData: {}, // 预览h5 row data
        showClose: false,
        rowData: [],
        buList: buList,
        trialContentList:　trialContentList,
        timeTypeList: timeTypeList,
        previewOldNewFlg: false // 判断是否显示新版和旧版，还是只显示新版
      }
    },
    computed: {
      permission: function () {
        return this.$store.getters.permission
      }
    },
    components: {
      personalIntroduce,
      previewH5// 预览h5 页面
    },
    created() {
      // 支持跳转传参查询
      Object.assign(this.searchData, this.$route.query);
      // 老师阶段
      this.getAllDicData( [{"dictCode": "TEACHER_PERIOD"}])
      // 年级偏好
      this.getAllDicData( [{"dictCode": "PHASE"}])
      // 授课科目
      this.getAllDicData( [{"dictCode": "BASIC_SUBJECTS"}])
    },
    mounted() {
       // 获取教师资格状态列表
      this.getTeaCerList();
      this.getSourceData();
      this.previewChildModel === 'new';
    },
    methods: {
      change(val){
      },
       getTeaCerList() {
        getTeaCertificateList({
          groupCode:'TEACHER_CERTIFICATE',
          bu:1
        }).then(res => {
          if(res&&res.length>0){
            let arr= res.map(item=>{
              return {
                label: item.itemName,
                value: parseInt(item.itemCode),
                groupCode:item.groupCode
              }
            });
            this.teaCerOptions = [...arr];
          }
        }).catch(message => {
          this.$Message({
            message
          });
        })
      },
      // 通过检查近期审核记录，来判定预览时候是显示新版和旧版，还是只显示旧版
      getNewOldCheckInfo(type) {
        getReviewList({teaId: this.teaId})
        .then(res => {
          this.previewOldNewFlg =false;
          for(let i = 0; i < res.length; i++) {
            if (res[i].checkStateStr && res[i].checkStateStr === '审核通过') {
              this.previewOldNewFlg = true;
              break;
            }
          }
          if (type === '1v1h5') { // 预览h5版
            this.h5RowData = this.rowData[0];
            this.h5RowData.oldNewVal = this.previewOldNewFlg ? 'newold' : 'new';
            this.previewH5ShowFlg = true;
          } else if (type === 'pc') { // 预览pc版
            if (this.bu == 1) {
              // BU为1对1时，获取一对一预览图片url
              getOneVonePreviewImgUrl({
                teaId: this.teaId
              })
              .then(res => {
                this.previewOneVoneImgDialog = true;
                this.previewPCUrl = 'http://oss-cn-hangzhou.aliyuncs.com/zm-chat-slides/' + res.lesHash + '/slide-0.png';
              });
            } else if (this.bu == 2) {
              // BU为少儿时，获取少儿页面url
              getChildPreviewImgUrl({
                id: this.teaId
              })
              .then(res => {
                this.previewChildPageDialog = true;
                this.previewPCChildPageUrl = kidPreviewUrl + '?encryptId=' + res + '&from=teacher-pc';
              });
            }
            }
          });
      },
      // 少儿切换新版旧版
      previewChildTabChange() {
        // BU为少儿时，获取少儿页面url
          getChildPreviewImgUrl({
            id: this.teaId
          })
          .then(res => {
            this.previewChildPageDialog = true;
            if (this.previewChildModel === 'new') {
              this.previewPCChildPageUrl = kidPreviewUrl + '?encryptId=' + res + '&from=teacher-pc';
            } else if (this.previewChildModel === 'old') {
              this.previewPCChildPageUrl = kidPreviewUrl + '?encryptId=' + res + '&from=KidsPC';
            }
          });

      },
      // 切换pctab
      pcTabChange() {
      },
      // 预览pc版
      previewPC() {
        this.getNewOldCheckInfo('pc');
      },
      // 关闭一对一预览pc版 弹窗
      cancelPreviewOneVoneImgDialog() {
        this.previewOneVoneImgDialog = false;
      },
      // 关闭少儿预览pc版 弹窗
      cancelPreviewChildPageDialog() {
        this.previewChildPageDialog = false;
      },
      // 预览H5版
      previewH5() {
        this.getNewOldCheckInfo('1v1h5');
      },
      // 关闭预览h5页面 弹窗
      cancelPreviewH5Dialog() {
        this.previewH5ShowFlg = false;
      },
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      async getAllDicData(option, type) {
        await getAllDicCode(option)
        .then(res => {
          const { childNodeCode, children } = res
          if (childNodeCode === 'TEACHER_PERIOD') this.stageList = children
          if (childNodeCode === 'PHASE') this.phaseList = children
          if (childNodeCode === 'BASIC_SUBJECTS') this.subjectList = children
        })
        .catch(err => {
          this.$Message({
            type: 'error',
            message: '获取字典值失败！'
          })
        })
      },
      getSourceData() {
        getIntroduceAuditList(this.searchData)
          .then(res => {
            const { list, total } = res
            this.tableData = list
            this.tableDataTotal = total
          })
      },
      handleSearch() {
        this.getSourceData()
      },
      handleReset(){
        this.searchData = {
          ...this.searchData,
          keyword: '',
          periodState: '',
          teaBu: '',
          submitTimeStart: '',
          submitTimeEnd: '',
          grade: '',
          subject: '',
          toBeAudit: '',
          timeType: '',
          pageNo: 1,
          pageSize: 10,
        }
        this.searchApplyDateArea = []
      },
      chooseApplyDate() {
        if(this.searchApplyDateArea[0] == null){
          this.searchData.submitTimeStart = ''
          this.searchData.submitTimeEnd = ''
        }else{
          let sDate = new Date(this.searchApplyDateArea[0]).getTime()
          let eDate = new Date(this.searchApplyDateArea[1]).getTime()
          this.searchData.submitTimeStart = this.$DateTool.format(sDate,'yyyy-MM-dd') + " 00:00:00"
          this.searchData.submitTimeEnd = this.$DateTool.format(eDate,'yyyy-MM-dd') + " 23:59:59"
        }
      },
      handVerify(row) {
      },
      handleSizeChange(pageSize) {
        this.searchData.pageSize = pageSize
        this.searchData.pageNo = 1
        this.getSourceData()
      },
      handleCurrentChange(currentPage) {
        this.searchData.pageNo = currentPage
        this.getSourceData()
      },
      handleRowClick(row) {
        this.teaId = row.teaId;
        this.rowData = [{...row}]
        this.bu = row.teaBu
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.personalIntroduce.getSnapshot()
          this.$refs.personalIntroduce.getReview()
        })
      },
      beforeHandleClose() {
        this.$refs.personalIntroduce.handleClose()
        this.$refs.personalIntroduce.initData()
      },
      handleClickCancle() {
        this.dialogVisible = false
        this.$refs.personalIntroduce.initData()
      },
      handleClickConfirm() {
        this.$refs.personalIntroduce.handleClickAudit()
      }
    }
  }
</script>

<style lang="less">
  .personalIntroduceDialog{

    .el-dialog{
      min-width: 1200px;
      .el-dialog__header{
        border-bottom: 0;
      }
      .el-dialog__body{
        background: #fff;
      }
    }
    .btnGroup{
      text-align: right;
      span{
        display: inline-block;
        padding: 5px 36px;
        font-size: 14px;
        border-radius:4px;
        border:1px solid rgba(29,145,252,1);
      }
      span:hover{
        cursor: pointer;
      }
      .btnCancle{
        color:rgba(29,145,252,1);
      }
      .btn-preview {
        color:rgba(29,145,252,1);
        margin-left: 15px;
      }
      .btnConfirm{
        background:rgba(29,145,252,1);
        color:rgba(255,255,255,1);
        margin-left: 16px;
      }
    }
  }
.preview-pc-img{
  margin:0 auto;
  width: 100%;
  max-height: 600px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  margin-top: 10px;
  max-width: 1116px;
}
.preview-big {
  width: 100%;
}
</style>
