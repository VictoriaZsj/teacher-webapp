<template>
  <div class="full-time-container" v-if="permission">

    <el-form :inline="true" :model="search_data" class="search-form">
      <el-form-item label="笔试状态">
        <el-select v-model="search_data.testStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="未提交" value="1"></el-option>
          <el-option label="已提交" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="沟通结果">
        <el-select v-model="search_data.communicateResult" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="一次挂断" value="1"></el-option>
          <el-option label="二次挂断" value="2"></el-option>
          <el-option label="三次挂断" value="3"></el-option>
          <el-option label="条件符合" value="4"></el-option>
          <el-option label="待二面" value="5"></el-option>
          <el-option label="电话联系" value="1016"></el-option>
          <el-option label="其他" value="1017"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用工性质">
        <el-select v-model="search_data.employmentNature" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="全职" value="1"></el-option>
          <el-option label="校招全职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历">
        <el-select v-model="search_data.education" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="本科" value="1"></el-option>
          <el-option label="硕士" value="2"></el-option>
          <el-option label="博士" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名科目">
        <el-select v-model="search_data.subject" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="语文" value="0"></el-option>
          <el-option label="数学" value="1"></el-option>
          <el-option label="英语" value="2"></el-option>
          <el-option label="政治" value="3"></el-option>
          <el-option label="历史" value="4"></el-option>
          <el-option label="地理" value="5"></el-option>
          <el-option label="物理" value="6"></el-option>
          <el-option label="化学" value="7"></el-option>
          <el-option label="生物" value="8"></el-option>
          <el-option label="科学" value="9"></el-option>
          <el-option label="奥数" value="10"></el-option>
          <el-option label="文综" value="11"></el-option>
          <el-option label="理综" value="12"></el-option>
          <el-option label="心理" value="13"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名年级">
        <el-select v-model="search_data.grade" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="小学" value="0"></el-option>
          <el-option label="初中" value="1"></el-option>
          <el-option label="高中" value="2"></el-option>
          <el-option label="少儿" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报名时间">
        <el-date-picker :editable="false" v-model="searchDateArea" type="daterange" align="right" placeholder="选择日期范围"
                        @change="chooseDate" :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="跟进人">
        <el-input v-model="search_data.followPerson" placeholder="输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="search_data.keyWord" placeholder="输入姓名或手机号"></el-input>
      </el-form-item>
      <el-button class="search-btn" icon="search" size="small" type="normal" @click="search">查询</el-button>

    </el-form>

    <div class="context-body">
      <Spin size="large" fix v-if="tableLoading"></Spin>

      <div class="table-head">
        <span class="table-title">共{{table_data_total}}个待预约老师</span>
        <el-button type="text" size="small" :loading="exportExcelLoading" @click="exportExcel(selectName)"
                   v-if="checkPermission('tea:process:export-excel')">导出Excel
        </el-button>
        <el-button type="text" size="small" :loading="standUpTogetherLoading" @click="showOperations = true,allOperations=true,teacherId=selectName">跑单
        </el-button>
        <el-button type="text" size="small" :loading="interviewNoticeLoading"
                   @click="interviewNoticeTogether(selectName)">面试通知
        </el-button>
        <el-button type="text" size="small" @click="urgeTest()">催笔试</el-button>
        <el-button type="text" size="small" @click="transfer()">移交</el-button>
      </div>

      <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column v-if="checkPermission('tea:process:common-info')" align="center"
                         class-name="table_data_overflow" label="姓名" width="120" fixed>
          <template scope="scope" style="overflow:visibile">
            <el-tooltip class="item" v-if="scope.row.waitTwoInterviewRemark" effect="light"
                        :content="scope.row.waitTwoInterviewRemark" placement="right-start">
              <el-badge :value="2" is-dot>
                <el-button size="small" type="text" @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">
                  {{scope.row.name}}
                </el-button>
              </el-badge>
            </el-tooltip>
            <el-button v-if="!scope.row.waitTwoInterviewRemark" size="small" type="text"
                       @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">{{scope.row.name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column v-else prop="name" align="center" label="姓名" width="120" fixed>
        </el-table-column>
        <el-table-column prop="qq" align="center" label="QQ" width="140">
        </el-table-column>
        <el-table-column prop="teaWeixin" align="center" label="微信" width="140">
        </el-table-column>
        <el-table-column prop="mobile" align="center" label="联系方式" width="130">
        </el-table-column>
        <el-table-column prop="testStatus" align="center" label="笔试状态" width="100">
        </el-table-column>
        <el-table-column prop="communicateResult" align="center" label="沟通结果" width="100">
        </el-table-column>
        <el-table-column prop="grade" align="center" label="报名年级" width="85">
        </el-table-column>
        <el-table-column prop="subject" align="center" label="报名科目" width="85">
        </el-table-column>
        <el-table-column prop="applyDate" :formatter="transformDate" align="center" label="报名时间" width="190">
        </el-table-column>
        <el-table-column prop="interviewDate" :formatter="transformDate" align="center" label="面试时间" width="190">
        </el-table-column>
        <el-table-column prop="education" align="center" label="学历" width="80">
        </el-table-column>
        <el-table-column prop="employmentNature" align="center" label="用工性质" width="120">
        </el-table-column>
        <el-table-column prop="recommendPerson" align="center" label="推荐人" width="100">
        </el-table-column>
        <el-table-column prop="followPerson" align="center" label="跟进人" width="100">
        </el-table-column>
        <el-table-column prop="graduatedSchool" align="center" label="毕业院校" width="180">
        </el-table-column>
        <el-table-column prop="email" header-align="center" label="邮箱" width="200">
        </el-table-column>
        <el-table-column align="center" label="操作" width="220" fixed="right">
          <template scope="scope">
            <el-button size="small" type="text" @click="transfer(scope.row.id)">移交</el-button>
            <el-button size="small" type="text" @click="urgeTest(scope.row.id)">催笔试</el-button>
            <el-button size="small" :loading="interviewLoading" type="text"
                       @click="interviewNotice(scope.row.id,scope.$index)">面试通知
            </el-button>
            <el-button size="small" type="text" @click="standUp(scope.row.id,scope.row.index)">跑单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize"
                     layout="sizes, prev, pager, next" v-bind:total="table_data_total">
      </el-pagination>

    </div>

    <el-dialog title="待预约的配置（修改后10s生效）" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
      <div class="order_dialog_header">
        <!--<el-button @click="addReserveRecord=true" type="text" icon="plus" class="add-reserve">添加沟通结果</el-button>-->
        <div @click="addReserveRecord=true" class="add-reserve"
             v-if="checkPermission('tea:reserve:add-reserve-record')">
          <i class="el-icon-plus"></i>
          <span>添加沟通结果</span>
        </div>
      </div>
      <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body">
        <el-tab-pane label="基本信息/简历" name="first">
          <el-form ref="form" :inline="true" label-position="left" label-width="80px"
                   v-if="checkPermission('tea:reserve:update-basic-info')">
            <el-form-item label="姓名">
              <el-input v-model="userDetailData.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="userDetailData.sex" placeholder="请选择">
                <el-option v-for="(item,index) in options.sex" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="现居住地">
              <el-input v-model="userDetailData.address"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="QQ">
              <el-input v-model="userDetailData.qq"></el-input>
            </el-form-item>
            <el-form-item label="微信">
              <el-input v-model="userDetailData.teaWeixin"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="userDetailData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userDetailData.email"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="报名年级">
              <el-select v-model="userDetailData.grade" placeholder="请选择" @change="gradeChange">
                <el-option v-for="(item,index) in options.grade" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报名科目">
              <el-select v-model="userDetailData.subject" placeholder="请选择">
                <el-option v-for="(item,index) in options.subject" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作性质">
              <el-select v-model="userDetailData.employmentNature" placeholder="请选择">
                <el-option v-for="(item,index) in options.employmentNature" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <br>

            <el-form-item :label="'毕业院校-'+(index+1)" v-for="(item,index) in userDetailData.graduateInfos" :key="index">
              {{ item.graduatedSchool }} ({{item.collegeLevel}}) - {{ item.graduatedYear }}年 - {{ item.educationStr }}毕业
            </el-form-item>

            <br>
            <el-form-item label="求职状态">
              {{ userDetailData.workStatusStr }}
            </el-form-item>
            <el-form-item label="最快到岗">
              {{ userDetailData.fastestInWorkTime }}
            </el-form-item>
            <el-form-item label="职业规划">
              {{ userDetailData.careerPlanStr }}
            </el-form-item>
            <br>
            <el-form-item label="薪资">
              <el-select v-model="userDetailData.monthSalary" placeholder="请选择">
                <el-option v-for="(item,index) in options.monthSalary" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职位类型">
              <el-select v-model="userDetailData.positionType" placeholder="请选择">
                <el-option v-for="(item,index) in options.positionType" :key="index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              {{ userDetailData.remark }}
            </el-form-item>
            <!-- <el-form-item label="推介人">
                        {{ userDetailData.recommendPerson }}
                    </el-form-item>
                    <el-form-item label="家庭住址">
                        <el-input v-model="userDetailData.location"></el-input>
                    </el-form-item> -->
          </el-form>
          <el-form v-else>
            <el-form-item>没有该模块的权限</el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="笔试信息" name="second">
          <div class="writtenScore" v-for="(item,index) in userDetailDataPlus" :key="index">
            报名科目:{{ item.subject }}
            <img :src="item.filePath" alt="笔试相关图片" width="500">
          </div>
        </el-tab-pane>
        <el-tab-pane label="预约记录" name="third">
          <el-table :data="userDetailDataReserveRecords" style="width: 100%">
            <el-table-column label="跟进记录" width="180">
              <template scope="scope">
                跟进记录{{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column :formatter="transformDate" prop="createdTime" label="操作时间" width="200">
            </el-table-column>
            <el-table-column prop="operateResult" label="预约结果" width="180">
            </el-table-column>
            <el-table-column :formatter="transformDate" prop="nextAppointTime" label="下次预约计划" width="200">
            </el-table-column>
            <el-table-column :formatter="transformDate" prop="interviewTime" label="面试时间" width="200">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDetailDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeUserDetail" :loading="changeUserDetailLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加沟通结果弹窗-->
    <el-dialog title="添加沟通结果(10s后生效)" v-model="addReserveRecord" size="small" @close="closeReserveRecord">

      <el-form class="demo-form-inline">
        <el-form-item label="沟通结果">
          <el-select v-model="addReserveData.operateResultType" placeholder="请选择">
            <el-option label="一次挂断" value="1"></el-option>
            <el-option label="二次挂断" value="2"></el-option>
            <el-option label="三次挂断" value="3"></el-option>
            <el-option label="条件符合" value="4"></el-option>
            <!-- <el-option label="待二面" value="5"></el-option> -->
            <el-option label="电话联系" value="1016"></el-option>
            <el-option label="其他" value="1017"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下次预约时间" v-if="addReserveData.operateResultType != 4">
          <el-date-picker :editable="false" v-model="addReserveData.nextAppointTime" type="datetime" placeholder="选择日期时间"
                          :picker-options="nextAppointTimePick">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面试时间" v-if="addReserveData.operateResultType == 4">
          <el-date-picker :editable="false" v-model="addReserveData.nextAppointTime" type="datetime" placeholder="选择日期时间"
                          :picker-options="nextAppointTimePick">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addReserveData.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addReserveRecord = false">取 消</el-button>
        <el-button type="primary" @click="addReserve" :loading="addReserveBlock">确 定</el-button>
      </div>
    </el-dialog>
    <!--移交dialog-->
    <el-dialog title="移交" v-model="showTransferDialog" size="small" @close="closeTransferDialog">
      <el-form>
        <el-form-item label="移交原因">
          <el-select v-model="transferReason" placeholder="请选择">
            <el-option v-for="(item,index) in transferReasonOptions" :label="item.label" :key="index"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="title">移交对象</div>
          <el-radio-group class="choose" v-model="transferChosed">
            <el-radio v-for="(item,index) in transferList" :label="item.toCommissionerId" :key="index"
                      style="width:45%;">{{ item.comissionerName }}{{ item.mobile }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTransferDialog = false">取 消</el-button>
        <el-button type="primary" @click="transferClick">确 定</el-button>
      </div>
    </el-dialog>


    <!--跑单dialog-->
    <el-dialog title="跑单" v-model="showOperations" size="small" @close="closeOperationsDialog">
      <el-form>
        <el-form-item label="跑单原因">
          <el-select v-model="operationsReason" placeholder="请选择">
            <el-option v-for="(item,index) in operations" :label="item.label" :key="index" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showOperations = false">取 消</el-button>
        <el-button type="primary" @click="operationsClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {gradeSubject} from '../../../src/data/index.js';
  import {getDate} from '../../../src/utils/assist.js';
  function adjustTime() {
    const hour = new Date().getHours();
    if (hour >= 10) {
      return getDate(10, 1);
    } else {
      return getDate(10);
    }
  }
  export default {
    name: 'processTable',
    data() {
      return {
        options: {
          sex: [{
            value: '男',
            label: '男'
          }, {
            value: '女',
            label: '女'
          }, {
            value: '不确定',
            label: '不确定'
          }],
          education: [{
            value: 1,
            label: '本科'
          }, {
            value: 2,
            label: '硕士'
          }, {
            value: 3,
            label: '博士'
          }],
          employmentNature: [{
            value: 1,
            label: '全职'
          }, {
            value: 2,
            label: '校招全职'
            // }, {
            //     value: 0,
            //     label: '未定'
          }],
          positionType: [{
            //     value: 0,
            //     label: '未定'
            // }, {
            value: 1,
            label: '坐班'
          }, {
            value: 2,
            label: '非坐班'
          }],
          grade: [{
            value: '小学',
            label: '小学'
          }, {
            value: '初中',
            label: '初中'
          }, {
            value: '高中',
            label: '高中'
          },{
            value: '少儿',
            label: '少儿'
          }],
          subject: [{}],
          monthSalary: [{
            value: 2200,
            label: '2200'
          }, {
            value: 2500,
            label: '2500'
          }, {
            value: 3600,
            label: '3600'
          }, {
            value: 4000,
            label: '4000'
            // }, {
            // value: 0,
            // label: '未填'
          }]
        },
        // 个人基本信息弹窗
        userDetailDialog: false,
        userDetailTabNumber: 'first',
        userDetailId: '',
        userDetailName: '',
        userDetailMobile: '',
        userDetailData: {
          graduateInfos: [{
            graduatedSchool: '',
            graduatedYear: '',
            education: '',
          }],
          positionType: 2
        },
        userDetailDataPlus: '',
        userDetailDataReserveRecords: [],
        changeUserDetailLoading: false,
        // 添加沟通结果弹窗
        addReserveRecord: false,
        addReserveData: {
          operateResultType: '',
          nextAppointTime: adjustTime(),
          remark: ''
        },
        addReserveBlock: false,

        // 搜素字段
        search_data: {
          communicateResult: '',//number
          education: '',//number
          employmentNature: '',//number
          endApplyDate: '',//string
          grade: '',//number
          followPerson: '',//string
          keyWord: '',//string
          startApplyDate: '',//string
          subject: '',//number
          testStatus: '',//number
          pageNo: 1,//number
          pageSize: 10,//number
          // sortField:"waitTwoInterviewRemark",
          // sortType:"DESC"
        },
        page_size: 10,
        searchDateArea: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        nextAppointTimePick: {
          disabledDate(time) {
            if (new Date().getHours() <= 10) {
              return time.getTime() < Date.now() - 8.64e7;
            }
            return time.getTime() < Date.now();
          },
        },
        // 初始table数据
        table_data: [],
        tableLoading: true,
        table_data_total: 0,
        // 被选择的用户
        selectName: [],
        // currentPage:1,
        // 用户详情弹窗
        book_user_detail: false,

        // 右上角点击loading
        exportExcelLoading: false,
        standUpTogetherLoading: false,
        interviewNoticeLoading: false,

        // 移交
        showTransferDialog: false,
        transferList: [],
        transferChosed: '',
        transferReason: '',
        teacherIds: '',
        // 移交原因列表
        // 1-员工离职 2-名单分配 3-其他
        transferReasonOptions: [{
          value: 1,
          label: '员工离职'
        }, {
          value: 2,
          label: '名单分配'
        }, {
          value: 3,
          label: '其他'
        }],

        // 面试通知
        interviewLoading: false,
        //跑单
        teacherId: '',
        //是否批量
        allOperations:false,
        showOperations: false,
        operationsReason: '',
        operations: [
          {value: 0, label: '未交笔试'},
          {value: 1, label: '入职时间'},
          {value: 2, label: '毕业时间'},
          {value: 3, label: '职业发展'},
          {value: 4, label: '找兼职'},
          {value: 5, label: '科目不符'},
          {value: 6, label: '学历不符'},
          {value: 7, label: '主动放弃'},
          {value: 8, label: '无法联系'},
          {value: 9, label: '待定'},
          {value: 10, label: '其他'}
        ]
      }
    },
    methods: {
      //选择年级变化
      gradeChange() {
        this.options.subject = [];
        (gradeSubject[this.userDetailData.grade] || []).forEach((val) => {
          this.options.subject.push({
            value: val,
            label: val
          });
        })
      },
      checkPermission(permissionName) {
        return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
      },
      // 获取表单数据
      getTableData() {
        this.tableLoading = true;
        this.$Fetch({
          url: '/api/reserve/getTeachers',
          method: 'post',
          data: this.search_data
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.table_data = data.list;
            this.table_data_total = data.total;
          } else {
            this.$Message({
              message,
            });
          }
          this.tableLoading = false;
        }).catch(message => {
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
        // this.tableLoading = true;
        this.getTableData();
      },
      handleCurrentChange(currentPage) {
        // this.currentPage = currentPage;
        this.search_data.pageNo = currentPage;
        // this.tableLoading = true;
        this.getTableData();
      },
      // 选择日期范围
      chooseDate() {
        this.search_data.startApplyDate = new Date(this.searchDateArea[0]).getTime();
        this.search_data.endApplyDate = new Date(this.searchDateArea[1]).getTime();
      },
      // 查询
      search() {
        // this.tableLoading = true;
        this.search_data.pageNo = 1;
        this.getTableData();
      },
      // 点击用户名查看详情
      userDetail(id, name, mobile) {
        this.userDetailDialog = true;
        this.userDetailId = id;
        this.userDetailName = name;
        this.userDetailMobile = mobile;
        this.$Fetch({
          url: '/api/reserve/basicInfo?teacherId=' + id,
          method: 'get'
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.userDetailData = data;
          } else {
            this.$Message({
              message
            });
          }
        }).catch(message => {
          this.userDetailDialog = false;
        });
      },
      // 关闭用户详情弹窗
      closeUserDetailDialog() {
        this.userDetailTabNumber = 'first';
        this.userDetailData = {
          graduateInfos: [{
            graduatedSchool: '',
            graduatedYear: '',
            education: '',
          }],
          positionType: 2
        };
        this.userDetailDataPlus = '';
        this.userDetailDataReserveRecords = [];
        this.changeUserDetailLoading = false;
      },
      // 保存修改后的用户详情 api/reserve/updateBasicInfo
      changeUserDetail() {
        this.changeUserDetailLoading = true;
        this.$Fetch({
          url: '/api/reserve/updateBasicInfo',
          method: 'post',
          data: this.userDetailData
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message: '成功保存用户基本信息',
              type: 'success'
            });
            this.userDetailDialog = false;
          } else {
            this.$Message({
              message
            });
          }
          this.changeUserDetailLoading = false;
        }).catch(message => {
          this.changeUserDetailLoading = false;
        });
      },
      // 用户详情tab键
      userDetailTab(tab, event) {
        let url = '';
        const id = this.userDetailId;
        if (tab.index == 1) {
          this.$Fetch({
            url: `/api/reserve/testInfo?teacherId=${id}`,
            method: 'get'
          }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
              this.userDetailDataPlus = data;
            } else {
              this.$Message({
                message
              });
            }
          });
        }
        else if (tab.index == 2) {
          this.$Fetch({
            url: `/api/reserve/getReserveRecords?teacherId=${id}`,
            method: 'get'
          }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
              this.userDetailDataReserveRecords = data;
            } else {
              this.$Message({
                message
              });
            }
          });
        }
        else {
          return;
        }
      },

      // 增加沟通结果
      addReserve() {
        this.addReserveBlock = true;
        let postData = {
          operateResultType: this.addReserveData.operateResultType,
          remark: this.addReserveData.remark,
          teacherId: this.userDetailId
        }
        // if (this.addReserveData.operateResultType != 4) {
        postData.nextAppointTime = this.addReserveData.nextAppointTime ? this.addReserveData.nextAppointTime.getTime() : '';
        // }
        this.$Fetch({
          url: '/api/reserve/addReserveRecord',
          method: 'post',
          data: postData
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.addReserveRecord = false;
            this.$Message({
              message,
              type: 'success'
            });
            this.userDetailDialog = false;
            this.getTableData();
          } else {
            this.$Message({
              message
            });
          }
          this.addReserveBlock = false;
        }).catch(message => {
          this.addReserveBlock = false;
        });
      },

      // 关闭增加沟通结果弹窗
      closeReserveRecord() {
        this.addReserveRecord = false;
        this.addReserveData = {
          operateResultType: '',
          nextAppointTime: adjustTime(),
          remark: ''
        };
      },

      // 面试通知
      interviewNotice(id, index) {
        this.interviewLoading = true;
        this.$Fetch({
          url: '/api/reserve/interviewNotice?teacherId=' + id,
          method: 'get'
        }).then((result) => {
          // const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message,
              type: 'success'
            });
            this.table_data.splice(index, 1);
            // this.getTableData();
          } else {
            this.$Message({
              message
            });
          }
          this.interviewLoading = false;
        }).catch(message => {
          this.interviewLoading = false;
        });
      },
      // 面试通知-批量
      interviewNoticeTogether(ids) {
        this.interviewNoticeLoading = true;
        this.$Fetch({
          url: '/api/reserve/batchInterviewNotice',
          method: 'post',
          data: {
            teacherIds: ids
          }
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            const h = this.$createElement;
            let dataArray = Object.keys(data);
            if (dataArray.length > 0) {
              let elementArray = [];
              dataArray.forEach((value) => {
                elementArray.push(h('p', value + '： ' + data[value]));
              });
              this.$notify({
                title: '面试通知结果',
                message: h('div', elementArray),
                duration: 0
              });
            }
            else {
              this.$notify({
                title: '面试通知结果',
                message: h('div', '全部通知成功'),
                duration: 0
              });
            }
            // this.table_data.forEach((value,index)=>{
            //     if(ids.indexOf(id)>-1){

            //     }
            // });
            // this.table_data.splice(index,1);
          } else {
            this.$Message({
              message
            });
          }
          this.interviewNoticeLoading = false;
        }).catch(message => {
          this.interviewNoticeLoading = false;
        });
      },
      // 确定跑单
      operationsClick(){
        let baseUrl
        let baseData
        if(this.allOperations){
          baseUrl = '/api/reserve/batchStandUp'
          baseData = {teacherIds:this.teacherId,reason:this.operationsReason}
        } else {
          baseUrl = '/api/reserve/standUp'
          baseData = {teacherId:this.teacherId,reason:this.operationsReason}
        }
        this.$Fetch({
          url: baseUrl,
          method: 'post',
          data: baseData
        }).then((result) => {
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message,
              type: 'success'
            });
            this.getTableData()
            this.showOperations = false
            this.allOperations = false
//            this.table_data.splice(index, 1);
          } else {
            this.$Message({
              message
            });
          }
        });
      },
      //取消跑单
      closeOperationsDialog(){
        this.allOperations = false
        this.showOperations = false
        this.operationsReason = ''
      },
      // 跑单
      standUp(id, index) {
        this.showOperations = true
        this.teacherId = id
      },
      // 跑单-批量
      standUpTogether(ids) {
        this.standUpTogetherLoading = true;
        this.$Fetch({
          url: '/api/reserve/batchStandUp',
          method: 'post',
          data: {
            teacherIds: ids
          }
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message,
              type: 'success'
            });
            this.getTableData()
          } else {
            this.$Message({
              message
            });
          }
          this.standUpTogetherLoading = false;
        }).catch(message => {
          this.standUpTogetherLoading = false;
        });
      },
      // 催笔试
      urgeTest(id) {
        if (!id) {
          id = this.selectName;
        } else {
          id = [id];
        }
        this.$Fetch({
          url: '/api/reserve/remindTeacherExam',
          method: 'post',
          data: {
            teacherIds: id
          }
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            this.$Message({
              message: '催笔试成功',
              type: 'success'
            });
          } else {
            this.$Message({
              message
            });
          }
        });
      },
      // 移交
      transfer(id) {
        if (id) {
          this.teacherIds = [id];
        }
        else {
          this.teacherIds = this.selectName;
        }
        this.showTransferDialog = true;

        this.$Fetch({
          url: '/api/reserve/getMayTransferComissioners',
          method: 'get'
        }).then((result) => {
          const data = result.data;
          this.transferList = data;
        }).catch(message => {
          this.showTransferDialog = false;
        });
      },
      // 关闭移交弹窗
      closeTransferDialog() {
        this.transferReason = '';
        // this.toCommissionerId = '';
        this.transferList = [];
        this.transferChosed = '';
      },
      // 确定移交
      transferClick() {
        this.$Fetch({
          url: '/api/reserve/transferTeacher',
          method: 'post',
          data: {
            teacherIds: this.teacherIds,
            toCommissionerId: this.transferChosed,
            transferReasonType: this.transferReason
          }
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          if (code == 0) {
            this.$Message({
              message: result.message,
              type: 'success'
            });
          }
          else if (code == 1) {
            this.$Message({
              message: result.message,
            });
          }
          this.showTransferDialog = false;
        });
      },
      // 导出excel
      exportExcel(ids) {
        const url = `/api/teacher-web/api/reserve/export?communicateResult=${this.search_data.communicateResult}&education=${this.search_data.education}&employmentNature=${this.search_data.employmentNature}&endApplyDate=${this.search_data.endApplyDate}&grade=${this.search_data.grade}&keyWord=${this.search_data.keyWord}&startApplyDate=${this.search_data.startApplyDate}&subject=${this.search_data.subject}&testStatus=${this.search_data.testStatus}`;
        window.open(url, '_blank');
      },
      selectTable(val) {
        let ids = [];
        val.forEach((value) => {
          ids.push(value.id.toString());
        });
        this.selectName = ids;
      },
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
      this.$on("search", function (val) {
        this.search_data.keyWord = val.keyWord || '';
        this.getTableData();
      });
    }
  }
</script>
