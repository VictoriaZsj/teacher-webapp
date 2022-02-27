<template>
<div v-if="permission('recruit:exchangeSign')">
    <el-form :inline="true" :model="formData" label-width="75px" style="overflow:visible;" class="search-form">
        <el-form-item label="关键词">
            <el-input v-model="formData.key" placeholder="支持姓名/手机号/teaID查询"></el-input>
        </el-form-item>
        <el-form-item label="所属BU">
            <el-select v-model="formData.bu" @change="onChangeBU" placeholder="请选择所属BU">
                <el-option label="全部" value=""></el-option>
                <el-option label="1对1" value="1"></el-option>
                <el-option label="少儿" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="工作性质">
            <el-select v-model="formData.timeType" @change="onChangeTimeType" placeholder="请选择工作性质">
                <el-option label="全部" value=""></el-option>
                <el-option label="全职" :value="1"></el-option>
                <el-option label="校招全职" :value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="老师类型">
            <el-select v-model="formData.teaType" placeholder="请选择老师类型">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in teaTypeOption" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="年级">
            <el-select v-model="formData.teaTaughtStuGrade" placeholder="请选择年级">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in phaseList" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="科目">
            <el-select v-model="formData.teaGoodFirst" placeholder="请选择科目">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in basesubList" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
        </el-form-item>
        <!--<el-form-item label="讲师等级">
      <el-select v-model="formData.rating" placeholder="请选择讲师等级">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item,index) in trainLevelData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>-->
        <el-form-item label="所属主题">
            <el-input v-model="formData.trainTheme" placeholder="所属主题关键字"></el-input>
        </el-form-item>
        <el-form-item label="老师状态">
            <el-select v-model="formData.teacherState" placeholder="请选择老师状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="试用期" value="5"></el-option>
                <el-option label="转正期" value="40"></el-option>
                <!-- <el-option label="离职待交接" value="45"></el-option>
       <el-option label="离职已交接" value="46"></el-option>-->
            </el-select>
        </el-form-item>

        <!-- <el-form-item label="签约类型">
      <el-select v-model="formData.signState" placeholder="请选择签约状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="换签" value="1"></el-option>
        <el-option label="续签" value="2"></el-option>
      </el-select>
    </el-form-item> -->
        <!-- required :class="hireTimeRepured && hireTime[0]==null ? 'hire-time-repured' : ''" -->
        <el-form-item label="入职时间">
            <el-date-picker :editable="false" v-model="hireTime" type="daterange" align="right" placeholder="选择日期范围" @change="chooseHireDate" :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="签约类型">
            <el-select v-model="formData.signType" placeholder="请选择老师状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="换签" value="1"></el-option>
                <el-option label="续签" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="签约状态">
            <el-select v-model="formData.signState" placeholder="请选择签约状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="未发送" value="0"></el-option>
                <el-option label="已发未签" value="1"></el-option>
                <el-option label="未完全签署" value="2"></el-option>
                <el-option label="待审核" value="3"></el-option>
                <el-option label="超时未签" value="4"></el-option>
                <el-option label="审核不通过" value="5"></el-option>
                <el-option label="签署成功" value="6"></el-option>
            </el-select>
        </el-form-item>
        <el-button class="search-btn" icon="search" type="normal" size="small" @click="searchData">搜 索</el-button>
    </el-form>
    <div class="context-body">
        <Spin size="large" fix v-if="tableLoading"></Spin>
        <div class="table-head">
            <span>
                批量选择：
                <el-checkbox-group class="table-checkbox" @change="tableCheckbox" v-model="checkList" style="display: inline-block;">
                    <el-checkbox label="100">前100</el-checkbox>
                    <el-checkbox label="500">前500</el-checkbox>
                    <el-checkbox label="1000">前1000</el-checkbox>
                    <!-- <el-checkbox label="all">全部</el-checkbox> -->
                </el-checkbox-group>
            </span>
            <!-- <el-button type="text" v-if="permission('recruit:batchSign')" :disabled="PLdisabled" @click="signMultiSigndialog('换')" size="small">批量发起换签合同</el-button> -->
            <el-button type="text" v-if="permission('recruit:batchSign_continue')" :disabled="PLdisabled" @click="signMultiSigndialog('批量续签')" size="small">批量发起续签合同</el-button>
            <!--<el-button type="text" v-if="permission('infoJob:sendEmail')" @click="sendSignEmai" size="small">补发邮件</el-button>-->
        </div>

        <el-table :data="teacherSignDtoData" @selection-change="selectTable" ref="signList" style="width:100%;">
            <el-table-column align="center" type="selection" width="50"></el-table-column>
            <el-table-column prop="teacherName" align="center" minWidth="100" fixed="left" label="姓名"></el-table-column>
            <el-table-column prop="teacherId" align="center" minWidth="100" label="teaID"></el-table-column>
            <el-table-column prop="mobile" align="center" minWidth="130" label="手机号">
                <template scope="scope">
                    <span v-if="scope.row.teacherId==rowId && textMobile">{{textMobile}}</span>
                    <el-button type="text" size="small" @click="getTeacherSecretInfo(scope.row,'mobile')" class="detailsBtn" v-else>点击查看信息</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="email" align="center" minWidth="150" label="邮箱">
                <template scope="scope">
                    <span v-if="scope.row.teacherId==rowId && textEmail">{{textEmail}}</span>
                    <el-button type="text" size="small" @click="getTeacherSecretInfo(scope.row,'email')" class="detailsBtn" v-else>点击查看信息</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="buDesc" align="center" minWidth="100" label="所属BU"></el-table-column>
            <el-table-column prop="timeTypeDesc" align="center" minWidth="100" label="工作性质"></el-table-column>
            <el-table-column prop="teaTypeDesc" align="center" minWidth="100" label="老师类型"></el-table-column>
            <el-table-column prop="teaTaughtStuGrade" show-overflow-tooltip align="center" minWidth="150" label="年级偏好">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" :disabled="scope.row.teaTaughtStuGrade && scope.row.teaTaughtStuGrade.length<16" :content="scope.row.teaTaughtStuGrade" placement="top">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 150px;">
                            {{scope.row.teaTaughtStuGrade}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="teaGoodFirst" align="center" minWidth="100" label="第一擅长科目"></el-table-column>
            <!--<el-table-column prop="ratingDesc" align="center" minWidth="100" label="讲师等级"></el-table-column>
        <el-table-column prop="monthSalary" align="center" minWidth="100" label="基本薪资"></el-table-column>-->
            <el-table-column prop="teacherStateDesc" align="center" minWidth="100" label="老师状态"></el-table-column>

            <el-table-column prop="signBody" align="center" minWidth="100" label="签约主体（最新）"></el-table-column>
            <el-table-column prop="contractStartTime" align="center" minWidth="100" label="合同开始时间"></el-table-column>
            <el-table-column prop="contractEndTime" align="center" minWidth="100" label="合同结束时间"></el-table-column>
            <el-table-column prop="signTypeDesc" align="center" minWidth="100" label="签约类型"></el-table-column>

            <el-table-column prop="signStateDesc" align="center" minWidth="100" label="签约状态"></el-table-column>
            <el-table-column prop="reviewUserName" align="center" minWidth="100" label="合同审核人"></el-table-column>
            <el-table-column prop="reviewTime" align="center" minWidth="100" label="审核时间"></el-table-column>
            <el-table-column prop="remark" align="center" minWidth="200" label="备注">
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" :disabled="scope.row.remark && scope.row.remark.length<16" :content="scope.row.remark" placement="top">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 200px;">
                            {{scope.row.remark}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="" align="center" minWidth="120" fixed="right" label="操作">
                <template scope="scope">
                    <!-- <el-button size="small" v-if="(scope.row.signState==0 || scope.row.signState==2 || scope.row.signState==4 || scope.row.signState==5|| scope.row.signState==6) && permission('recruit:signMulti')" @click="signMultiSigndialog('换',scope.row)" type="text">换签合同</el-button> -->
                    <el-button size="small" v-if="(scope.row.signState==0 || scope.row.signState==2 || scope.row.signState==4 || scope.row.signState==5|| scope.row.signState==6) && permission('recruit:signMulti_continue')" @click="signMultiSigndialog('续',scope.row)" type="text">续签合同</el-button>
                    <el-button size="small" v-if="scope.row.signState==3 && permission('recruit:signContract')" @click="electronicContractFunc(scope.row)" type="text">审核合同</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.pageNo" :page-sizes="[10, 20, 30, 40, 100]" :page-size="formData.pageSize" layout="total, sizes, prev, pager, next" v-bind:total="total">
        </el-pagination>
    </div>

    <el-dialog :title="title" width="300" custom-class="signm-ulti-signdialog" v-model="signMultiSigndialogVisible" @close="cancelSignMultiSigndialogVisible">
        <el-form :model="signForm" label-width="80px" :rules="rules" ref="signForm">
            <el-form-item label="签约类型" style="margin-bottom: 15px; width:500px">
                <el-input placeholder="请输入内容" v-model="signTypeStr" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="续签时间" prop="signTime" v-if="signForm.signType==2">
                <el-date-picker style="width:50%" v-model="signForm.signTime" format="yyyy-MM-dd" type="date" placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="备注" style="width:500px">
                <el-input type="textarea" :rows="6" :maxlength="500" show-word-limit placeholder="请备注签合同原因" v-model="signForm.remark"></el-input>
            </el-form-item>
            <el-form-item style="float: right; padding:25px 0;">
                <el-button @click="cancelSignMultiSigndialogVisible">取消</el-button>
                <el-button type="primary" :disabled="!selectTeaIds.length" :loading="signMultiSignLoading" @click="signMultiSign('signForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!--单个续签合同dialog-->
    <el-dialog :white="true" title="签电子合同" v-model="continueSignDialog" size="small" @close="cancelSignSetting">
        <continueSign :viewState="continueSignDialog" @confirm="confirmSignSetting" @cancel="cancelSignSetting" :row='row'></continueSign>
    </el-dialog>

    <el-dialog :white="true" title="合同审核" top="1vh" height="90vh" v-model="electronicContractDialog" size="small" @close="cancelTeaEntryAuditSettingDialog">
        <el-tabs v-model="activeName" class="sign-tabs" @tab-click="handleClick">
            <el-tab-pane v-for="(item,i) in signData" :key="i" :name="`first${i}`">
                <span slot="label">
                    <el-tooltip class="item" effect="dark" :disabled="item.contractName && item.contractName.length<7" :content="item.contractName" placement="top">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 110px;">
                            {{item.contractName}}
                        </div>
                    </el-tooltip>
                </span>
            </el-tab-pane>
        </el-tabs>
        <div style="min-height: 55vh;">
            <iframe v-if="iframePageUrl" class="contract_details__iframe" :src="iframePageUrl" frameborder="0"></iframe>
        </div>
        <el-form :model="ruleForm" :rules="rulesPact" ref="ruleForm" label-width="80px">
            <div style="font-size: 14px;font-weight: 600;margin: 20px 0 10px 0;">审核结果</div>
            <el-form-item v-if="ruleForm.result!=2" label="审核结果" prop="result">
                <el-radio-group v-model="ruleForm.result">
                    <el-radio label="1">通过</el-radio>
                    <el-radio label="2">拒绝</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-form v-if="ruleForm.result==2" :model="ruleForm" :rules="rulesCopy" ref="ruleFormCopy" label-width="80px">
            <el-form-item label="审核结果" prop="result">
                <el-radio-group v-model="ruleForm.result">
                    <el-radio label="1">通过</el-radio>
                    <el-radio label="2">拒绝</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="拒绝原因：" label-width="90px" style="margin-top: 20px;" prop="remark">
                <el-input type="textarea" :rows="3" v-model="ruleForm.remark" placeholder="请输入拒绝原因"></el-input>
            </el-form-item>
        </el-form>
        <div style="float: right;padding: 30px 0;">
            <el-button @click="tryOutAuditContract(ruleForm.result==2 ? 'ruleFormCopy' : 'ruleForm','cancel')">取消</el-button>
            <el-button :loading="tryOutAuditContractVisible" @click="tryOutAuditContract(ruleForm.result==2 ? 'ruleFormCopy' : 'ruleForm')" type="primary">确定</el-button>
        </div>
    </el-dialog>
    <sendSignEmail ref="sendSignEmail" />
</div>
<div v-else style="font-size: 32px;text-align:center;line-height: 80vh;">没有该模块权限，请联系相关负责人为你添加</div>
</template>

<script>
import commonCascade from '../../api/select/commonCascade';
import getTeacherSecretInfo from '../../api/select/getTeacherSecretInfo';
import signTeacherSignList from '../../api/action/signTeacherSignList';
import signAuditContract from '../../api/action/signAuditContract';
import signMultiSign from '../../api/action/signMultiSign';
import signGetTobeEcontracts from '../../api/action/signGetTobeEcontracts';
import validateReturnSatisfyTeachers from '../../api/action/validateReturnSatisfyTeachers';
import getPhase from 'api/select/getPhase';
import getSubject from 'api/select/getSubject';
import getTeaLevel from '../../../src/zm-component/basic-message/API/getTeaLevel';
import sendSignEmail from './components/sendSignEmail';
import continueSign from './components/continueSign'
export default {
    data() {
        return {
            title: '',
            signTypeStr: '',
            signTeaId: '',
            continueSignDialog: false,
            tableLoading: false,
            signMultiSigndialogVisible: false,
            phaseList: [], // 年级
            basesubList: [], // 科目
            teaTypeOption: [], // 老师类型
            trainLevelData: [], // 讲师等级
            hireTime: [],

            // hireTimeRepured: false,
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
            formData: {
                key: '',
                bu: '',
                timeType: '',
                teaType: '',
                rating: '',
                trainTheme: '',
                teacherState: '',
                signState: '',
                teaTaughtStuGrade: '',
                teaGoodFirst: '',
                pageNo: 1,
                pageSize: 10,
                signType: ''
            },
            selectTeaIds: [],
            teacherSignDtoData: [],
            total: 0,
            textMobile: '',
            textEmail: '',
            rowId: '',
            // 发送电子合同
            signMultiSignLoading: false,
            signForm: {
                signTime: '',
                teacherIds: '',
                signType: 1,
                remark: '',
            },
            rules: {
                signTime: [{
                    type: 'date',
                    required: true,
                    message: '请选择续签时间',
                    trigger: 'blur'
                }]
            },
            // 审核电子合同
            activeName: 'first0',
            electronicContractDialog: false,
            tryOutAuditContractVisible: false,
            teaObject: {},
            electronicContractDetails: {},
            signData: [],
            ruleForm: {
                result: '',
                remark: '',
            },
            rulesPact: {
                result: [{
                    required: true,
                    message: '请选择审核结果',
                    trigger: 'change'
                }]
            },
            rulesCopy: {
                result: [{
                    required: true,
                    message: '请选择审核结果',
                    trigger: 'change'
                }],
                remark: [{
                    required: true,
                    message: '请输入拒绝原因',
                    trigger: 'change'
                }],
            },
            // 批量选择
            checkList: [],
            PLdisabled: false,
            iframePageUrl: '',
            row: {},
            signList: []
        }
    },
    components: {
        sendSignEmail,
        continueSign
    },
    mounted() {
        this.signTeacherSignList();
        this.initPhase();
        this.initSubject();
        this.getTeacherTypes();
    },
    methods: {
        //执行签定合同
        continueSignSetting(row) {
            this.row = row
            this.continueSignDialog = true;
        },
        confirmSignSetting() {
            this.continueSignDialog = false;
            this.searchData();
        },
        cancelSignSetting() {
            this.continueSignDialog = false;
            this.$refs.signList.clearSelection();
            this.checkList = [];
        },
        onChangeBU() {
            this.initTrainLevelData();
            this.initSubject();
        },

        onChangeTimeType() {
            this.initTrainLevelData();
        },

        // 年级
        initPhase() {
            this.formData.teaTaughtStuGrade = "";
            this.phaseList = [];
            let parm = {};
            if (this.formData.bu != "") {
                parm.bu = this.formData.bu;
            }
            getPhase(parm).then(data => {
                this.phaseList = data.children;
            })
        },
        // 科目
        initSubject() {
            this.formData.teaGoodFirst = '';
            this.basesubList = [];
            let parm = {};
            if (this.formData.bu != "") {
                parm.bu = this.formData.bu;
            }
            getSubject(parm).then(data => {
                this.basesubList = data.children;
            })
        },
        // 讲师等级
        initTrainLevelData() {
            this.formData.rating = '';
            this.trainLevelData = [];
            if (!this.formData.bu || !this.formData.timeType) return
            let parm = {
                bu: this.formData.bu,
                timeType: this.formData.timeType,
            };
            getTeaLevel(parm).then(data => {
                let _data = [];
                for (let i = 0; i < data.children.length; i++) {
                    _data.push({
                        value: data.children[i].value + "",
                        label: data.children[i].label
                    })
                }
                this.trainLevelData = _data;
            })
        },

        // 老师类型
        getTeacherTypes() {
            this.teaTypeOption = [];
            commonCascade([{
                "dictCode": "TEACHER_TYPE"
            }]).then(data => {
                this.teaTypeOption = data.children;
            });
        },

        // 选择入职时间
        chooseHireDate() {
            if (this.hireTime[0] == null) {
                this.formData.hireTimeStart = '';
                this.formData.hireTimeEnd = '';
            } else {
                let sDate = new Date(this.hireTime[0]).getTime();
                let eDate = new Date(this.hireTime[1]).getTime();
                this.formData.hireTimeStart = this.$DateTool.format(sDate, 'yyyy-MM-dd') + " 00:00:00";
                this.formData.hireTimeEnd = this.$DateTool.format(eDate, 'yyyy-MM-dd') + " 23:59:59";
            }
        },

        // 查询手机号邮箱
        getTeacherSecretInfo(row, infoType) {
            let parm = {
                teaId: row.teacherId,
                infoType,
            };
            this.rowId = row.teacherId;
            this.textMobile = '';
            this.textEmail = '';
            getTeacherSecretInfo(parm).then(data => {
                if (infoType == 'mobile') {
                    this.textMobile = data;
                } else if (infoType == 'email') {
                    this.textEmail = data;
                }
            }).catch(message => {
                this.$Message({
                    message
                });
            });
        },

        searchData() {
            this.formData.pageNo = 1;
            // this.hireTimeRepured = true;
            // if(!this.formData.hireTimeStart || !this.formData.hireTimeEnd) return this.$Message.warning('入职时间不能为空');
            this.signTeacherSignList();
        },

        // 获取列表
        signTeacherSignList() {
            this.tableLoading = true;
            let params = {
                ...this.formData
            };
            signTeacherSignList(params).then(res => {
                this.tableLoading = false;
                if (res.code == 0 && res.data) {
                    this.teacherSignDtoData = res.data.list;
                    this.total = res.data.total;
                }
            }).catch(err => {
                this.tableLoading = false;
                if (err.message) return this.$Message.error(err || '获取列表失败 请稍后再试');
            })
        },

        async signMultiSigndialog(e, val) {
            this.PLdisabled = true;
            let teacherIds;
            if (val) { //走单个
                this.title = '单个发起换签合同'
                this.$refs.signList.clearSelection();
                this.checkList = [];
                this.$refs.signList.toggleRowSelection(val, true);
                this.teaObject = val;
                teacherIds = [val.teacherId];
            } else { //走批量
                if (e == '换') {
                    this.title = '批量发起换签合同'
                }
                if (this.checkList.length == 0) {
                    if (this.selectTeaIds.length == 0) {
                        this.PLdisabled = false;
                        return this.$Message.warning('请至少选中1位老师');
                    }
                    teacherIds = this.selectTeaIds;
                } else {
                    let params = {
                        ...this.formData
                    };
                    params.pageSize = Number(this.checkList[0]);
                    params.pageNum = 1;
                    let res = await signTeacherSignList(params).catch(err => {
                        this.PLdisabled = false;
                        return this.$Message.error(err.message || '操作失败 请稍后再试');
                    });
                    if (res && res.data && res.data.list.length) {

                        teacherIds = res.data.list.map(r => {
                            return r.teacherId;
                        })
                    }
                }
            }
            if (!teacherIds) {
                this.PLdisabled = false;
                return this.$Message.warning('请至少选中1位老师');
            }
            let params = {
                teacherIds,
            }
        
            validateReturnSatisfyTeachers(params).then((res) => {
                this.PLdisabled = false;
                if (res.code == 0) {
                    this.selectTeaIds = res.data;
                } else {
                    this.selectTeaIds = [];
                };

                if (e == '换') {
                    this.signForm.signType = 1;
                    this.signTypeStr = '换签'
                } else if (e == '批量续签') {
                    this.title = '批量发起续签合同'
                    this.signForm.signType = 2
                    this.signTypeStr = '续签'
                };

                if (res.message) {
                    this.$MessageBox.confirm(`${res.message} 是否继续?`, '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        showClose: false,
                    }).then(() => {
                        if (e == '续') {
                            //单个续签弹窗
                            this.continueSignSetting(val);
                        } else {
                            //批量换/续 and 单个换 弹窗
                            setTimeout(() => this.signMultiSigndialogVisible = true, 200)
                        }
                    }).catch(() => {
                        this.$refs.signList.clearSelection();
                        this.checkList = [];
                    });
                } else {
                    if (e == '续') {
                        //单个续签弹窗
                        this.continueSignSetting(val);
                    } else {
                        //批量换/续 and 单个换 弹窗
                        this.signMultiSigndialogVisible = true;
                    }
                }
            }).catch(err => {
                this.PLdisabled = false;
                if (err) return this.$Message.error(err || '操作失败 请稍后再试');
            })
        },
        cancelSignMultiSigndialogVisible() {
            this.signMultiSigndialogVisible = false;
            this.signForm.remark = '';
            if (this.teaObject.teacherId) {
                this.teaObject = {};
                this.selectTeaIds = [];
            }
            this.$refs.signList.clearSelection();
            this.checkList = [];
        },

        // 发送合同
        signMultiSign(formName) {
            let callback = () => {
                this.signMultiSignLoading = true;
                let params = {
                    ...this.signForm
                };
                params.signTime = Date.parse(this.signForm.signTime)
                // params.signType = this.formsignType;
                params.teacherIds = this.selectTeaIds;
                signMultiSign(params).then(res => {
                    this.signMultiSignLoading = false;
                    if (res.code == 0) {
                        this.$Message.success(res.message || '发送成功');
                        this.signTeacherSignList();
                        this.signMultiSigndialogVisible = false;
                        this.signForm.remark = '';
                    } else {
                        this.$Message.error(res.message || '发送失败')
                    }
                }).catch(err => {
                    this.signMultiSignLoading = false;
                    this.$Message.error(err || '操作失败 请稍后再试')
                })
            };
            if (this.title == '批量发起续签合同') {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        callback()
                    }
                })
            } else {
                callback()
            }

        },

        // 审核电子合同
        electronicContractFunc(row) {
            this.teaObject = row;
            this.ruleForm.result = '';
            this.ruleForm.remark = '';
            this.activeName = 'first0';
            this.signData = [];
            this.iframePageUrl = '';
            this.tryOutAuditContractVisible = false;
            signGetTobeEcontracts({
                teaId: row.teacherId
            }).then(res => {
                if (res.code == 0 && res.data) {
                    this.signData = res.data;
                    this.iframePageUrl = this.signData[0].pageUrl;
                    this.electronicContractDialog = true;
                } else {
                    this.$Message.error(res.message || '操作失败 请稍后再试')
                }
            }).catch(err => {
                this.$Message.error(err || '获取合同失败 请稍后再试');
            })
        },

        cancelTeaEntryAuditSettingDialog() {
            this.teaObject = {};
            this.ruleForm.result = '';
            this.ruleForm.remark = '';
            this.electronicContractDialog = false;
        },

        // 审核合同
        tryOutAuditContract(formName, val) {
            if (val) {
                this.electronicContractDialog = false;
                this.ruleForm.result = '';
                this.ruleForm.remark = '';
                return
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.tryOutAuditContractVisible = true;
                    let data = {
                        result: Number(this.ruleForm.result),
                        remark: this.ruleForm.remark,
                        teaId: this.teaObject.teacherId,
                    }
                    if (this.ruleForm.result == 1) delete data.remark;
                    signAuditContract(data).then(res => {
                        if (res.code == 0) {
                            // this.signForm.signType = '1';
                            this.signForm.remark = '';
                            this.$Message.success(res.message || '操作成功');
                            this.signTeacherSignList();
                            this.cancelTeaEntryAuditSettingDialog();
                        } else {
                            this.$Message.error(res.message || '操作失败 请稍后再试')
                        }
                        this.tryOutAuditContractVisible = false;
                    }).catch(err => {
                        this.tryOutAuditContractVisible = false;
                        this.$Message.error(err || '操作失败 请稍后再试')
                    })
                } else {
                    if (!this.teaObject.teacherId) return this.$Message({
                        type: 'warning',
                        message: '暂不能审核 请稍后再试'
                    });
                    this.tryOutAuditContractVisible = false;
                }
            });
        },

        selectTable(val) {
            this.checkList = [];
            this.selectTeaIds = val.map(r => {
                return r.teacherId;
            })
        },

        handleSizeChange(val) {
            this.formData.pageNo = 1;
            this.formData.pageSize = val;
            this.signTeacherSignList();
        },

        handleCurrentChange(val) {
            this.formData.pageNo = val;
            this.signTeacherSignList();
        },

        permission(val) {
            return this.$store.getters.permissionList.includes(val);
        },

        handleClick() {
            this.iframePageUrl = '';
            setTimeout(() => {
                this.signData.forEach((r, i) => {
                    if (`first${i}` === this.activeName) {
                        this.iframePageUrl = r.pageUrl;
                    }
                })
            })
        },

        tableCheckbox(val) {
            if (val.length === 0) return this.$refs.signList.clearSelection();
            this.teacherSignDtoData.forEach(row => {
                if (!this.checkList.includes(row.teacherId)) this.$refs.signList.toggleRowSelection(row, true);
            });
            this.checkList = val.splice(-1);
        },
        sendSignEmai() {
            this.$refs.sendSignEmail.init();
        },
    },
}
</script>

<style lang="less">
.signm-ulti-signdialog {
    .el-dialog__body {
        background: #fff !important;
    }

    .el-form-item__error {
        padding-top: 0;
    }
}

.sign-tabs {
    .el-tabs__item {
        padding: 0 10px 0 0;
        font-size: 16px;
        margin-bottom: 10px;
    }
}

.contract_details__iframe {
    width: 100%;
    min-height: 55vh;
}

// .hire-time-repured {
//   input {
//     border: 1px solid #f56c6c;
//   }
// }
</style>
