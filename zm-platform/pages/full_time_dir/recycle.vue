<style lang="less" scoped>
.el-dropdown {
    float: right;
    font-size: 12px;
    .el-dropdown-link {
        color: #007fff;
        &:hover,
        &:focus {
            color: #4db3ff;
            border-color: #4db3ff;
        }
    }
}
</style>

<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
            <el-form-item label="原因">
                <el-select v-model="search_data.notValuableReasonType" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="预约跑单" value="8"></el-option>
                    <el-option label="面试拒绝" value="10"></el-option>
                    <el-option label="面试缺席" value="11"></el-option>
                    <el-option label="offer沟通失败" value="18"></el-option>
                    <el-option label="不建议排课" value="20"></el-option>
                    <el-option label="排课缺席" value="21"></el-option>
                    <el-option label="测评课-不合格" value="24"></el-option>
                    <el-option label="未签合同" value="26"></el-option>
                    <el-option label="培训通知跑单" value="3041"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键词">
                <el-input v-model="search_data.keyWord" placeholder="输入姓名或手机号"></el-input>
            </el-form-item>
            <el-form-item label="操作者">
              <el-input v-model="search_data.operatorName" placeholder="输入操作者姓名"></el-input>
            </el-form-item>

            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>
        </el-form>

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <span class="table-title">共{{table_data_total}}个回收站老师</span>
                <el-button size="small" @click="exportExcel" type="text" v-if="checkPermission('tea:process:export-excel')">导出Excel</el-button>
                <!-- <el-button @click="tableIconClick('recovery','恢复')" type="text" :loading="tableIconClickLoading.recoveryLoad">恢复</el-button> -->
                <el-dropdown trigger="click" @click="clickmenu()" @command="handleChoose">
                    <span class="el-dropdown-link">恢复至</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="待预约">待预约</el-dropdown-item>
                        <el-dropdown-item command="待面试">待面试</el-dropdown-item>
                        <el-dropdown-item command="待培训">待培训</el-dropdown-item>
                        <el-dropdown-item command="培训通知">培训通知</el-dropdown-item>
                        <el-dropdown-item command="待入职">待入职</el-dropdown-item>
                        <el-dropdown-item command="入职名单">入职名单</el-dropdown-item>
                        <el-dropdown-item command="离职名单">离职名单</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column align="center" type="selection" width="55" fixed>
                </el-table-column>
                <el-table-column v-if="checkPermission('tea:process:common-info')" align="center" label="姓名" width="120" fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-else prop="name" align="center" label="姓名" width="120" fixed>
                </el-table-column>
                <el-table-column prop="gender" align="center" label="性别" width="120">
                </el-table-column>
                <el-table-column prop="college" align="center" label="毕业院校" width="200">
                </el-table-column>
                <el-table-column prop="eduLevel" align="center" label="学历" width="160">
                </el-table-column>
                <el-table-column prop="mobile" align="center" label="联系方式" width="140">
                </el-table-column>
                <el-table-column prop="email" align="center" label="邮箱" width="200">
                </el-table-column>
                <el-table-column prop="qq" align="center" label="QQ" width="195">
                </el-table-column>
                <el-table-column prop="applyGrade" align="center" label="报名年级" width="140">
                </el-table-column>
                <el-table-column prop="applySubject" align="center" label="报名科目" width="120">
                </el-table-column>
                <el-table-column prop="notValuableReason" align="center" label="原因" width="185">
                </el-table-column>

                <el-table-column prop="operatorName" align="center" label="操作者" width="140">
                </el-table-column>
                <el-table-column prop="operatorDate" :formatter="transformDate" align="center" label="操作时间" width="200">
                </el-table-column>
                <el-table-column prop="remark" align="center" label="备注">
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right">
                    <template scope="scope" >
                        <el-dropdown trigger="click" @click="clickmenu(scope.row.id)" @command="handleChoose">
                            <span class="el-dropdown-link">恢复至</span>
                            <el-dropdown-menu slot="dropdown">
                                <Spin size="small" fix v-if="recoverLoading"></Spin>
                                <el-dropdown-item v-else v-for="(item,index) in recoverList" :key="index" :command="item">{{item}}</el-dropdown-item>
                                <!-- <el-dropdown-item command="待预约">待预约</el-dropdown-item>
                                <el-dropdown-item command="待面试">待面试</el-dropdown-item>
                                <el-dropdown-item command="待培训">待培训</el-dropdown-item>
                                <el-dropdown-item command="培训通知">培训通知</el-dropdown-item>
                                <el-dropdown-item command="待入职">待入职</el-dropdown-item>
                                <el-dropdown-item command="入职名单">入职名单</el-dropdown-item>
                                <el-dropdown-item command="离职名单">离职名单</el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>
            <!--恢复dialog-->
            <el-dialog title="恢复原因" v-model="showRcoverDialog" size="small" @close="closeShowRcoverDialog">
                <el-form>
                    <el-form-item label="恢复原因">
                        <el-input v-model="recoverReason" :autosize="{ minRows: 4, maxRows: 6}" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showRcoverDialog = false">取 消</el-button>
                    <el-button type="primary" @click="recover">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="离职名单的配置（修改后10s生效）" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
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

                    <el-tab-pane label="培训记录">
                        <el-table :data="userDetailDataTrainingRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="createdUser">
                            </el-table-column>
                            <el-table-column align="center" label="培训时间">
                                <template scope="scope">
                                    第{{ scope.row.trainNumber }}课
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="培训结果" prop="itemName">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="排课记录">
                        <el-table :data="userDetailDataArrangeClassesRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="createdUser">
                            </el-table-column>
                            <el-table-column align="center" label="排课计划" prop="operateResult">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="offer沟通记录">
                        <el-table :data="userDetailDataOfferRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="沟通记录" prop="operateResult">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="测评课记录">
                        <el-table :data="userDetailDataAssessmentRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="createdUser">
                            </el-table-column>
                            <el-table-column align="center" label="操作结果" prop="operateResult">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="合同记录">
                        <el-table :data="userDetailDataContractRecord" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="createdUser">
                            </el-table-column>
                            <el-table-column align="center" label="操作结果" prop="operateResult">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="离职记录">
                        <el-table :data="userDetailDataFarFarAeayRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="createdUser">
                            </el-table-column>
                            <el-table-column align="center" label="操作结果" prop="operateResult">
                            </el-table-column>
                            <el-table-column align="center" label="备注" prop="remark">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="回收站记录">
                        <el-table :data="userDetailDataRecycleRecords" border style="width:100%">
                            <el-table-column align="center" label="操作时间" width="200" prop="createdTime" :formatter="transformDate">
                            </el-table-column>
                            <el-table-column align="center" label="回收前流程" prop="teaPreviousStateStr">
                            </el-table-column>
                            <el-table-column align="center" label="操作人" prop="userName">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="userDetailDialog = false">取 消</el-button>
                    <el-button type="primary" @click="changeUserDetail">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { gradeSubject, fullTimePathName } from '../../../src/data/index';

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
            // 笔试信息
            userDetailDataPlus: '',
            // 预约记录
            userDetailDataReserveRecords: [],
            // 面试记录
            userDetailDataReviewRecords: [],
            // offer沟通记录
            userDetailDataOfferRecords: [],
            // 培训记录
            userDetailDataTrainingRecords: [],
            // 测评课记录
            userDetailDataAssessmentRecords: [],
            // 排课记录
            userDetailDataArrangeClassesRecords: [],
            // 合同记录
            userDetailDataContractRecord: [],
            // 离职记录
            userDetailDataFarFarAeayRecords: [],
            // 回收站记录
            userDetailDataRecycleRecords: [],
            changeUserDetailLoading: false,

            // 恢复至
            showRcoverDialog: false,
            recoverReason:'',
            target: '',
            targeter: '',
            recoverList:[],
            recoverLoading:false,
            // 恢复
            tableIconClickLoading: {
                recoveryLoad: false
            },

            // 搜素字段
            search_data: {
                notValuableReasonType: '',
                keyWord: '',//string
                pageNo: 1,//number
                pageSize: 10,//number
                operatorName:''
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
            // 初始table数据
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 被选择的用户
            selectName:[],
            // currentPage:1,
            // 用户详情弹窗
            book_user_detail: false
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 恢复至
        clickmenu(id) {
            this.targeter = id;
            if(id) {
                this.recoverLoading = true;
                this.recoverList = [];
                this.$Fetch({
                    url: `/api/notValuable/getOldProcesses?teacherId=${id}`,
                    method: 'get',
                }).then((result) => {
                    // this.tableLoading = false;

                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    this.recoverLoading = false;
                    if (code == 0) {
                        data.forEach(value=>{
                            this.recoverList.push(fullTimePathName[value])
                        })
                    } else {
                        this.$Message({
                            message: "调用后端数据失败"
                        });
                    }
                }).catch(message => {
                  this.recoverLoading = false;
                });
            }
        },
        handleChoose(target) {
            this.target = target;
            this.showRcoverDialog = true;
        },
        recover() {
            let data,url;
            if(this.targeter) {
                data = { id:this.targeter };
                url = '/api/notValuable/recoveryTo';
            } else {
                data = { teacherIds:this.selectName };
                url = '/api/notValuable/recovery';
            }
            Object.assign(data,{
                reason:this.recoverReason,
                state:fullTimePathName.indexOf(this.target)
            });
            this.$Fetch({
                url,
                method: 'post',
                data,
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;

                if (code == 0) {
                    const h = this.$createElement;
                    const msg = [];
                    message.split('\n').forEach(value=>{
                        msg.push(h('p',value));
                    });
                    this.$notify.info({
                        title: '恢复处理结果',
                        message: h('div',msg),
                        duration:0
                    });
                    this.getTableData();
                    this.showRcoverDialog = false;
                } else {
                    this.$Message({
                        message
                    });
                }
            });
        },
        closeShowRcoverDialog() {
            this.recoverReason = '';
            this.showRcoverDialog = false;
        },
        // 获取表单数据
        getTableData() {
          this.tableLoading = true;
            this.$Fetch({
                url: '/api/notValuable/getNotValuableTeaNames',
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
            this.getTableData();
        },
        // 导出excel
        exportExcel() {
            const url = `/api/teacher-web/api/notValuable/export?keyWord=${this.search_data.keyWord}&notValuableReasonType=${this.search_data.notValuableReasonType}`;
            window.open(url, '_blank');
        },
        selectTable(val) {
            let ids = [];
            val.forEach((value) => {
                ids.push(value.id.toString());
            });
            this.selectName = ids;
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
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }

            // 查看培训记录
            else if (tab.index == 4) {
                this.$Fetch({
                    url: `/api/train/getTrainingRecords?id=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataTrainingRecords = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看排课记录
            else if (tab.index == 5) {
                this.$Fetch({
                    url: `/api/train/getArrangeClasses?teacherId=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataArrangeClassesRecords = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看offer沟通结果
            else if (tab.index == 6) {
                this.$Fetch({
                    url: `/api/offer/getOfferRecords?teacherId=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataOfferRecords = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看测评课记录
            else if (tab.index == 7) {
                this.$Fetch({
                    url: `/api/train/getAssessmentClassRecords?teacherId=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataAssessmentRecords = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看合同记录
            else if (tab.index == 8) {
                this.$Fetch({
                    url: `/api/entry/getContractRecords?id=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataContractRecord = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看离职记录
            else if (tab.index == 9) {
                this.$Fetch({
                    url: `/api/willHaveMoney/getFarFarAeayRecords?id=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataFarFarAeayRecords = data;
                    } else {
                        this.$Message({
                            message
                        });
                    }
                });
            }
            // 查看回收站记录
            else if (tab.index == 9) {
                this.$Fetch({
                    url: `/api/notValuable/getNotValuableRecords?teacherId=${id}`,
                    method: 'get'
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;
                    if (code == 0) {
                        this.userDetailDataRecycleRecords = data;
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
        // // 表格右上角按钮点击
        // tableIconClick(type, name) {
        //     let protype = `${type}Load`;
        //     let url = `/api/notValuable/${type}`;
        //     let data = { teacherIds: this.selectName };
        //     console.log(data)
        //     this.tableIconClickLoading[protype] = true;
        //     this.$Fetch({
        //         url,
        //         method: 'post',
        //         data
        //     }).then((result) => {
        //         const data = result.data || {};
        //         const code = result.code;
        //         const message = result.message;
        //         if (code == 0) {
        //             this.addOfferRecord = false;
        //             this.$Message({
        //                 message: `${name}成功`,
        //                 type: 'success'
        //             });
        //         } else {
        //             this.$Message({
        //                 message
        //             });
        //         }
        //         this.tableIconClickLoading[protype] = false;
        //     })
        //         .catch((err) => {
        //             if (err) {
        //                 this.tableIconClickLoading[protype] = false;
        //             }
        //         });
        // }
    },
    computed: {
        pagin_size: () => book_table_data.length,
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        this.$on("search", function (val) {
            this.search_data.keyWord = val.keyWord || '';
            this.search_data.operatorName = val.operatorName || '';
            this.getTableData();
        });
        this.search_data.keyWord = this.$route.query.keyWord || '';
        // 请求初始表单数据
        this.getTableData();
    }
}
</script>
