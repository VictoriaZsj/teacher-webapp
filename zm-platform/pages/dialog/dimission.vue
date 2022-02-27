<template>
  <div class="dismission-div">
    <div class="content">
        <Spin size="large" fix v-if="dataLoading"></Spin>
      <el-form label-position="left"  label-width="120px">
        <el-form-item :required="true" label="离职类型">
            <el-radio v-model="leaveType" label="0">主动离职</el-radio>
            <el-radio v-model="leaveType " label="1">被动离职</el-radio>
        </el-form-item>
        <el-form-item :required="true" label="离职原因">
            <el-select v-model="leaveReasonType" placeholder="请选择离职原因">
                <el-option v-for="(item,index) in teaLeaveReasonOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>
        <!-- TODO -->
        <el-form-item v-if="leaveType == 1" :required="true" label="具体离职原因" label-width="100%">
        </el-form-item>
        <el-form-item v-if="leaveType == 1" :required="true" label-width="0">
            <el-input
                type="textarea"
                class="wordBreak"
                :rows="6"
                placeholder=""
                :maxlength="120"
                v-model="dismissalReason">
            </el-input>
        </el-form-item>
        <el-form-item v-if="leaveType == 0" :required="true" label="具体离职原因" label-width="100%">
        </el-form-item>
        <el-form-item v-if="leaveType == 0" label-width="0">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请填写离职原因"
            v-model="reason">
          </el-input>
        </el-form-item>

        <el-form-item v-if="studentData.length == 0 && testList.length == 0 && testNotClassList.length==0 && childClassList.length==0" label="该教师名下无任何学生,无需交接" label-width="100%">
        </el-form-item>
        <template v-else>
            <el-form-item :required="leaveType == 0 ? true : false" label="请填写学习交接情况" label-width="100%"></el-form-item>
            <el-tabs type="border-card">
                <el-tab-pane key="studentData" v-if="studentData.length > 0" :label="'1对1课的正式学生（' + studentData.length + '）'">
                    <el-form-item label-width="0">
                        <div class="student-panel">
                            <div class="student-name-list">
                                <span v-for="(item,index) in studentData" :key="index" @click="selectStu(item.studentId, 0)" :class="{'active':selectStuIndex == item.studentId}">{{item.studentName}}</span>
                            </div>
                            <div class="student-content-list">
                            <div v-for="(item,index) in studentData" :key="index" v-show="selectStuIndex == item.studentId" class="student-content">
                                <div class="stu-mes-item teachingMaterial" v-if="bu!=2">
                                    <el-select v-model="item.textVersion" :noregvalue="item.textVersion" placeholder="请选择">
                                        <el-option v-for="(item,index) in item.textVersionList" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                </div>
                                <div class="stu-mes-item frequency">
                                    <dami-text-input placeholder="请输入上课频率" style="width:180px;" v-model="item.frequency" unit="次/周" type="Bborder"></dami-text-input>
                                </div>
                                <div class="stu-mes-item">
                                    <el-input
                                        type="textarea"
                                        v-model="item.studentCondition"
                                        :rows="6"
                                        placeholder="请详细描述学生的学习情况">
                                    </el-input>
                                </div>
                                <div v-show="!!studenLearnRecordData && studenLearnRecordData.length > 0" class="stu-mes-item course-record">
                                    <div class="course-title">
                                        以下是<span style="color:#3366cc;">{{item.studentName}}</span>最近三次的上课时间&课程内容
                                    </div>
                                    <div class="course-data">
                                        <el-table :data="studenLearnRecordData" class="el-white-table">
                                            <el-table-column prop="studyDate" align="center" label="上课时间">
                                            </el-table-column>
                                            <el-table-column prop="knowledge" align="center" label="课程内容">
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane key="testList" v-if="testList.length > 0" :label="'测评课（' + testList.length + '）'">
                    <p class="cpk-title">该老师下还有{{testList.length}}节测评课需要交接：</p>
                    <el-table
                        :data="testClassList"
                        border
                        style="width: 100%;margin-top:15px;"
                        max-height="250">
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="stuName"
                            label="学生姓名">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="subject"
                            label="上课科目">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="grade"
                            label="上课年级">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="textVersion"
                            label="教材版本">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="knowledge"
                            label="知识点">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="studyDate"
                            label="测评课预约时间">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            label="交接状态">
                            <template scope="scope">
                                未交接
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane key="testNotClassList" v-if="bu==1&&testNotClassList.length>0" :label="'测评课已转化未上正式课学生（' + testNotClassList.length + '）'">
                    <el-table
                        :data="testNotClassList"
                        border
                        style="width: 100%;margin-top:15px;"
                        max-height="250">
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="first_name"
                            label="学生姓名">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="subject"
                            label="上课科目">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="stu_grade"
                            label="上课年级">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="textVersion"
                            label="教材版本">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="knowledge"
                            label="知识点">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="startTime"
                            label="测评课预约时间">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            label="交接状态">
                            <template scope="scope">
                                不需要交接
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane key="childClassList" v-if="bu==2&&childClassList.length>0" :label="'小班课班级数量（' + childClassLength + '）'">
                    <smallClassNumber :list="childClassList" ref="childClassListComponent"></smallClassNumber>
                </el-tab-pane>
            </el-tabs>
        </template>
      </el-form>
    </div>
    <div class="control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="buttonState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
