<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" class="search-form">
            <el-form-item label="报名年级">
                <el-select v-model="search_data.grade" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="小学" value="0"></el-option>
                    <el-option label="初中" value="1"></el-option>
                    <el-option label="高中" value="2"></el-option>
                    <el-option label="少儿" value="3"></el-option>
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
                </el-select>
            </el-form-item>
            <el-form-item label="排课计划">
                <el-select v-model="search_data.coursesScheme" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="推荐排课" value="19"></el-option>
                    <el-option label="未排课" value="0"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="测评课结果">
                    <el-select v-model="search_data.assessmentClassResult" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="合格" value="1"></el-option>
                        <el-option label="不合格" value="2"></el-option>
                    </el-select>
                </el-form-item> -->
            <el-form-item label="培训时间">
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
                <span class="table-title">共{{table_data_total}}个待培训老师</span>
                <el-button size="small" @click="exportExcel" type="text" v-if="checkPermission('tea:process:export-excel')">导出Excel</el-button>
                <el-button size="small" @click="offerNotice" type="text" :loading="offerNoticeLoading">offer通知</el-button>
            </div>

            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column v-if="checkPermission('tea:process:common-info')" align="center" label="姓名" width="120" fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row.id, scope.row.name, scope.row.mobile)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-else prop="name" align="center" label="姓名" width="120" fixed>
                </el-table-column>
                <el-table-column prop="trainingDate" align="center" label="培训时间" width="200" :formatter="transformDate">
                </el-table-column>
                <el-table-column prop="employmentNature" align="center" label="用工性质" width="120">
                </el-table-column>
                <el-table-column prop="subject" align="center" label="报名科目" width="100">
                </el-table-column>
                <el-table-column prop="grade" align="center" label="报名年级" width="100">
                </el-table-column>
                <el-table-column prop="lesson01" align="center" label="第1课" width="100">
                </el-table-column>
                <el-table-column prop="lesson02" align="center" label="第2课" width="100">
                </el-table-column>
                <el-table-column prop="lesson03" align="center" label="第3课" width="100">
                </el-table-column>
                <el-table-column prop="lesson04" align="center" label="第4课" width="100">
                </el-table-column>
                <el-table-column prop="lesson05" align="center" label="第5课" width="100">
                </el-table-column>
                <el-table-column prop="lesson06" align="center" label="第6课" width="100">
                </el-table-column>
                <el-table-column prop="lesson07" align="center" label="第7课" width="100">
                </el-table-column>
                <el-table-column prop="lesson08" align="center" label="第8课" width="100">
                </el-table-column>
                <el-table-column prop="arrangeResult" align="center" label="排课计划" width="100">
                </el-table-column>
                <el-table-column prop="assessmentResult" align="center" label="测评课结果" width="120">
                </el-table-column>
                <el-table-column prop="followPerson" align="center" label="跟进人" width="140">
                </el-table-column>
                <el-table-column prop="remark" align="center" label="备注">
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>
        </div>
        <el-dialog title="待培训的配置（修改后10s生效）" v-model="userDetailDialog" size="large" @close="closeUserDetailDialog">
            <div class="order_dialog_header">
                <div @click="addAssessmentClick" class="add-reserve">
                    <i class="el-icon-plus"></i>
                    <span>添加测评课结果</span>
                </div>
                <div @click="addOfferRemarkClick" class="add-reserve">
                    <i class="el-icon-plus"></i>
                    <span>offer通知</span>
                </div>
                <div @click="addArrangeClick" class="add-reserve">
                    <i class="el-icon-plus"></i>
                    <span>添加排课计划</span>
                </div>
                <div @click="addTrainingClick" class="add-reserve">
                    <i class="el-icon-plus"></i>
                    <span>添加培训结果</span>
                </div>
                <!-- <div @click="addOfferRemarkClick" class="add-reserve">
                        <i class="el-icon-plus"></i>
                        <span>添加offer备注</span>
                    </div> -->
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
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userDetailDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeUserDetail">确 定</el-button>
            </div>
        </el-dialog>
        <!--添加培训结果弹窗-->
        <el-dialog title="添加培训结果(10s后生效)" v-model="addTrainingDialog" size="small" @close="closeTrainingDialog">
            <el-form label-position="left" label-width="120px" class="add-review-form">
                <el-form-item v-for="(item, index) in addTrainingData" :key="index" :label="item.label">
                    <el-select v-model="item.itemName" clearable placeholder="请选择" style="float:left;width:100px;">
                        <el-option label="A" value="A"></el-option>
                        <el-option label="A-" value="A-"></el-option>
                        <el-option label="B++" value="B++"></el-option>
                        <el-option label="B+" value="B+"></el-option>
                        <el-option label="B" value="B"></el-option>
                        <el-option label="B-" value="B-"></el-option>
                        <el-option label="C+" value="C+"></el-option>
                        <el-option label="C" value="C"></el-option>
                        <el-option label="C-" value="C-"></el-option>
                        <el-option label="D" value="D"></el-option>
                        <el-option label="缺席" value="缺席"></el-option>
                        <el-option label="延迟" value="延迟"></el-option>
                        <el-option label="出席" value="出席"></el-option>
                    </el-select>
                    <label class="el-form-item__label" style="width: 80px; margin-left:20px;">
                        备注：
                    </label>
                    <el-input v-model="item.remark" placeholder="请输入内容" style="width:250px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addTrainingDialog = false">取 消</el-button>
                <el-button type="primary" @click="addTraining" :loading="addTrainingBlock">确 定</el-button>
            </div>
        </el-dialog>
        <!--添加测评课结果弹窗-->
        <el-dialog title="添加测评课结果(10s后生效)" v-if="addAssessmentDialog" v-model="addAssessmentDialog" size="small" @close="closeAssessmentDialog">
            <el-form label-position="left" label-width="120px" class="add-review-form">
                <el-form-item label="测评课结果">
                    <el-radio-group v-model="operateResultType">
                        <el-radio label="23">合格</el-radio>
                        <el-radio label="24">不合格</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAssessmentDialog = false">取 消</el-button>
                <el-button type="primary" @click="addAssessment" :loading="addAssessmentBlock">确 定</el-button>
            </div>
        </el-dialog>
        <!--添加排课计划弹窗-->
        <el-dialog title="添加排课计划(10s后生效)" v-if="addArrangeClassDialog" v-model="addArrangeClassDialog" size="small" @close="closeArrangeClassDialog">
            <el-form label-position="left" label-width="80px" class="add-review-form">
                <el-form-item label="排课计划">
                    <el-radio-group v-model="arrangeType">
                        <el-radio label="19">建议排课</el-radio>
                        <el-radio label="20">不建议排课</el-radio>
                        <el-radio label="21">缺席</el-radio>
                        <el-radio label="22">延期</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="arrangeRemark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addArrangeClassDialog = false">取 消</el-button>
                <el-button type="primary" @click="addArrange" :loading="addArrangeBlock">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加offer备注 -->
        <el-dialog title="添加offer沟通备注" v-if="addOfferRemarkDialog" v-model="addOfferRemarkDialog" size="small" @close="closeAddOfferRemark">
            <el-form label-position="left" label-width="80px" class="add-review-form">
                <el-form-item label="沟通结果">
                    <el-radio-group v-model="addOfferRemarkData.offerCommunicateType">
                        <el-radio label="17">符合</el-radio>
                        <el-radio label="18">不符合</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="addOfferRemarkData.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addOfferRemarkDialog = false">取 消</el-button>
                <el-button type="primary" @click="addOfferRemark" :loading="addOfferRemarkBlock">确 定</el-button>
            </div>
        </el-dialog>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import { gradeSubject } from '../../../src/data/index.js';
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
                positionType: 2
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

            changeUserDetailLoading: false,

            // 添加培训结果弹窗
            addTrainingDialog: false,
            addTrainingData: [],
            addTrainingBlock: false,
            // 添加测评课结果弹窗
            addAssessmentDialog: false,
            addAssessmentData: '',
            addAssessmentBlock: false,
            operateResultType: '',
            remark: '',
            // 添加排课计划弹窗
            addArrangeClassDialog: false,
            addArrangeBlock: false,
            arrangeType: '',
            arrangeRemark: '',
            // 添加offer备注
            addOfferRemarkDialog: false,
            addOfferRemarkBlock: false,
            addOfferRemarkData: {
                offerCommunicateType: '',
                remark: ''
            },
            // 批量offer通知
            offerNoticeLoading: false,
            // 搜素字段
            search_data: {
                // coursesScheme: '',//string
                // assessmentClassResult: '',//string
                grade: '',
                subject: '',
                coursesScheme: '',//string
                // assessmentClassResult: '',//string
                startTrainingDate: '',//string
                endTrainingDate: '',//string
                startApplyDate: '',
                endApplyDate: '',

                keyWord: '',//string
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
            // 初始table数据
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 被选择的用户
            selectName: [],
            // currentPage:1,
            // 用户详情弹窗
            book_user_detail: false
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
                url: '/api/train/getTeachers',
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
            else {
                return;
            }
        },
        // 点击添加培训结果按钮
        addTrainingClick() {
            this.addTrainingDialog = true;
            this.$Fetch({
                url: '/api/train/getTrainingRecords?id=' + this.userDetailId,
                method: 'get'
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    // this.addTrainingDialog = false;
                    this.addTrainingData = data;
                    for (let i = 1; i <= 8; i++) {
                        if (!this.addTrainingData[i - 1]) {
                            this.addTrainingData.push({
                                itemCode: '',
                                itemName: null,
                                remark: ''
                            })
                        };
                        this.addTrainingData[i - 1].label = `第${i}课培训结果`;
                    }
                } else {
                    this.$Message({
                        message
                    });
                }
            }).catch(message => {
              this.addTrainingData = false;
            });
        },

        // 添加培训结果
        addTraining() {
            this.addTrainingBlock = true;
            const postData = {
                id: this.userDetailId,
                list: []
            };
            const itemList = ["A", "A-", "B++", "B+", "B", "B-", "C+", "C", "C-", "D", "缺席", "延迟", "出席"];
            for (let i = 1; i <= this.addTrainingData.length; i++) {
                postData.list.push({
                    remark: this.addTrainingData[i - 1].remark,
                    trainNumber: i,
                    itemName: this.addTrainingData[i - 1].itemName,
                    itemCode: itemList.indexOf(this.addTrainingData[i - 1].itemName) + 1
                });
            }
            this.$Fetch({
                url: '/api/train/addTrainingRecord',
                method: 'post',
                data: postData
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.addTrainingDialog = false;
                    this.$Message({
                        message,
                        type: 'success'
                    });
                } else {
                    this.$Message({
                        message
                    });
                }
                this.addTrainingBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.addTrainingBlock = false;
                    }
                });
        },
        closeTrainingDialog() {
            this.addTrainingData = [];
            this.addTrainingDialog = false;
            this.addTrainingBlock = false;
        },
        // 点击添加测评课结果按钮
        addAssessmentClick() {
            this.addAssessmentDialog = true;
        },
        // 添加测评课结果
        addAssessment() {
            this.addAssessmentBlock = true;

            this.$Fetch({
                url: '/api/train/addAssessmentClassRecord',
                method: 'post',
                data: {
                    id: this.userDetailId,
                    operateResultType: this.operateResultType,
                    remark: this.remark
                }
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.addAssessmentDialog = false;
                    this.$Message({
                        message,
                        type: 'success'
                    });
                } else {
                    this.$Message({
                        message
                    });
                }
                this.addAssessmentBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.addAssessmentBlock = false;
                    }
                });
        },
        // 关闭添加测评课结果弹窗
        closeAssessmentDialog() {
            this.operateResultType = '';
            this.remark = '';
            this.addAssessmentBlock = false;
            this.addAssessmentDialog = false;
        },

        // 关闭增加面试结果弹窗
        closeOfferRecord() {
            this.addOfferRecord = false;
            this.addOfferData = {
                enterTime: ''
            };
        },

        // 点击添加排课计划按钮
        addArrangeClick() {

            this.addArrangeClassDialog = true;
        },
        // 添加排课计划
        addArrange() {
            this.addArrangeBlock = true;

            this.$Fetch({
                url: '/api/train/addArrangeClass',
                method: 'post',
                data: {
                    id: this.userDetailId,
                    operateResultType: this.arrangeType,
                    remark: this.arrangeRemark
                }
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.addArrangeClassDialog = false;
                    this.$Message({
                        message,
                        type: 'success'
                    });
                } else {
                    this.$Message({
                        message
                    });
                }
                this.addArrangeBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.addArrangeBlock = false;
                    }
                });
        },
        // 关闭添加排课计划弹窗
        closeArrangeClassDialog() {
            this.addArrangeClassDialog = false;
            this.arrangeType = '';
            this.arrangeRemark = '';
        },
        // 点击添加offer备注
        addOfferRemarkClick() {
            this.addOfferRemarkDialog = true;

            // this.$Fetch({
            //     url: '/api/offer/offerNotice',
            //     method: 'post',
            //     data: {
            //         teacherIds: [this.userDetailId]
            //     }
            // }).then((result) => {
            //     const data = result.data;
            //     const code = result.code;
            //     const message = result.message;
            //     if (code == 0) {
            //         this.$Message({
            //             message: '添加offer通知备注成功',
            //             type: 'success'
            //         });
            //         this.userDetailDialog = false;
            //         this.search();
            //     } else {
            //         this.$Message({
            //             message
            //         });
            //     }
            //     this.addArrangeBlock = false;
            // })
            //     .catch((err) => {
            //         if (err) {
            //             // this.addArrangeBlock = false;
            //         }
            //     });
        },
        // 添加offer备注
        addOfferRemark() {
            this.addOfferRemarkBlock = true;

            this.$Fetch({
                url: '/api/train/offerNotice',
                method: 'post',
                data: Object.assign({ id: this.userDetailId }, this.addOfferRemarkData)
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    this.$Message({
                        message: 'offer通知成功',
                        type: 'success'
                    });
                    this.addOfferRemarkDialog = false;
                } else {
                    this.$Message({
                        message
                    });
                }
                this.addOfferRemarkBlock = false;
            })
                .catch((err) => {
                    if (err) {
                        this.addArrangeBlock = false;
                    }
                });
        },
        // 关闭添加offer备注弹窗
        closeAddOfferRemark() {
            this.addOfferRemarkDialog = false;
            this.addOfferData = {
                offerCommunicateType: '',
                remark: ''
            };
        },
        // 批量offer通知
        offerNotice() {
            this.offerNoticeLoading = true;
            this.$Fetch({
                url: '/api/train/offerNotices',
                method: 'post',
                data: {
                    teacherIds: this.selectName
                }
            }).then((result) => {
                const data = result.data;
                const code = result.code;
                const message = result.message;
                if (code == 0) {
                    const h = this.$createElement;
                    const msg = Object.keys(data).reduce((acc, cur) => {
                        acc.push(h('p', `${cur}:${data[cur]}`));
                        return acc;
                    }, [])
                    this.$notify.info({
                        title: 'offer通知结果',
                        message: h('div', msg),
                        duration: 0
                    });

                    this.userDetailDialog = false;
                    this.search();
                } else {
                    this.$Message({
                        message
                    });
                }
                this.offerNoticeLoading = false;
                // this.addArrangeBlock = false;
            })
            .catch((err) => {
                if (err) {
                    // this.addArrangeBlock = false;
                }
                this.offerNoticeLoading = false;
            });

        },
        // 导出excel
        exportExcel() {
            const url = `/api/teacher-web/api/train/export?keyWord=${this.search_data.keyWord}&endApplyDate=${this.search_data.endApplyDate}&startApplyDate=${this.search_data.startApplyDate}&subject=${this.search_data.subject}`;
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
        pagin_size: () => book_table_data.length,
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
        this.$on("search", function(val) {
            this.search_data.keyWord = val.keyWord || '';
            this.getTableData();
        });
    }
}
</script>
