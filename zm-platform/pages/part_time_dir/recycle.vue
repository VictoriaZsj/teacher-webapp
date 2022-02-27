<template>
    <div class="full-time-container" v-if="permission">
        <el-form :inline="true" :model="search_data" style="overflow:visible;" class="search-form">
            <el-form-item label="老师">
                <el-input v-model="search_data.teaNameOrMobile " placeholder="输入姓名或手机号"></el-input>
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
                <el-input v-model="search_data.referMobile" placeholder="输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="是否黑名单">
              <el-select v-model="search_data.black" placeholder="请选择">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="原因">
                <el-select v-model="search_data.invalidReason" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未面试" value="未面试"></el-option>
                    <el-option label="未培训" value="未培训"></el-option>
                    <el-option label="面试不通过" value="面试不通过"></el-option>
                    <el-option label="培训不通过" value="培训不通过"></el-option>
                    <el-option label="未签协议" value="未签协议"></el-option>
                    <el-option label="主动退出" value="主动退出"></el-option>
                    <el-option label="已淘汰" value="已淘汰"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属学校">
                <el-input v-model="search_data.school" placeholder="输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="入库时间">
                <el-date-picker
                    v-model="storeTime"
                    type="daterange"
                    range-separator="至"
                    placeholder="请选择入库时间段">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入回收站时间">
                <el-date-picker
                    v-model="recycleTime"
                    type="daterange"
                    range-separator="至"
                    placeholder="请选择入回收站时间段">
                </el-date-picker>
            </el-form-item>

            <el-button class="search-btn" icon="search" type="normal" size="small" @click="search">查询</el-button>

        </el-form>

        <div class="context-body">
            <Spin size="large" fix v-if="tableLoading"></Spin>

            <div class="table-head">
                <span class="table-title">共{{table_data_total}}个老师</span>
                <el-button type="text" size="small" @click="openInterviewAuditSettingDialog()">修改状态</el-button>
                <el-button type="text" size="small" @click="releaseTeacher()">释放账号</el-button>
            </div>

            <el-table :data="table_data" @selection-change="selectTable" style="width:100%">
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column align="center" label="姓名"  fixed>
                    <template scope="scope">
                        <el-button size="small" type="text" @click="userDetail(scope.row)">{{scope.row.teaName}}</el-button>
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
                <el-table-column prop="grade" align="center" label="年级" >
                </el-table-column>
                <el-table-column prop="subject" align="center" label="科目" >
                </el-table-column>
                <el-table-column prop="teaSuoshuschool" align="center" label="所属学校" >
                </el-table-column>
                <el-table-column align="center" label="是否黑名单">
                    <template scope="scope">
                        {{scope.row.black | blackFilter}}
                    </template>
                </el-table-column>
                <el-table-column prop="invalidReason" align="center" label="原因" >
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
                <el-table-column prop="referMobile" align="center" label="推荐人手机号">
                </el-table-column>
                <el-table-column prop="readyAt" align="center" label="入库时间">
                </el-table-column>
                <el-table-column prop="recycleTime" align="center" label="入回收站时间">
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="250px" >
                    <template scope="scope" >
                        <el-button size="small" v-if="!scope.row.black" @click="releaseTeacher(scope.row.teaId)" type="text">释放账号</el-button>
                        <el-button size="small" v-if="!scope.row.black" @click="addToBlackList(scope.row.teaId)" type="text">加入黑名单</el-button>
                        <el-button size="small" v-if="scope.row.black" @click="removeFromBlackList(scope.row.teaId)" type="text">移出黑名单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search_data.pageNo" :page-sizes="[10, 20, 30, 40]" :page-size="search_data.pageSize" layout="sizes, prev, pager, next" v-bind:total="table_data_total">
            </el-pagination>
        </div>

        <time-remark title="加入黑名单" remark-title="备注" :show="blackDialog" @cancel="cancelBlack" @confirm="confirmBlack"></time-remark>
        <time-remark title="释放账号" remark-title="备注" :show="releaseDialog" @cancel="cancelRelease" @confirm="confirmRelease"></time-remark>

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
    </div>
    <div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import partGetRecycleTeachers from '../../api/select/partGetRecycleTeachers';
import filterMixins from '@/mixins/filterMixins';
import methodsMixins from '@/mixins/methodsMixins';
import partTimeAction from 'api/action/partTimeAction';
import interViewMixins from './compontent/mixin';
import {formatDate} from '@/components/date-picker/util';

