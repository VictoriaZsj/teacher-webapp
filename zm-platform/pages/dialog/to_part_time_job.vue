<template>
  <div>
    <div class="content">
      <el-form label-position="left"  label-width="120px">
        <el-form-item label="转岗岗位" :required="true">
            <el-select v-model="selectedJob" placeholder="请选择转岗岗位">
                <el-option v-for="(item) in jobsData" :key="item.id" :label='item.postName' :value='item' value-key='postCode'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item :required="true" label="是否需要交接学生" label-width="100%">
        </el-form-item>
        <el-form-item label-width="0">
            <el-radio :disabled="noStudentTrue" v-model="leaveType" label="0">需要交接</el-radio>
            <el-radio :disabled="noStudentTrue" v-model="leaveType" label="1">不需要交接</el-radio>
        </el-form-item>
        <el-form-item v-if="noStudent&&leaveType === '1'" :required="true"
            label="该教师名下无任何学生,无需交接" label-width="100%" />
        <div v-if="leaveType === '0'">
            <el-form-item v-if="noStudent" :required="true"
                label="该教师名下无任何学生,无需交接" label-width="100%" />
            <template v-else>
                <el-form-item :required="true" label="请填写学习交接情况" label-width="100%"></el-form-item>
                <el-tabs type="border-card">
                    <el-tab-pane v-if="studentData.length > 0" :label="'1对1课的正式学生（' + studentData.length + '）'">
                        <el-form-item label-width="0">
                            <div class="student-panel">
                                <div class="student-name-list">
                                    <span v-for="(item,index) in studentData" :key="index" @click="selectStu(item.studentId, 0)" :class="{'active':selectStuIndex == item.studentId}">{{item.studentName}}</span>
                                </div>
                                <div class="student-content-list">
                                <div v-for="(item,index) in studentData" :key="index" v-show="selectStuIndex == item.studentId" class="student-content">
                                    <span class="set-needless" @click="setNeedless(studentData, index)">{{item.needLess===true?`已设置不交接`:`设置不交接`}}</span>
                                    <div class="stu-mes-item teachingMaterial">
                                        <el-select v-model="item.textVersion" :noregvalue="item.textVersion" placeholder="请选择">
                                            <el-option v-for="(item,index) in item.textVersionList" :key="index" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="stu-mes-item frequency">
                                        <dami-text-input placeholder="请输入上课频率" style="width:180px;" v-model="item.frequency" unit="次/周" type="Bborder"></dami-text-input>
                                    </div>
                                    <div class="stu-mes-item">
                                        <el-input type="textarea" v-model="item.studentCondition" :rows="6" placeholder="请详细描述学生的学习情况" />
                                    </div>
                                    <div v-show="!!studenLearnRecordData && studenLearnRecordData.length > 0" class="stu-mes-item course-record">
                                        <div class="course-title">
                                            以下是<span style="color:#3366cc;">{{item.studentName}}</span>最近三次的上课时间&课程内容
                                        </div>
                                        <div class="course-data">
                                            <el-table :data="studenLearnRecordData" class="el-white-table">
                                                <el-table-column prop="studyDate" align="center" label="上课时间" />
                                                <el-table-column prop="knowledge" align="center" label="课程内容" />
                                            </el-table>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane v-if="youngList.length > 0" :label="'小班课的正式学生（' + youngList.length + '）'">
                        <el-form-item label-width="0">
                            <div class="student-panel">
                                <div class="student-name-list">
                                    <span v-for="(item,index) in youngList" :key="index" @click="selectStu(item.studentId, 1)" :class="{'active':selectStuIndex == item.studentId}">{{item.studentName}}</span>
                                </div>
                                <div class="student-content-list">
                                    <div v-for="(item,index) in youngList" :key="index" v-show="selectStuIndex == item.studentId" class="student-content">
                                        <span class="set-needless" @click="setNeedless(youngList, index)">{{item.needLess===true?`已设置不交接`:`设置不交接`}}</span>
                                        <div class="stu-mes-item teachingMaterial">
                                            <el-select v-model="item.textVersion" :noregvalue="item.textVersion" placeholder="请选择">
                                                <el-option v-for="(item,index) in item.textVersionList" :key="index" :label="item" :value="item"></el-option>
                                            </el-select>
                                        </div>
                                        <div class="stu-mes-item frequency">
                                            <dami-text-input placeholder="请输入上课频率" style="width:180px;" v-model="item.frequency" unit="次/周" type="Bborder"></dami-text-input>
                                        </div>
                                        <div class="stu-mes-item">
                                            <el-input type="textarea" v-model="item.studentCondition" :rows="6" placeholder="请详细描述学生的学习情况"/>
                                        </div>
                                        <div v-show="!!studenLearnRecordData && studenLearnRecordData.length > 0" class="stu-mes-item course-record">
                                            <div class="course-title">
                                                以下是<span style="color:#3366cc;">{{item.studentName}}</span>最近三次的上课时间&课程内容
                                            </div>
                                            <div class="course-data">
                                                <el-table :data="studenLearnRecordData" class="el-white-table">
                                                    <el-table-column prop="studyDate" align="center" label="上课时间" />
                                                    <el-table-column prop="knowledge" align="center" label="课程内容" />
                                                </el-table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane v-if="testList.length > 0" :label="'测评课（' + testList.length + '）'">
                        <p class="cpk-title">该老师下还有{{testList.length}}节测评课需要交接：</p>
                        <el-table :data="testClassList" border style="width: 100%;margin-top:15px;" max-height="250">
                            <el-table-column align="center" header-align="center" prop="stuName" label="学生姓名" />
                            <el-table-column align="center" header-align="center" prop="subject" label="上课科目" />
                            <el-table-column align="center" header-align="center" prop="grade" label="上课年级" />
                            <el-table-column align="center" header-align="center" prop="textVersion" label="教材版本" />
                            <el-table-column align="center" header-align="center" prop="knowledge" label="知识点" />
                            <el-table-column align="center" header-align="center" prop="studyDate" label="测评课预约时间" />
                            <el-table-column align="center" header-align="center" label="交接状态">
                                <template>
                                    <!-- scope="scope" -->
                                    未交接
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </div>
      </el-form>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