</template>
<script>
import getStudentsByTeaId from '../../api/select/getStudentsByTeaId';
import getStudentCourses from '../../api/select/getStudentCourses';
import getTextVersion from '../../api/select/getTextVersion';
import commonCascade from './../../api/select/commonCascade.js'

import applicationForLeave from '../../api/action/applicationForLeave';
import damiTextInput from 'dami-text-input';
import smallClassNumber from './components/smallClassNumber.vue'
export default {
    data() {
        return {
            buttonState:false,
            selectStuIndex:0,
            reason:'',
            dismissalReason:'根据《掌门全职讲师管理手册【转正营】》第 N 章第 M 条 XXXX，严重违反公司制度以及XXXXXXXXXXXXXXX（真实理由）解除劳动合同。',
            studentData: [],
            testList: [],
            testClassList: [],
            testNotClassList:[],
            childClassList:[],
            childClassLength:0,
            studenLearnRecordData:[],
            leaveType: '0',
            leaveReasonType:'',
            chapter: '', // 章
            content: '', // 内容
            section: '', // 条例
            classHours: '', // 课时
            teaLeaveReasonOptions:[],//离职原因 字典 下拉项
            dataLoading:false
        }
    },
    props:{
        currentID:null,
        bu:null,
        currentName:null,
        viewState:false,//false表示页面关闭，true表示页面展开
        campName: String,
        timeType: null
    },
    watch:{
        viewState (val) {
            if (val) {
                this.getStuData();
            } else {
                this.default();
            }
        }
    },
    mounted:function(){
        this.getStuData();
    },
    components:{
      'dami-text-input':damiTextInput,
      smallClassNumber
    },
    methods:{
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
                getTextVersion(parm).then(data => {
                    this.setTextVersionList(data, stuID, type);
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
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
            return haveGetTextVersion;
        },
        getStudenLearnRecordData(stuID, type){
            let parm = {
                studentId: stuID,
                teaId: this.currentID,
                stuType: type
            };
            getStudentCourses(parm).then(data => {
                this.studenLearnRecordData = data;
            }).catch(message => {
                this.$Message({
                    message: message
                });
            });
        },
        getTestClassDetails() {
            this.testList.forEach(item => {
                let parm = {
                    studentId: item.studentId,
                    teaId: this.currentID,
                    stuType: 2
                };
                getStudentCourses(parm).then(data => {
                    if(data&&data.length) this.testClassList.push(data[0]);
                }).catch(message => {
                    this.$Message({
                        message: message
                    });
                });
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
        translateDataChildClass(data){
            const _ = {};
            let n = 0;
            const _data =  data.map(item=>{
                if(!_[item.classId]){
                    _[item.classId] = true
                    n++;
                }
                return {
                    ...item,
                    studentCondition:'',
                    studentId:item.id,
                    stuType:1
                }
            });
            this.childClassLength = n;
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
        getStuData(){
            let parm = {
                teaId: this.currentID
            };
            this.dataLoading = true;
            getStudentsByTeaId(parm).then(data => {
                this.dataLoading = false;
                this.studentData = this.translateData(data.oneToOneList || []);
                this.testList = this.translateData(data.testList || []);
                this.testNotClassList = data.testNotClassList || [];
                this.childClassList = this.translateDataChildClass(data.childClassList || []);
                if(this.studentData.length > 0){
                    this.defaultStuSelect(this.studentData[0], 0);
                }
                if (this.testList.length > 0) {
                    this.getTestClassDetails();
                }
            }).catch(message => {
                this.dataLoading = false;
                console.log("getStudentsByTeaId异常:", message)
            });
            //获取 离职原因字典

            commonCascade([{"dictCode":"TEA_LEAVE_REASON"}]).then(data => {
                this.teaLeaveReasonOptions = data.children
            })
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
            if(this.leaveReasonType === ''){
                this.$Message({
                    message: "请选择离职原因"
                });
                return ;
            }
            if (this.leaveType === '1') {
                if(window.isEmpty(this.dismissalReason)){
                    this.$Message({
                        message: "请填写具体离职原因"
                    });
                    return ;
                }
            }

            if (this.leaveType === '0') {
                let _len = this.studentData.length;
                if(window.isEmpty(this.reason)){
                    this.$Message({
                        message: "请填写具体离职原因"
                    });
                    return ;
                }
                if(_len != 0){
                    let error = "",
                        item = null;
                    for(let i = 0; i < _len; i++){
                        item = this.studentData[i];
                        if(window.isEmpty(item.frequency)){
                            error = "请完善学生上课频率";
                            break;
                        }else if(this.positiveIntValid(item.frequency) != ""){
                            error = "学生上课频率应该是非负整数";
                            break;
                        }
                        if(this.bu==1&&window.isEmpty(item.textVersion)){
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
            }
            //获取 小班课班级数量 TAB 的数据
            let childClassListData = [];
            if(this.bu ==2 && this.childClassList.length>0) {
                childClassListData = this.$refs.childClassListComponent.submitFun();
                if(!childClassListData) return;//有值未填写完整，即返回 false , 直接return
            }

            let tip = `确定已经跟该老师沟通过，决意要离职吗？提交申请后，会通知到学科运维老师、班主任和招师HR`;
            if(!!this.currentName){
                tip = "确定已经跟"+this.currentName+"老师沟通过，决意要离职吗？提交申请后，会通知到学科运维老师、班主任和招师HR";
            }


            this.$MessageBox.confirm(tip, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.buttonState = true;
                let conditionList = [],
                    item = null;
                for(let i = 0; i < this.studentData.length; i++){
                    item = {};
                    item.studentId = this.studentData[i].studentId;
                    item.frequency = this.studentData[i].frequency;
                    item.textVersion = this.studentData[i].textVersion;
                    item.studentCondition = this.studentData[i].studentCondition;
                    item.first_name = this.studentData[i].studentName;
                    item.stu_grade = this.studentData[i].grade;
                    item.subject = this.studentData[i].subject;
                    item.stuType = 0;
                    conditionList.push(item);
                }
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
                parm.leaveType = this.leaveType;
                parm.teaId = this.currentID;
                parm.leaveReasonType = this.leaveReasonType;
                if (this.leaveType === '0') parm.leaveReason = this.reason;
                parm.conditionList = [...conditionList,...childClassListData];
                if (this.leaveType === '1') {
                    parm.chapter = this.chapter;
                    parm.section = this.section;
                    parm.content = this.content;
                    parm.classHours = this.classHours;
                    parm.leaveReason = this.dismissalReason;
                }
                applicationForLeave(parm).then(data => {
                    this.$Message(data.message||'操作成功');
                    this.default();
                    this.$emit("confirm");
                }).catch(message => {
                    this.buttonState = false;
                    this.$Message({
                        message: message
                    });
                });
            }).catch(message => {
               console.log('取消操作');
            });
        },
        default() {
            this.buttonState = false;
            this.selectStuIndex = 0;
            this.reason = '';
            this.dismissalReason = '根据《掌门全职讲师管理手册【转正营】》第 N 章第 M 条 XXXX，严重违反公司制度以及XXXXXXXXXXXXXXX（真实理由）解除劳动合同。';
            this.leaveReasonType = '';
            this.studentData = [];
            this.childClassList = [];
            this.testList = [];
            this.testClassList = [];
            this.studenLearnRecordData = [];
        }
    }
}
</script>
<style scoped>
    .wordBreak{
      word-break: break-all;
    }
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
</style>
<style>
.dismission-div .el-input {
    width: inherit;
}
</style>

