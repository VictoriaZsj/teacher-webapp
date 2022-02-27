<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
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
            <el-form-item label="面试时间">
                <el-date-picker :editable="false" v-model="searchDateArea" type="daterange" align="right" placeholder="选择日期范围" @change="chooseDate" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进人">
                <el-input v-model="search_data.followPerson" placeholder="输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="关键词">
                <el-input v-model="search_data.keyWord" placeholder="输入姓名或手机号"></el-input>
            </el-form-item>
            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <span class="table-title">共{{table_data_total}}个待面试老师</span>
                <el-button type="text" size="small" @click="exportExcel" v-if="checkPermission('tea:process:export-excel')">导出Excel</el-button>
                <!-- <el-button type="text" size="small" @click="transfer()">移交</el-button> -->
            </div>

            <el-table :data="table_data" style="width:100%">
                <!-- <el-table-column align="center" type="selection" width="55">
                </el-table-column> -->
                <el-table-column v-if="checkPermission('tea:process:common-info')" align="center" label="姓名" width="120" fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-else prop="name" align="center" label="姓名" width="120" fixed>
                </el-table-column>
                <el-table-column prop="employmentNature" align="center" label="用工性质" width="120">
                </el-table-column>
                <el-table-column prop="graduatedSchool" align="center" label="毕业院校" width="180">
                </el-table-column>
                <el-table-column prop="education" align="center" label="学历" width="120">
                </el-table-column>
                <el-table-column prop="mobile" align="center" label="联系方式" width="130">
                </el-table-column>
                <el-table-column prop="grade" align="center" label="报名年级" width="100">
                </el-table-column>
                <el-table-column prop="subject" align="center" label="报名科目" width="100">
                </el-table-column>
                <el-table-column prop="interviewResult" align="center" label="面试结果" width="100">
                </el-table-column>
                <el-table-column prop="followPerson" align="center" label="跟进人" width="100">
                </el-table-column>
                <el-table-column prop="interviewer" align="center" label="面试官" width="100">
                </el-table-column>
                <el-table-column prop="interviewDate" align="center" label="面试时间" width="200" :formatter="transformDate">
                </el-table-column>
                <!-- <el-table-column align="center" label="操作" fixed="right">
                    <template scope="scope">
                        <el-button size="small" type="text" @click="transfer(scope.row.id)">移交</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>

        </div>
        <el-dialog title="待面试的配置（修改后10s生效）" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
            <div class="order_dialog_header">
                <div @click="addReviewIconClick" class="add-reserve" v-if="checkPermission('tea:interview:add-interview-record')">
                    <i class="el-icon-plus"></i>
                    <span>添加面试结果</span>
                </div>
                <div @click="changeTimeIconClick" class="add-reserve" v-if="checkPermission('tea:interview:add-interview-record')">
                    <i class="el-icon-edit"></i>
                    <span>修改面试时间</span>
                </div>
            </div>
            <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body">
                <el-tab-pane label="基本信息/简历" name="first">
                    <el-form ref="form" :inline="true" label-position="left" label-width="80px" v-if="checkPermission('tea:reserve:update-basic-info')">
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
                                <el-option v-for="(item,index) in options.employmentNature" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <br>

                        <el-form-item :label="'毕业院校-'+(index+1)" v-for="(item,index) in userDetailData.graduateInfos" :key="index" >
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
                                <el-option v-for="(item,index) in options.monthSalary" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="职位类型">
                            <el-select v-model="userDetailData.positionType" placeholder="请选择">
                                <el-option v-for="(item,index) in options.positionType" :key="index" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注">
                            {{ userDetailData.remark }}
                        </el-form-item>
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
                <el-tab-pane label="面试记录" name="fourth">
                    <div v-for="(item, index) in userDetailDataReviewRecords" :key="index" class="interview-result">
                        <p>第{{ index+1 }}次面试结果{{ item.interviewResultTypeStr }}</p>
                        <p>面试时间:{{ item.interviewTime | dateTransform }}</p>
                        <p>面试官:{{ item.interviewerName }}</p>
                        <p>授课风格:{{ item.teacherStyleTypeStr }}</p>
                        <p>初步评价: {{ item.firstEvaluateScoreStr }}
                        </p>
                        <p>
                            课件水平:
                            <el-rate v-model="item.teachScore" disabled show-text text-color="#ff9900" text-template="{value}">
                            </el-rate>
                        </p>
                        <p>
                            讲解水平:
                            <el-rate v-model="item.teachScore" disabled show-text text-color="#ff9900" text-template="{value}">
                            </el-rate>
                        </p>
                        <p>
                            互动水平:
                            <el-rate v-model="item.interactScore" disabled show-text text-color="#ff9900" text-template="{value}">
                            </el-rate>
                        </p>
                        <p>
                            个人仪容:
                            <el-rate v-model="item.appearanceScore" disabled show-text text-color="#ff9900" text-template="{value}">
                            </el-rate>
                        </p>
                        <p>面试结果:{{ item.interviewResultTypeStr }}</p>
                        <p>备注:{{ item.remark}}</p>
                    </div>
                </el-tab-pane>

            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userDetailDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeUserDetail">确 定</el-button>
            </div>
        </el-dialog>
        <!--添加面试结果弹窗-->
        <el-dialog title="添加面试结果(10s后生效)" v-model="addReviewRecord" size="small" @close="closeReviewRecord">
            <el-form label-position="left" label-width="80px" :model="addReviewData" class="add-review-form">
                <el-form-item label="面试时间">
                    <el-date-picker :editable="false" v-model="addReviewData.interviewTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="面试官">
                    <el-select v-model="addReviewData.interviewerUserId" placeholder="请选择">
                        <el-option v-for="(item,index) in commissioners" :key="index" :label="item.commissionerName" :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课风格">
                    <el-radio-group v-model="addReviewData.teacherStyleType">
                        <el-radio :label="1">亲切</el-radio>
                        <el-radio :label="2">幽默</el-radio>
                        <el-radio :label="3">严肃</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="初步评价">
                    <el-radio-group v-model="addReviewData.firstEvaluateScore">
                        <el-radio :label="1">特别优秀</el-radio>
                        <el-radio :label="2">优秀</el-radio>
                        <el-radio :label="3">一般</el-radio>
                        <el-radio :label="4">较差</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="课件水平">
                    <el-rate v-model="addReviewData.coursewareScore" allow-half :colors="['#f85d58', '#F7BA2A', '#65cea6']">
                    </el-rate>
                </el-form-item>
                <el-form-item label="讲解水平">
                    <el-rate v-model="addReviewData.teachScore" allow-half :colors="['#f85d58', '#F7BA2A', '#65cea6']">
                    </el-rate>
                </el-form-item>
                <el-form-item label="互动水平">
                    <el-rate v-model="addReviewData.interactScore" allow-half :colors="['#f85d58', '#F7BA2A', '#65cea6']">
                    </el-rate>
                </el-form-item>
                <el-form-item label="个人仪容">
                    <el-rate v-model="addReviewData.appearanceScore" allow-half :colors="['#f85d58', '#F7BA2A', '#65cea6']">
                    </el-rate>
                </el-form-item>
                <el-form-item label="面试结果">
                    <el-radio-group v-model="addReviewData.interviewResultType">
                        <el-radio :label="9">通过</el-radio>
                        <el-radio :label="5">待二面</el-radio>
                        <el-radio :label="10">拒绝</el-radio>
                        <el-radio :label="11">缺席</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addReviewData.remark">
                    </el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addReviewRecord = false">取 消</el-button>
                <el-button type="primary" @click="addReview" :loading="addReviewBlock">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改面试时间弹窗-->
        <el-dialog title="更新面试时间(10s后生效)" v-model="changeTimeDialog" size="small" @close="closeChangeTimeDialog">
            <el-form label-position="left" label-width="80px" :model="changeTimeData" class="add-review-form">
                <el-form-item label="面试时间">
                    <el-date-picker :editable="false" v-model="changeTimeData.nextAppointTime" type="datetime" placeholder="选择日期时间" :picker-options="nextAppointTimePick">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="changeTimeData.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeTimeDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeTime" :loading="changeTimeBlock">确 定</el-button>
            </div>
        </el-dialog>
        <!--移交dialog-->
        <!-- <el-dialog title="移交" v-model="showTransferDialog" size="small" @close="closeTransferDialog">
            <el-form>
                <el-form-item label="移交原因">
                    <el-select v-model="transferReason" placeholder="请选择">
                        <el-option v-for="(item,index) in transferReasonOptions" :label="item.label" :key="index" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="title">移交对象</div>
                    <el-radio-group class="choose" v-model="transferChosed">
                        <el-radio v-for="(item,index) in transferList" :label="item.toCommissionerId" :key="index" style="width:45%;">{{ item.comissionerName }}{{ item.mobile }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showTransferDialog = false">取 消</el-button>
                <el-button type="primary" @click="transferClick">确 定</el-button>
            </div>
        </el-dialog> -->
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { gradeSubject } from '../../../src/data/index.js';
import { getDate } from '../../../src/utils/assist.js';
function adjustTime() {
    const hour = new Date().getHours();
    if(hour >= 10) {
        return getDate(10,1);
    } else {
        return getDate(10);
    }
}
export default {
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
                subject: [{

                }],
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
                positionType:2
            },
            userDetailDataPlus: '',
            userDetailDataReserveRecords: [],
            userDetailDataReviewRecords: [],
            changeUserDetailLoading: false,

            // 添加面试结果弹窗
            addReviewRecord: false,
            addReviewData: {
                appearanceScore: null,	//个人仪容	string
                coursewareScore: null,	//课件水平	string
                firstEvaluateScore: '',//初步评价string
                interactScore: null,	//互动水平	string
                interviewResultType: '',	//面试结果	string
                interviewTime: '',	//面试时间	string
                interviewerUserId: '',	//面试官	string
                remark: '',//	备注	string
                teachScore: null,//	讲解水平	string
                teacherId: '',//	老师id	number	老师id, 唯一标识
                teacherStyleType: ''
            },
            addReviewBlock: false,
            commissioners: [],

            // 修改面试时间弹窗
            changeTimeDialog: false,
            changeTimeData: {
                nextAppointTime: '',	//面试时间	string
                remark: '',//	备注	string
            },
            changeTimeBlock: false,


            // 搜素字段
            search_data: {
                interviewResult: '',//number
                // communicateResult:'',//number
                // education:'',//number
                // employmentNature:'',//number
                endApplyDate: '',//string
                grade: '',//number
                keyWord: '',//string
                startApplyDate: '',//string
                subject: '',//number
                followPerson: '',//string
                // testStatus:'',//number
                pageNo: 1,//number
                pageSize: 10,//number
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
                    if(new Date().getHours() <=10) {
                        return time.getTime() < Date.now() -8.64e7;
                    }
                    return time.getTime() < Date.now();
                },
            },
            // 初始table数据
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 被选择的用户
            // selectName:[],
            // currentPage:1,
            // 用户详情弹窗
            book_user_detail: false,

            // 移交
            // showTransferDialog: false,
            // transferList: [],
            // transferChosed: '',
            // transferReason: '',
            // teacherIds: '',
            // // 移交原因列表
            // // 1-员工离职 2-名单分配 3-其他
            // transferReasonOptions: [{
            //     value: 1,
            //     label: '员工离职'
            // }, {
            //     value: 2,
            //     label: '名单分配'
            // }, {
            //     value: 3,
            //     label: '其他'
            // }],
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
                url: '/api/interview/getTeachers',
                method: 'post',
                data: this.search_data
            }).then((result) => {
                this.tableLoading = false;

                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.table_data = data.list;
                    this.table_data_total = data.total;
                } else {
                    this.$Message({
                        message: "调用后端数据失败"
                    });
                }
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
                positionType:2
            };
            this.userDetailDataPlus = '';
            this.userDetailDataReserveRecords = [];
            this.changeUserDetailLoading = false;
        },
        // 保存修改后的用户详情
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
            // 查看面试结果
            else if (tab.index == 3) {
                this.$Fetch({
                    url: `/api/interview/getInterviewRecords?teacherId=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataReviewRecords = data;
                        // this.userDetailDataReviewRecords.interviewTime =
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
        // 点击增加面试结果按钮
        addReviewIconClick() {
            this.addReviewRecord = true;
            this.$Fetch({
                url: '/api/interview/getInterviewTimeAndCommissionerId?teacherId=' + this.userDetailId,
                method: 'get'
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.addReviewData.interviewTime = data.interviewTime;
                    this.commissioners = data.commissioners;
                    this.addReviewData.interviewerUserId = data.commissioners[0].userId;

                } else {
                    this.$Message({
                        message
                    });
                }
                this.addReviewBlock = false;
            }).catch(message => {
              this.addReviewBlock = false;
            });
        },

        // 增加面试结果
        addReview() {
            this.addReviewBlock = true;
            const postData = JSON.parse(JSON.stringify(this.addReviewData));
            postData.interviewTime = new Date(postData.interviewTime).getTime();
            postData.teacherId = this.userDetailId;
            // postData.
            this.$Fetch({
                url: '/api/interview/addInterviewRecord',
                method: 'post',
                data: postData
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.addReviewRecord = false;
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
                this.addReviewBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.addReviewBlock = false;
                    }
                });
        },

        // 关闭增加面试结果弹窗
        closeReviewRecord() {
            this.addReviewRecord = false;
            this.addReviewData = {
                appearanceScore: null,	//个人仪容	string
                coursewareScore: null,	//课件水平	string
                firstEvaluateScore: '',//初步评价string
                interactScore: null,	//互动水平	string
                interviewResultType: '',	//面试结果	string
                interviewTime: '',	//面试时间	string
                interviewerUserId: '',	//面试官	string
                remark: '',//	备注	string
                teachScore: null,//	讲解水平	string
                teacherId: '',//	老师id	number	老师id, 唯一标识
                teacherStyleType: ''
            };
        },

        // 点击修改面试时间按钮
        changeTimeIconClick() {
            this.changeTimeDialog = true;
            this.changeTimeData.nextAppointTime = adjustTime();
        },

        // 修改面试时间
        changeTime() {
            this.changeTimeBlock = true;
            const postData = JSON.parse(JSON.stringify(this.changeTimeData));
            postData.nextAppointTime = new Date(postData.nextAppointTime).getTime();
            postData.teacherId = this.userDetailId;
            // postData.
            this.$Fetch({
                url: '/api/interview/updateReserveRecord',
                method: 'post',
                data: postData
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.changeTimeDialog = false;
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
                this.changeTimeBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.changeTimeBlock = false;
                    }
                });
        },

        // 关闭点击修改面试时间弹窗
        closeChangeTimeDialog() {
            this.changeTimeDialog = false;
            this.changeTimeData = {
                nextAppointTime: '',
                remark: ''
            };
        },

        // 导出excel
        exportExcel() {

            const url = `/api/teacher-web/api/interview/export?endApplyDate=${this.search_data.endApplyDate}&grade=${this.search_data.grade}&interviewResult=${this.search_data.interviewResult}&keyWord=${this.search_data.keyWord}&startApplyDate=${this.search_data.startApplyDate}&subject=${this.search_data.subject}`;
            window.open(url, '_blank');
        },
    },
    computed: {
        pagin_size: () => book_table_data.length,
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        this.$on("search",function(val){
            this.search_data.keyWord = val.keyWord || '';
            this.getTableData();
        });
        this.search_data.keyWord = this.$route.query.keyWord || '';
        // 请求初始表单数据

        this.getTableData();
    }
}
</script>