export default {
    mixins: [filterMixins, methodsMixins, interViewMixins],
    data() {
        return {
            search_data: {
                teaBu: '', //所属BU
                timeType: '', //工作性质
                grade: '', //年级
                subject: '', //科目
                referMobile: '', //推荐人
                teaNameOrMobile: '', //老师
                black: '', //是否黑名单
                invalidReason: '', //原因
                school: '', //所属学校
                readyAtEnd: '', // 入库时间截止
                readyAtStart: '', // 入库时间起始
                recycleTimeEnd: '', // 入回收站截止点
                recycleTimeStart: '', // 入回收站起始点
                pageNo: 1,
                pageSize: 10,
            },
            storeTime: '', //入库时间
            recycleTime: '', //入回收站时间
            phaseList:[],
            basesubList:[],
            userDetailDialog:false,
            blackDialog:false,
            releaseDialog:false,
            page_size: 10,
            table_data: [],
            tableLoading: true,
            table_data_total: 0,
            // 资料卡弹层
            changeTeachStatusType: false,
            userDetailTabNumber: 'first',
            userDetailId: '',
            userDetailName: '',
            userDetailMobile: '',
            selectTableText: '个人基本信息-个人信息',
            currentIDs: [],
            currentID: null,
            // 修改状态
            canChangeStatus: null,
            interviewAuditSettingDialog :false,
            partTimeTeacherStateForm: {
                remark: '',
                state: null,
                reason: ''
            },
            submitIds: null,
            isAddToBlackList: false
        }
    },
    methods: {
        checkPermission(permissionName) {
            return (this.$store.getters.permissionList || []).indexOf(permissionName) > -1;
        },
        // 获取表单数据
        getTableData() {
            this.tableLoading = true;
            partGetRecycleTeachers(this.search_data).then(data => {
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
            this.getTableData();
        },
        releaseTeacher(id){
            // 兼容批量操作
            this.submitIds = id ? [id] : this.currentIDs;
            if (!this.submitIds || this.submitIds.length == 0) {
                this.$Message({
                    message: '请先选择一个老师'
                });
                return false;
            }
            this.releaseDialog = true;
        },
        cancelRelease(){
            this.releaseDialog = false;
        },
        confirmRelease(data){
            partTimeAction({
                url: '/api/partTimeTeacherFlow/release',
                type: 'post',
                data: {
                    remark: data.remark,
                    teaIds: this.submitIds
                }
            }).then(() => {
                this.$Message({
                    message: '操作成功'
                });
                this.getTableData();
            }).catch(() => {
                this.$Message({
                    message: '操作失败'
                });
            });
            this.releaseDialog = false;
        },
        addToBlackList(id){
            this.submitIds = id;
            this.isAddToBlackList = true;
            this.blackDialog = true;
        },
        removeFromBlackList(id){
            this.submitIds = id;
            this.isAddToBlackList = false;
            this.blackDialog = true;
        },
        cancelBlack(){
            this.blackDialog = false;
        },
        confirmBlack(data){
            let params = {
                type: 'post',
                data: {
                    remark: data.remark,
                    teaId: this.submitIds
                }
            };
            if (this.isAddToBlackList) {
                params.url = '/api/partTimeTeacherFlow/addBlackList';
            } else {
                params.url = '/api/partTimeTeacherFlow/removeBlackList';
            }
            partTimeAction(params).then(() => {
                this.$Message({
                    message: '操作成功'
                });
                this.getTableData();
            }).catch(() => {
                this.$Message({
                    message: '操作失败'
                });
            });
            this.blackDialog = false;
        }
    },
    computed: {
        permission: function () {
            return this.$store.getters.permission;
        }
    },
    mounted() {
        if(!this.permission){
            this.$router.push({ path: '/part_time' })
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
        },
        recycleTime(val) {
            if (val) {
                this.search_data.recycleTimeStart = val[0] ? formatDate(val[0], 'yyyy-MM-dd') : '';
                this.search_data.recycleTimeEnd = val[1] ? formatDate(val[1], 'yyyy-MM-dd') : '';
            } else {
                this.search_data.recycleTimeStart = '';
                this.search_data.recycleTimeEnd = '';
            }
        }
    }
}
</script>
<style>
    @import url('./compontent/partTime.css');
</style>