/**
 * @description
 * newR开头是转正管理里面的接口
 * newT开头是试用期管理里面的接口
 */
import {
    newRapplyFulltimeToPartime,
    newTapplyFulltimeToPartime,
    newRgetTeaStudentByTeaId,
    newTgetTeaStudentByTeaId,
    newRgetTextVersion,
    newTgetTextVersion,
    newRgetStudentCourses,
    newTgetStudentCourses
} from '../../api/select/toPartTimeJob';

import damiTextInput from 'dami-text-input';
export default {
    data() {
        return {
            buttonState:false,
            selectStuIndex:0,
            studentData: [],
            youngList: [],
            testList: [],
            testClassList: [],
            studenLearnRecordData:[],
            leaveType: '0',
            noStudentTrue: false,
            selectedJob: '',
            jobsData: []
        }
    },
    props:{
        currentID:null,
        bu:null,
        currentName:null,
        viewState:false,//false表示页面关闭，true表示页面展开
        campName: String,
        disType: {
            required: false,
            type: String,
            default: ''
        }
    },
    watch:{
        viewState (val) {
            if (!val) {
                this.default();
            } else {
                this.getStuData();
                this.getJobsData();
            }
        }
    },
    mounted () {
        this.getStuData();
        this.getJobsData();
    },
    components:{
      'dami-text-input':damiTextInput
    },
    computed: {
        noStudent () {
            return this.studentData.length==0&&this.youngList.length==0&&this.testList.length==0
        }
    },
    methods:{
        getJobsData() {
            this.$Fetch({
                url: '/api/teacherPost/postList',
                method: 'get',
                params: {
                // postKey: '',
                // status: 1,
                    bu: this.bu,
                    timeType: 0
                },
            }).then(ret => {
                if (ret.code === '0' && ret.data) {
                    this.jobsData = ret.data
                }
            })
        },
        setNeedless (arr, index) {
            if (arr[index].needLess) {
                arr[index].needLess = false
            } else {
                arr[index].needLess = true
            }
            this.$forceUpdate()
        },
        selectStu(stuID, type) {
            this.studenLearnRecordData = [];
            this.selectStuIndex = stuID;
            this.getStudenLearnRecordData(stuID, type);
            let haveGetTextVersion = this.getHaveGetTextVersion(stuID, type);
            if(haveGetTextVersion == false){
                this.setTextVersion(stuID, type);
            }
        },
        setTextVersion(stuID, type){
            let item = this.getItemByStuId(stuID, type);
            if(!!item){
                let parm = {
                    grade: item.grade, // item.grade
                    subject: item.subject,
                    bu: this.bu
                };
                if (this.disType!=='ent') {
                    newTgetTextVersion(parm).then(data => {
                        this.setTextVersionList(data, stuID, type);
                    }).catch(message => {
                        this.$Message({
                            message: message
                        });
                    });
                } else {
                    newRgetTextVersion(parm).then(data => {
                        this.setTextVersionList(data, stuID, type);
                    }).catch(message => {
                        this.$Message({
                            message: message
                        });
                    });
                }
            }
        },
        setTextVersionList(data,stuID, type){
            let item = null;
            if (type == 0) {
                for(let i  = 0; i < this.studentData.length; i++){
                    if(this.studentData[i].studentId == stuID){
                        item = this.studentData[i];
                        break;
                    }
                }
            }
            if (type == 1) {
                for(let i  = 0; i < this.youngList.length; i++){
                    if(this.youngList[i].studentId == stuID){
                        item = this.youngList[i];
                        break;
                    }
                }
            }
            if(!!item){
                item.haveGetTextVersionList = true;
                item.textVersionList = data;
            }
        },
        getItemByStuId(stuID, type){
            let obj = null;
            if (type == 0) {
                for(let i  = 0; i < this.studentData.length; i++){
                    if(this.studentData[i].studentId == stuID){
                        obj = this.studentData[i];
                        break;
                    }
                }
            }
            if (type == 1) {
                for(let i  = 0; i < this.youngList.length; i++){
                    if(this.youngList[i].studentId == stuID){
                        obj = this.youngList[i];
                        break;
                    }
                }
            }
            return obj;
        },
        getHaveGetTextVersion(stuID, type){
            let haveGetTextVersion = true;
            if (type == 0) {
                for(let i  = 0; i < this.studentData.length; i++){
                    if(this.studentData[i].studentId == stuID){
                        haveGetTextVersion = this.studentData[i].haveGetTextVersionList;
                        break;
                    }
                }
            }
            if (type == 1) {
                for(let i  = 0; i < this.youngList.length; i++){
                    if(this.youngList[i].studentId == stuID){
                        haveGetTextVersion = this.youngList[i].haveGetTextVersionList;
                        break;
                    }
                }
            }
            return haveGetTextVersion;
        },
        getStudenLearnRecordData(stuID, type){
            let parm = {
                studentId: stuID,
                teaId: this.currentID,
                stuType: type
            };
            if (this.disType!=='ent') {
                newTgetStudentCourses(parm).then(data => {
                    this.studenLearnRecordData = data;
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
            } else {
                newRgetStudentCourses(parm).then(data => {
                    this.studenLearnRecordData = data;
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
            }
        },
        getTestClassDetails() {
            this.testList.forEach(item => {
                let parm = {
                    studentId: item.studentId,
                    teaId: this.currentID,
                    stuType: 2
                };
                if (this.disType!=='ent') {
                    newTgetStudentCourses(parm).then(data => {
                        this.testClassList = [...this.testClassList, ...data];
                    }).catch(message => {
                        this.$Message({
                            message: message
                        });
                    });
                } else {
                    newRgetStudentCourses(parm).then(data => {
                        this.testClassList = [...this.testClassList, ...data];
                    }).catch(message => {
                        this.$Message({
                            message: message
                        });
                    });
                }
            });
        },
        translateData(data){
            let _data = data;
            for(let i = 0; i < data.length; i++){
                _data[i].studentCondition = "";
                _data[i].studentName = data[i].first_name;
                _data[i].studentId = data[i].id;
                _data[i].grade = data[i].stu_grade;
                _data[i].subject = data[i].subject;
                _data[i].textVersionList = [];
                _data[i].haveGetTextVersionList = false;
                if(this.CheckIsChinese(_data[i].textVersion) == false){
                    _data[i].textVersion = "";
                }
            }
            return _data;
        },
        CheckIsChinese(val){
            var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
            if(reg.test(val)){
                return true;
            }else{
                return false;
            }
        },
        // 获取该老师下面的学生数据
        getStuData () {
            let parm = {
                teaId: this.currentID
            };
            if (this.disType!=='ent') {
                newTgetTeaStudentByTeaId(parm).then(data => {
                    this.studentData = this.translateData(data.oneToOneList || []);
                    this.testList = this.translateData(data.testList || []);
                    this.youngList = this.translateData(data.youngList || []);
                    if (this.studentData.length==0&&this.youngList.length==0&&this.testList.length==0) {
                        this.noStudentTrue = true
                        this.leaveType = '1'
                    } else {
                        this.noStudentTrue = false
                        this.leaveType = '0'
                    }
                    if(this.studentData.length > 0){
                        this.defaultStuSelect(this.studentData[0], 0);
                    }
                    if (this.testList.length > 0) {
                        this.getTestClassDetails();
                    }
                }).catch(message => {
                    console.log("getStudentsByTeaId异常:", message)
                });
            } else {
                newRgetTeaStudentByTeaId(parm).then(data => {
                    this.studentData = this.translateData(data.oneToOneList || []);
                    this.testList = this.translateData(data.testList || []);
                    this.youngList = this.translateData(data.youngList || []);
                    if (this.studentData.length==0&&this.youngList.length==0&&this.testList.length==0) {
                        this.noStudentTrue = true
                        this.leaveType = '1'
                    } else {
                        this.noStudentTrue = false
                        this.leaveType = '0'
                    }
                    if(this.studentData.length > 0){
                        this.defaultStuSelect(this.studentData[0], 0);
                    }
                    if (this.testList.length > 0) {
                        this.getTestClassDetails();
                    }
                }).catch(message => {
                    console.log("getStudentsByTeaId异常:", message)
                });
            }
        },
        defaultStuSelect(data, type){
            this.selectStu(data.studentId, type);
        },
        positiveIntValid(val){
            let err = "";
            if(isNaN(val)){
                err = "应该是数字";
            }
            if(parseInt(val) < 0){
                err = "应该大于0";
            }
            if(String(val).indexOf('.') != -1){
                err = "应该是整数";
            }
            return err;
        },
        cancel () {
            this.$emit("cancel");
        },
        confirm () {
            if (!this.selectedJob) {
                this.$Message.error('请选择转岗岗位')
                return
            }

            if (this.noStudent) {
                this.leaveType = '1'
            }

            if (this.leaveType === '0') {
                // 筛选出不用交接的学生
                let filterArr1 = this.studentData.filter(item=>{
                    return !item.needLess
                })
                let _len = filterArr1.length;
                if(_len != 0){
                    let error = "",
                        item = null;
                    for(let i = 0; i < _len; i++){
                        item = filterArr1[i];
                        if(window.isEmpty(item.frequency)){
                            error = "请完善学生上课频率";
                            break;
                        }else if(this.positiveIntValid(item.frequency) != ""){
                            error = "学生上课频率应该是非负整数";
                            break;
                        }
                        if(window.isEmpty(item.textVersion)){
                            error = "请完善学生教材版本";
                            break;
                        }
                        if(window.isEmpty(item.studentCondition)){
                            error = "请完善学生学习情况";
                            break;
                        }
                    }
                    if(!!error){
                        this.$Message({
                            message: error
                        });
                        return ;
                    }
                }
                // 筛选出不用交接的学生
                let filterArr = this.youngList.filter(item=>{
                    return !item.needLess
                })

                _len = filterArr.length;
                if(_len != 0){
                    let error = "", item = null;
                    for(let i = 0; i < _len; i++){
                        item = filterArr[i];
                        if(window.isEmpty(item.frequency)){
                            error = "请完善学生上课频率";
                            break;
                        }else if(this.positiveIntValid(item.frequency) != ""){
                            error = "学生上课频率应该是非负整数";
                            break;
                        }
                        if(window.isEmpty(item.textVersion)){
                            error = "请完善学生教材版本";
                            break;
                        }
                        if(window.isEmpty(item.studentCondition)){
                            error = "请完善学生学习情况";
                            break;
                        }
                    }
                    if(!!error){
                        this.$Message({
                            message: error
                        });
                        return;
                    }
                }
            }

            let tip = `确定已经跟该老师沟通过，决意要转成兼职吗？`;
            if(!!this.currentName){
                tip = "确定已经跟"+this.currentName+"老师沟通过，决意要转成兼职吗？";
            }

            this.$MessageBox.confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.buttonState = true;
                let conditionList = [], item = null;
                // 一对一正式学生
                for(let i = 0; i < this.studentData.length; i++){
                    item = {};
                    item.studentId = this.studentData[i].studentId;
                    item.frequency = this.studentData[i].frequency;
                    item.textVersion = this.studentData[i].textVersion;
                    item.studentCondition = this.studentData[i].studentCondition;
                    item.first_name = this.studentData[i].studentName;
                    item.stu_grade = this.studentData[i].grade;
                    item.subject = this.studentData[i].subject;
                    item.needHandover = this.studentData[i].needLess===true?0:1;
                    item.stuType = 0;
                    conditionList.push(item);
                }

                // 小班课正式学生
                for(let i = 0; i < this.youngList.length; i++){
                    item = {};
                    item.studentId = this.youngList[i].studentId;
                    item.frequency = this.youngList[i].frequency;
                    item.textVersion = this.youngList[i].textVersion;
                    item.studentCondition = this.youngList[i].studentCondition;
                    item.first_name = this.youngList[i].studentName;
                    item.stu_grade = this.youngList[i].grade;
                    item.subject = this.youngList[i].subject;
                    item.needHandover = this.youngList[i].needLess===true?0:1;
                    item.stuType = 1;
                    conditionList.push(item);
                }
                // 测评课
                for (let i = 0; i < this.testList.length; i++) {
                    item = {};
                    item.studentId = this.testList[i].studentId;
                    item.frequency = this.testList[i].frequency;
                    item.textVersion = this.testClassList[i].textVersion;
                    item.first_name = this.testList[i].studentName;
                    item.stu_grade = this.testList[i].grade;
                    item.subject = this.testClassList[i].subject;
                    item.knowledge = this.testClassList[i].knowledge;
                    item.stuType = 2;
                    conditionList.push(item);
                }
                let parm = {};
                const { postCode, postVersion, postName } = this.selectedJob
                parm.leaveType = this.leaveType;
                parm.teaId = this.currentID;
                parm.conditionList = conditionList;
                parm.prePostCode = postCode;
                parm.prePostName = postName;
                parm.prePostVersion = postVersion;
                // 不需要交接
                if (this.leaveType === '1') {
                    parm.conditionList = [];
                }

                if (this.disType!=='ent') {
                    newTapplyFulltimeToPartime(parm).then(data => {
                        this.default();
                        this.$emit("confirm");
                    }).catch(message => {
                        this.buttonState = false;
                        this.$Message({
                            message: message
                        });
                    });
                } else {
                    newRapplyFulltimeToPartime(parm).then(data => {
                        this.default();
                        this.$emit("confirm");
                    }).catch(message => {
                        this.buttonState = false;
                        this.$Message({
                            message: message
                        });
                    });
                }
            }).catch(_=>{});
        },
        default() {
            this.buttonState = false;
            this.selectStuIndex = 0;
            this.studentData = [];
            this.youngList = [];
            this.testList = [];
            this.testClassList = [];
            this.studenLearnRecordData = [];
            this.selectedJob = '';
            this.jobsData = [];
        }
    }
}
</script>
<style scoped>
    .content{
      max-height: 400px;
      overflow-y: auto;
    }
    .control{
      text-align: right;
      padding-top: 20px;
      background-color: white;
    }
    .el-row{
        padding: 10px;
    }
    .el-row div:first-child{
        line-height: 30px;
    }
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
    .trainTopicContent{
        line-height: 30px;
    }
    .student-name-list{
      width: 100%;
      height: 60px;
      overflow-x: auto;
      white-space: nowrap;
    }
    .student-name-list span{
      padding: 5px 10px;
      margin: 5px 5px;
      cursor: pointer;
    }
    .student-name-list span:hover{
      background-color: #169bd5;
      color: white;
    }
    .student-name-list span.active{
      background-color: #169bd5;
      color: white;
    }
    .student-content{
      min-height: 200px;
    }
    .student-content .stu-mes-item{
      padding: 5px 10px
    }
    .set-needless {
        display: inline;
        position: absolute;
        right: 0;
        top: 60px;
        z-index: 99999;
        color: #fff;
        background: #ff9966;
        line-height: 28px;
        padding: 0 6px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
    }
</style>
