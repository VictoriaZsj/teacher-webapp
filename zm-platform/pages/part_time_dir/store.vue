<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" style="overflow:visible;" class="search-form">
            <el-form-item label="老师">
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
            <el-form-item label="工作性质">
                <el-select v-model="search_data.timeType" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="兼职" value="0"></el-option>
                    <el-option label="公校兼职" value="3"></el-option>
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
            <el-form-item label="推荐人">
                <el-input v-model="search_data.referMobile" placeholder="输入推荐人手机号"></el-input>
            </el-form-item>
            <el-form-item label="所属学校">
                <el-input v-model="search_data.school" placeholder="输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="培训主题">
                <el-input v-model="search_data.trainTheme" placeholder="输入主题名称"></el-input>
            </el-form-item>
            <el-form-item label="是否可排课">
              <el-select v-model="search_data.recommend" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="建议排课" value="1"></el-option>
                  <el-option label="不建议排课" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间">
                <!-- <zm-datepicker type="day" v-model="search_data.storeTime"></zm-datepicker> -->
                <el-date-picker
                    v-model="storeTime"
                    type="daterange"
                    range-separator="至"
                    placeholder="请选择入库时间段">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="教师资格证">
                <el-select v-model="search_data.certificateState" placeholder="请选择">
                    <el-option v-for="(item, index) in teacherCertificateStateOption" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>

        </el-form>

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <span class="table-title">共{{table_data_total}}个老师</span>

                <el-button type="text" size="small" @click="openInterviewAuditSettingDialog()">修改状态</el-button>
                <el-button type="text" v-if="checkPermission('teachers-api:management.parttimetofulltime')" size="small" @click="toFullTime()">兼职转全职</el-button>
            </div>

            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column align="center" label="姓名"  fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row.teaId, scope.row.teaName, scope.row.referMobile, scope.row.bu)">{{scope.row.teaName}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属BU" >
                    <template scope="scope">
                        {{scope.row.teaBu | teaBuFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="工作性质" >
                    <template scope="scope">
                        {{scope.row.timeType | timeTypeFilters}}
                    </template>
                </el-table-column>
                <el-table-column prop="teacherLicenseStateStr" align="center" label="教师资格证" width="120">
                </el-table-column>
                <el-table-column prop="grade" align="center" label="年级" >
                </el-table-column>
                <el-table-column prop="subject" align="center" label="科目" >
                </el-table-column>
                <el-table-column align="center" label="排课状态值" >
                    <template scope="scope">
                        <el-input @blur="changeArrangementClass(scope.row.isArrangementClass)" v-model="scope.row.isArrangementClass" placeholder="请输入"></el-input>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否可排课" >
                    <template scope="scope">
                        {{scope.row.recommend | recommendFilters}}
                    </template>
                </el-table-column>
                <el-table-column prop="teaSuoshuschool" align="center" label="所属学校" >
                </el-table-column>
                <el-table-column prop="trainTheme" align="center" label="培训主题" >
                </el-table-column>
                <el-table-column prop="statusMark" align="center" label="教务备注" >
                </el-table-column>
                <el-table-column align="center" label="手机号" >
                    <template scope="scope">
                        <span @click="getTeaSecret($event, scope.row.teaId, 'mobile')" class="detailsBtn">点击查看信息</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="微信">
                    <template scope="scope">
                        <span class="weixinbox">{{scope.row.teaWeixin}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="QQ" >
                    <template scope="scope">
                        <span @click="getTeaSecret($event, scope.row.teaId, 'qq')" class="detailsBtn">点击查看信息</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮箱" >
                    <template scope="scope">
                        <span @click="getTeaSecret($event, scope.row.teaId, 'email')" class="detailsBtn">点击查看信息</span>
                    </template>
                </el-table-column>
                <el-table-column prop="referrerName" align="center" label="推荐人姓名" >
                </el-table-column>
                <el-table-column prop="referMobile" align="center" label="推荐人手机号" >
                </el-table-column>
                <el-table-column prop="readyAt" align="center" label="入库时间" >
                </el-table-column>
                <el-table-column prop="getre" align="center" label="入库时长" >
                    <template scope="scope">
                        {{scope.row.readyAt | readyAtFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right">
                    <template scope="scope" >
                        <el-button size="small" @click="teaRemark(scope.row.teaId)" type="text">教务备注</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>
        </div>

        <time-remark title="教务备注" remark-title="备注" :show="teaRemarkDialog" @cancel="cancelTeaRemark" @confirm="confirmTeaRemark"></time-remark>

        <el-dialog :white="true" title="修改状态" class="parttime-cstatus-dialog" v-model="interviewAuditSettingDialog" size="small" @close="cancelInterviewAuditSettingDialog">
            <el-form :model="partTimeTeacherStateForm" class="parttime-change-status" label-width="80px">
                <el-form-item label="老师状态">
                    <el-select v-model="partTimeTeacherStateForm.state" placeholder="请选择">
                        <template v-if="canChangeStatus">
                            <el-option v-for="(item, key) in canChangeStatus" :key="key" :label="item.label" :value="item.value"></el-option>
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
                <div @click="openInterviewAuditSettingDialog(userDetailId)" class="add-reserve" >
                    <span>修改状态</span>
                </div>
            </div>
            <el-tabs v-model="userDetailTabNumber" @tab-click="userDetailTab" class="order_dialog_body rder_dialog_bodys">
                <el-tab-pane label="个人信息" name="first">
                    <basic-message
                        v-if="userDetailDialog"
                        :tea-id="userDetailId"
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
        <to-full-time @getTableData="getTableData" ref="toFullTime"></to-full-time>
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import partGetEntryTeachers from '../../api/select/partGetEntryTeachers';
import filterMixins from '@/mixins/filterMixins';
import methodsMixins from '@/mixins/methodsMixins';
import partTimeAction from 'api/action/partTimeAction';
import interViewMixins from './compontent/mixin';
import {formatDate} from '@/components/date-picker/util';

import teacherCertificateMixin from '../full_times_dir/teacherCertificateMixin'

// 兼职转全职对话框组合
import toFullTime from '../dialog/to_full_time'

export default {
    mixins: [filterMixins, methodsMixins, interViewMixins, teacherCertificateMixin],
    data() {
        return {
            aaaa: '',
            search_data: {
                teaBu: '', //所属BU
                timeType: '', //工作性质
                grade: '', //年级
                subject: '', //科目
                referMobile: '', //推荐人
                teaNameOrMobile: '', //老师
                school: '', //所属学校
                trainTheme: '', //培训主题
                recommend: '', //是否可排课
                readyAtStart: '', //入库时间起始
                readyAtEnd: '', //入库时间截止
                certificateState: '',
                pageNo: 1,
                pageSize: 10,
            },
            phaseList:[],
            basesubList:[],
            userDetailDialog:false,
            teaRemarkDialog:false,
            page_size: 10,
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            storeTime: null,
            interviewAuditSettingDialog :false,
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
            userDetailName: '',
            userDetailMobile: '',
            selectTableText: '个人基本信息-个人信息',
            // 兼职转全职
            selectTableArr: [],
        };
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
        storeTime(val) {
            if (val) {
                this.search_data.readyAtStart = val[0] ? formatDate(val[0], 'yyyy-MM-dd') : '';
                this.search_data.readyAtEnd = val[1] ? formatDate(val[1], 'yyyy-MM-dd') : '';
            } else {
                this.search_data.readyAtStart = '';
                this.search_data.readyAtEnd = '';
            }
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 获取表单数据
        getTableData() {
            this.tableLoading = true;

            const [certificateType, certificateState] = this.search_data.certificateState.split('')

            partGetEntryTeachers({ ...this.search_data, certificateType, certificateState}).then(data => {
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
            this.search_data.pageNo = 1;
            this.tableLoading = true;
            this.getTableData();
        },
        handleCurrentChange(currentPage) {
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
        teaRemark(id){
            this.currentID = id;
            this.teaRemarkDialog = true;
        },
        cancelTeaRemark(){
            this.teaRemarkDialog = false;
        },
        confirmTeaRemark(data){
            partTimeAction({
                url: '/api/partTimeTeacherFlow/setStatusMark',
                type: 'post',
                data: {
                    statusMark: data.remark,
                    teaIds: [
                        this.currentID
                    ]
                }
            }).then(() => {
                this.$Message({
                    message: '设置备注成功'
                });
                this.getTableData();
            }).catch(message => {
                this.$Message({
                    message
                });
            });
            this.teaRemarkDialog = false;
        },
        changeArrangementClass(val) {
            partTimeAction({
                url: '/api/partTimeTeacherFlow/setIsArrangementClass',
                type: 'post',
                data: {
                    isArrangementClass: val,
                    teaIds: [
                        this.currentID
                    ]
                }
            }).then(data => {
                this.$Message({
                    message: '设置排课状态值成功'
                });
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },
        returnJson (obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        toFullTime () {
            if (this.selectTableArr.length===0) {
                this.$Message({
                    message: '请选择一位老师'
                });
            } else {
                // 已提交兼职转全职
                // this.$refs.toFullTime.pendingDialog = true
                // this.$refs.toFullTime.pendingDialogStatus = '当前状态'
                // 还未提交兼职转全职
                this.$refs.toFullTime.toFullTimeDialog = true
                this.$refs.toFullTime.toFullTimeForm = this.returnJson(this.selectTableArr[0])
                this.$refs.toFullTime.getSelectList()

            }
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        if(!this.permission){
            this.$router.push({ path: '/part_time' });
        }else{
            this.initPhase();
            this.initSubject();
            this.getTableData();
        }
        this.$on("search", function(val) {
            this.search_data.keyWord = val.keyWord || '';
            this.getTableData();
        });
    },
    components: {toFullTime}
}
</script>
<style lang="less">
    @import url('./compontent/partTime.css');
</style>
