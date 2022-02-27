<template>
<div id="eduBack" class="basic-tab-item">
  <div v-if="!statueText">
    <div class="basic-tab-item-content">
      <el-form :inline="true" class="basic-message-form" label-width="100px" label-position="left">
        <el-form-item class="require" label="所属BU">
          <el-radio v-model="eduBackData.teaBu" label="1">1对1</el-radio>
          <el-radio v-model="eduBackData.teaBu" label="2">少儿</el-radio>
          <el-radio v-model="eduBackData.teaBu" label="3">陪练</el-radio>
        </el-form-item>
        <br/>
        <div v-show="eduBackData.teaBu != 3">
          <el-form-item :class="{'require': requirePermission}" label="高中学校">
            <el-input v-model="eduBackData.teaSchoolGao" placeholder="请输入高中学校"></el-input>
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="高考文理科">
            <el-select v-model="eduBackData.teaWenli" placeholder="请选择文理科">
              <el-option label="文" value="文"></el-option>
              <el-option label="理" value="理"></el-option>
            </el-select>
          </el-form-item>
          <br/>
          <el-form-item :class="{'require': requirePermission}" label="高考所在省">
            <el-select v-if="proData_edu" v-model="eduBackData.ceeProvince" placeholder="请选择省份">
              <el-option v-for="(item,index) in proData_edu" :key="index" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="高考所在市">
            <el-select v-if="cityData_edu" v-model="eduBackData.ceeCity" placeholder="请选择市">
              <el-option v-for="(item,index) in cityData_edu" :key="index" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <br/>
          <el-form-item :class="{'require': requirePermission}" class="basic-message-standard" label="高考成绩">
            <el-select v-if="hignSchollSub" v-model="eduBackData.ceeSubjectFirst" placeholder="请选择科目">
              <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
            <el-input v-model="eduBackData.ceeSubjectFirstScore" placeholder="高考分数"></el-input>
            <el-input v-model="eduBackData.ceeSubjectFirstTotalScore" placeholder="满分"></el-input>
          </el-form-item>
          <br/>
          <el-form-item class="basic-message-standard" label="高考成绩">
            <el-select v-if="hignSchollSub" v-model="eduBackData.ceeSubjectSecond" placeholder="请选择科目">
              <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
            <el-input v-model="eduBackData.ceeSubjectSecondScore" placeholder="高考分数"></el-input>
            <el-input v-model="eduBackData.ceeSubjectSecondTotalScore" placeholder="满分"></el-input>
          </el-form-item>
          <br/>
          <el-form-item class="basic-message-standard" label="高考成绩">
            <el-select v-if="hignSchollSub" v-model="eduBackData.ceeSubjectThird" placeholder="请选择科目">
              <el-option v-for="(item,index) in hignSchollSub" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
            <el-input v-model="eduBackData.ceeSubjectThirdScore" placeholder="高考分数"></el-input>
            <el-input v-model="eduBackData.ceeSubjectThirdTotalScore" placeholder="满分"></el-input>
          </el-form-item>
        </div>

        <div v-for="(item,index) in eduBackData.educatList" :key="index" class="edu-scholld-item">
          <span class="del" @click="deleducatList(index)">删除</span>
          <el-form-item :class="{'require': requirePermission}" label="学历" label-width="60px">
            <el-select v-model="item.degree" class="short" placeholder="请选择">
              <el-option label="本科" :value="1"></el-option>
              <el-option label="硕士" :value="2"></el-option>
              <el-option label="博士" :value="3"></el-option>
              <el-option label="大专" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="入学年份" label-width="60px">
            <input class="edu-item" type="text" v-model="item.fromyear">
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="毕业年份" label-width="60px">
            <input class="edu-item" type="text" v-model="item.toyear">
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="毕业院校" label-width="60px">
            <input class="edu-item" type="text" v-model="item.schoolname">
          </el-form-item>
          <el-form-item  label="所学专业" label-width="60px">
            <input class="edu-item" type="text" v-model="item.submajor">
          </el-form-item>
          <!-- 产品又不上该字段，建议暂时保留 -->
          <!-- <el-form-item label="学习形式" label-width="60px">
            <el-select v-model="item.educationForm" class="short" placeholder="请选择">
              <el-option label="全日制" value="1"></el-option>
              <el-option label="非全日制" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="毕业证和学位证">
            <el-select v-model="item.certificate" class="short" placeholder="请选择">
              <el-option label="已取得学信网可查" value="1"></el-option>
              <el-option label="暂未取得(未毕业)" value="2"></el-option>
              <el-option label="暂无渠道(肄业)" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否特殊学制">
            <el-select v-model="item.specialEdu" class="short" placeholder="请选择">
              <el-option label="否" value="0"></el-option>
              <el-option label="专升本" value="1"></el-option>
              <el-option label="专插本" value="2"></el-option>
              <el-option label="成人教育" value="3"></el-option>
              <el-option label="自考" value="4"></el-option>
              <el-option label="函授" value="5"></el-option>
            </el-select>
          </el-form-item> -->
        </div>
        <div @click="addEduExperience" class="edu-experience-add">
          添加一条学习经历
          <!-- 兼职里面的资料卡 -->
        </div>
        <br />
        <el-form-item class="require" label="授课类型">
          <el-select v-model="eduBackData.classType" multiple placeholder="请选择授课类型">
             <el-option v-for="(item,i) in classTypeData" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="require" label="工作性质">
          <el-select v-model="eduBackData.timeType" disabled placeholder="请选择">
            <el-option label="兼职" :value="0"></el-option>
            <el-option label="全职" :value="1"></el-option>
            <el-option label="校招全职" :value="2"></el-option>
            <el-option label="公校兼职" :value="3"></el-option>
            <el-option label="全职学科班主任" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="require" :label="eduBackData.teaBu == '3' ? '学段偏好' : '年级偏好'">
          <el-select v-if="gradeHobby" v-model="eduBackData.teaTaughtStuGradeCode"
          :multiple="(eduBackData.state == '0' || eduBackData.state == '1') ? false : true"
          :noregvalue="eduBackData.teaTaughtStuGrade"
          placeholder="请选择">
            <el-option v-for="(item,index) in gradeHobby" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="require" label="第一擅长科目">
          <el-select v-if="basesubject" v-model="eduBackData.teaGoodFirstCode" placeholder="请选择">
            <el-option v-for="(item,index) in basesubject" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第二擅长科目">
          <el-select v-if="basesubject" v-model="eduBackData.teaGoodSecondCode" placeholder="请选择">
            <el-option v-for="(item,index) in basesubject" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item key="isOAbinding" v-show="eduBackData.teaBu != '3'"
            label="公众号绑定状态">
          <span>{{eduBackData.isOAbinding ? '是' : '否'}}</span>
        </el-form-item>
        <div v-show="eduBackData.teaBu != '3' && (eduBackData.timeType == '1' || eduBackData.timeType == '2')">
          <el-form-item label="所在分区">
            <el-select v-model="eduBackData.teaRegion" placeholder="请选择">
              <el-option label="北京" value="北京"></el-option>
              <el-option label="上海" value="上海"></el-option>
              <el-option label="江苏" value="江苏"></el-option>
              <el-option label="浙江" value="浙江"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师资格证" label-width="150px">
            <el-select v-model="eduBackData.teacherCertificate" placeholder="请选择">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 陪练 -->
        <div v-if="eduBackData.teaBu == '3'">
          <el-form-item label="学生水平偏好">
            <el-select v-model="eduBackData.teaTaughtStuLevel" multiple placeholder="请选择">
              <el-option label="启蒙（1-3级）" value="启蒙（1-3级）"></el-option>
              <el-option label="初级（4-6级）" value="初级（4-6级）"></el-option>
              <el-option label="中级（7-8级）" value="中级（7-8级）"></el-option>
              <el-option label="高级（8级以上）" value="高级（8级以上）"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主课老师">
            <el-select v-model="eduBackData.majorTeacher" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :class="{'require': requirePermission}" label="英皇辅导经验">
            <el-select v-model="eduBackData.abrsm" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="乐器">
            <el-select v-model="eduBackData.musical" multiple placeholder="请选择">
              <el-option label="钢琴" value="钢琴"></el-option>
              <el-option label="小提琴" value="小提琴"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="eduBackData.hasOwnProperty('style')" label="授课风格">
            <el-select v-if="styleData" v-model="eduBackData.style" placeholder="请选择">
              <el-option v-for="item in styleData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="eduBackData.hasOwnProperty('musicType')" label="识谱方式">
            <el-select v-if="musicTypeData" v-model="eduBackData.musicType" placeholder="请选择">
              <el-option v-for="item in musicTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="eduBackData.hasOwnProperty('pianoLevel')" label="钢琴等级">
            <el-select v-if="pianoLevelData" v-model="eduBackData.pianoLevel" placeholder="请选择">
              <el-option v-for="item in pianoLevelData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <br>
          <el-form-item :class="{'require': requirePermission}" label="教学经验">
          </el-form-item>
          <div>
            <el-input type="textarea" :rows="4" v-model="eduBackData.teachingExperience"></el-input>
          </div>
          <br>
        </div>
        <br />
        <el-form-item :label="eduBackData.teaBu != '3' ? '学生证/学历' : '获奖证书'">
          <upload ref='uploadPeilian' :action-url='loadUrl' :multiple='true'></upload>
        </el-form-item>
        <br />
        <div v-if="idCardShowState()">
          <el-form-item label="身份证正面">
            <div class="cardPanel">
              <img id="cardFaceImg" :src="cardFaceImgSrc" alt="">
              <input @change="uploadCard('cardFace','cardFaceImg')" id="cardFace" class="file" type="file" name="" value="">
            </div>
          </el-form-item>
          <br />
          <el-form-item label="身份证反面">
            <div class="cardPanel">
              <img id="cardSideImg" :src="cardSideImgSrc" alt="">
              <input @change="uploadCard('cardSide','cardSideImg')" id="cardSide" class="file" type="file" name="" value="">
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="basic-tab-item-control">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="confirmState" @click="confirm" type="primary">确定</el-button>
    </div>
  </div>
  <div v-else class="basicinfo-no-data">
    {{statueText}}
  </div>
</div>
</template>
<script>
import upload from './component/upload.vue';
import getEduBack from './API/getEduBack';
import updateTeaEduBackInfo from './API/updateTeaEduBackInfo'
import getSubject from './API/getSubject'
import getAppointmentSubject from './API/getAppointmentSubject'
import getAllDic from './API/getAllDic'
import getGrade from './API/getGrade'
import getPhase from './API/getPhase'
import getPhaseNew from './API/getPhaseNew'
import getProvinces from './API/getProvinces'
import getCitys from './API/getCitys'
import getTeaLevel from './API/getTeaLevel'
import loadFile from './API/loadFile'
import edubackData from './API-Data/edubackData'
import {equalArray} from './assets/js/assist.js'
import commonCascade from '../../../zm-platform/api/select/commonCascade';


let defaultHeadImg = require('./assets/image/default.jpg');
let certificateOtherside = require('./assets/image/certificateOtherside.png');
let certificatePositive = require('./assets/image/certificatePositive.png');

export default {
  data() {
    return {
      loadUrl: "/api/teachers-mp/api/upload/uploadAttachment",
      eduBackData: {},
      gradeHobby: [],
      confirmState: false,
      cardFaceImgSrc: certificateOtherside,
      cardSideImgSrc: certificatePositive,
      proData_edu: [],
      cityData_edu: [],
      hignSchollSub: [],
      basesubject: [],
      styleData: [],
      musicTypeData: [],
      pianoLevelData: [],
      appointmentSubject: [],
      dicData: [],
      isBuinit: true,
      isTimeTypeBuinit: true,
      waitShowPro_edu: "", //预展示省 之所以要设置预展示 是因为要手动触发省的改变 用来加载市
      waitShowCity_edu: "", //预展示市
      API:{
        getEduBack:null,
        updateTeaEduBackInfo:null,
        getSubject:null,
        getAppointmentSubject:null,
        getAllDic:null,
        getGrade:null,
        getPhase:null,
        getProvinces:null,
        getCitys:null,
        getTeaLevel:null
      },
      statueText:"正在加载...",
      classTypeData: [],
      classTypeCopy: '',
    }
  },
  props: [
    'tea-id',
    'eduInfo-permission',//获取教学背景(权限)
    'edit-edu-info-permission',//修改教学背景(权限)
    'get-edu-back',//获取教学背景
    'update-tea-edu-back-info',//修改教学背景
    'get-subject',//获取第一擅长科目
    'get-appointment-subject',//获取预约科目
    'get-all-dic',//获取所有字典
    'get-grade',//获取年级
    'get-phase',//获取学段
    'get-provinces',//获取省
    'get-citys',//获取市
    'get-tea-level',//获取教师等级
    'all-subject',//所有的科目
    'page-info'//引用该组件的入口页面的信息
  ],
  watch: {
    "eduBackData.ceeProvince": function(name) {
      if (!name) {
        return;
      }
      this.eduBackData.ceeCity = "";
      let proId = this.getProId_edu(name);
      this.getCityData_edu(proId);
    },
    "eduBackData.teaBu": function(val, oldval) {
      if (oldval + "" != "" && this.isBuinit == false) {
        this.clearGradeHobby(); //清除选择的学段数据
        this.clearGoodFirstSub(); //清除选择的擅长科目数据
        this.clearSub(); //清除选择的预约科目数据

      }
      this.isBuinit = false;

      this.initGradeHobby();
      this.initSubject();
      this.initAppointmentSubject(); //获取预约科目数据
    },
    "eduBackData.timeType": function(val, oldval) {
      if (oldval + "" != "" && this.isTimeTypeBuinit == false) {
        this.clearGradeHobby(); //清除学段
        this.clearGoodFirstSub(); //清除擅长科目
        this.clearSub(); //清除预约科目
      }
      this.isTimeTypeBuinit = false;

      this.initGradeHobby();
      this.initSubject();
      this.initAppointmentSubject();
    },
    "eduBackData.teaTaughtStuGradeCode": function(val, oldval) {
      if (oldval + "" != "") {
        //判断两次值 是否相等
        let isEqual =  equalArray(oldval,val);
        if(isEqual == false){
          this.clearGoodFirstSub(); //清除擅长科目
          this.clearSub(); //清除预约科目
        }

      }

      this.initSubject(); //获取擅长科目数据
      this.initAppointmentSubject();
    },
    "eduBackData.teaGoodFirstCode": function(val, oldval) {
      if (oldval + "" != "") {
        this.clearSub(); //清除预约科目
      }
      this.initAppointmentSubject(); //重新获取预约科目数据
    }
  },
  mounted: function() {
    this.apiSetting();
    this.$BMloading("eduBack")
    this.API.getProvinces().then(data => {
      this.proData_edu = data;
      this.getData();
    }).catch(message => {
      this.$BMloadingFinish("eduBack")
      this.$Message({
        message
      });
    })
    commonCascade([{"dictCode":"TEACHER_COURSE_TYPE"}]).then(data => {
      this.classTypeData = data.children
    })
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.saveData();
    },
    idCardShowState(){
      if(this.eduBackData.hasOwnProperty('idCardListFace') == false){
        return false;
      }
      if(this.eduBackData.hasOwnProperty('idCardListSide') == false){
        return false;
      }
      if(this.eduBackData.teaBu == '3'){
        return true;
      }
      if(this.eduBackData.timeType == '0' || this.eduBackData.timeType == '3'){
        return true;
      }
      return true;
    },
    getData() {
      if(!this.eduInfoPermission){
        this.statueText = "您暂时没有权限获取教学背景数据";
        return;
      }
      this.statueText = "";
      this.API.getEduBack({
        teaId: this.teaId
      }).then(data => {
        this.$BMloadingFinish("eduBack")
        this.classTypeCopy = data.classType;
        this.eduBackData = edubackData(data);
        this.handingData(this.eduBackData);
        this.initOtherData();
      }).catch(message => {
        this.eduBackData = {};
        this.$BMloadingFinish("eduBack")
        this.$Message({
          message: message
        });
        this.statueText = "暂无数据";
        console.log("getEduBack异常:", message)
      })
    },
    addEduExperience() {
      this.eduBackData.educatList.push({
        degree: '',
        toyear: '',
        schoolname: '',
        submajor: '',
        fromyear: '',
        educationForm: '1',
        certificate: '1',
        specialEdu: '0',
      });
    },
    deleducatList(index) {
      this.eduBackData.educatList.splice(index, 1);
    },
    saveData() {
      if(!this.editEduInfoPermission){
        this.$Message({
          message:"您暂时没有权限修改教学背景数据"
        });
        return;
      }
      let parm = {
        teaId: this.teaId,
      };

      parm.teaBu = this.eduBackData.teaBu; // 所属BU
      parm.teaSchoolGao = this.eduBackData.teaSchoolGao; // 高中学校
      parm.teaWenli = this.eduBackData.teaWenli; // 高考文理科
      parm.ceeProvince = this.eduBackData.ceeProvince; // 高考所在地(省)
      parm.ceeCity = this.eduBackData.ceeCity; // 高考所在地(市)
      parm.ceeSubjectFirst = this.eduBackData.ceeSubjectFirst; // 高考科目
      parm.ceeSubjectFirstScore = this.eduBackData.ceeSubjectFirstScore; // 高考分数
      parm.ceeSubjectFirstTotalScore = this.eduBackData.ceeSubjectFirstTotalScore; // 高考满分
      parm.ceeSubjectSecond = this.eduBackData.ceeSubjectSecond; // 高考科目
      parm.ceeSubjectSecondScore = this.eduBackData.ceeSubjectSecondScore; // 高考分数
      parm.ceeSubjectSecondTotalScore = this.eduBackData.ceeSubjectSecondTotalScore; // 高考满分
      parm.ceeSubjectThird = this.eduBackData.ceeSubjectThird; // 高考科目
      parm.ceeSubjectThirdScore = this.eduBackData.ceeSubjectThirdScore; // 高考分数
      parm.ceeSubjectThirdTotalScore = this.eduBackData.ceeSubjectThirdTotalScore; // 高考满分
      parm.educatList = this.eduBackData.educatList; // 学习经历
      parm.classType = this.classTypeCopy; // 授课类型
      parm.courseTypes = this.eduBackData.classType.toString(); // 授课类型
      parm.timeType = this.eduBackData.timeType; // 工作性质
      parm.teaRegion = this.eduBackData.teaRegion; // 所在分区
      parm.teacherCertificate = this.eduBackData.teacherCertificate; // 是否有教师资格证
      parm.majorTeacher = this.eduBackData.majorTeacher; // 主课老师
      parm.abrsm = this.eduBackData.abrsm; // 英皇辅导经验
      parm.style = this.eduBackData.style; // 授课风格
      parm.musicType = this.eduBackData.musicType; // 识谱方式
      parm.pianoLevel = this.eduBackData.pianoLevel; // 钢琴等级
      parm.teachingExperience = this.eduBackData.teachingExperience.replace(/\%/g, '％'); // 教学经验

      parm.teaGoodFirstCode = this.eduBackData.teaGoodFirstCode; //获取第一擅长科目中文
      parm.teaGoodSecondCode = this.eduBackData.teaGoodSecondCode; //获取第二擅长科目中文
      parm.teaTaughtStuGradeCode = this.eduBackData.teaTaughtStuGradeCode; //获取年级偏好中文
      parm.musical = this.eduBackData.musical; //乐器

      parm.teaGoodFirst = this.getTextByValueForGoodFirst(parm.teaGoodFirstCode); //获取第一擅长科目中文
      parm.teaGoodSecond = this.getTextByValueForGoodFirst(parm.teaGoodSecondCode); //获取第二擅长科目中文
      parm.teaTaughtStuGrade = this.getTeaTaughtStuGradeText(parm.teaTaughtStuGradeCode); //获取年级偏好中文



      parm.enableAppointSubjectCode = this.eduBackData.enableAppointSubjectCode.toString(); //预约科目
      parm.teaTaughtStuLevel = this.eduBackData.teaTaughtStuLevel.toString(); //学生水平偏好

      parm.teaTaughtStuGradeCode = parm.teaTaughtStuGradeCode.toString(); //年级偏好存在多个 所以需要转一下
      parm.teaTaughtStuGrade = parm.teaTaughtStuGrade.toString(); //年级偏好存在多个 所以需要转一下
      parm.musical = parm.musical.toString(); //乐器需要转换成字符串
      if (!!this.eduBackData.cardFaceUrl) {
        parm.idCardListFace = this.eduBackData.cardFaceUrl
      } else {
        parm.idCardListFace = this.eduBackData._idCardListFace
      }
      if (!!this.eduBackData.cardSideUrl) {
        parm.idCardListSide = this.eduBackData.cardSideUrl;
      } else {
        parm.idCardListSide = this.eduBackData.idCardListSide;
      }

      if(this.eduBackData._data){
        parm._data = this.eduBackData._data;//回传旧数据
      }

      if(this.eduBackData.certificateNeed == "no"){
        this.updateEduback(parm);
        return;
      }

      this.confirmState = true;
      this.$refs.uploadPeilian.upload(data => {
        let oldImgpath = data.oldImgpath; //这个地方是编辑的时候传进去的图片地址

        if (data.code == "-1") { //未选择文件
          let imgPathList = [];
          for (let j = 0; j < oldImgpath.length; j++) {
            imgPathList.push(oldImgpath[j]) //保存之前的图片地址
          }
          if (this.eduBackData.teaBu != '3') {
            parm.studentIdCardList = imgPathList;
          } else {
            parm.awardList = imgPathList;
          }
          this.updateEduback(parm);
          return;
        }
        if (data.code == "0") {
          let _data = data.data; //这个地方是用户新上传的图片地址

          let imgPathList = [];
          for (let i = 0; i < _data.length; i++) {
            imgPathList.push(_data[i]) //保存图片地址
          }
          for (let j = 0; j < oldImgpath.length; j++) {
            imgPathList.push(oldImgpath[j]) //保存图片地址
          }
          if (this.eduBackData.teaBu != '3') {
            parm.studentIdCardList = imgPathList;
          } else {
            parm.awardList = imgPathList;
          }
          this.updateEduback(parm);
          return;
        } else {
          this.$Message({
            message: data.message
          });
          this.confirmState = false;
          return;
        }
      });
    },
    updateEduback(parm) {
      this.API.updateTeaEduBackInfo(parm,this.requirePermission).then(data => {
        this.$Message({
          message: "操作成功"
        });
        this.confirmState = false;
        this.$emit("confirm")
      }).catch(message => {
        console.log("updateTeaEduBackInfo异常:", message)
        this.$Message({
          message
        });
        this.confirmState = false;
      });
    },
    clearGradeHobby() {
      this.eduBackData.teaTaughtStuGradeCode = [];
      this.eduBackData.teaTaughtStuGrade = [];
    },
    clearGoodFirstSub() {
      this.eduBackData.teaGoodFirstCode = ''; //科目
      this.eduBackData.teaGoodSecondCode = ''; //科目
      this.eduBackData.goodFirstSubject = "";
      this.eduBackData.goodSecondSubject = "";
    },
    clearSub() {
      this.eduBackData.enableAppointSubjectCode = [];
    },
    initOtherData() {
      this.initGradeHobby();
      this.getProData_edu();
      this.initHignSchollSub();
      this.initSubject();
      this.getAllDicData();
    },
    initAppointmentSubject() {
      if(!this.eduBackData){
        return;
      }
      this.appointmentSubject = [];
      if(!this.eduBackData.teaBu || !this.eduBackData.teaGoodFirstCode || !this.eduBackData.teaTaughtStuGradeCode){
        return;
      }
      if(this.eduBackData.teaTaughtStuGradeCode.length == 0){
        return;
      }

      let bu = this.eduBackData.teaBu;
      let sub = this.eduBackData.teaGoodFirstCode;
      let phase = this.eduBackData.teaTaughtStuGradeCode.toString();
      let type = "phase";
      // if (this.eduBackData.teaBu == "1" && (this.eduBackData.timeType == '0' || this.eduBackData.timeType == '3')) {
      //   type = "grade";
      // }
      let parm = {
        bu: bu,
        sub: sub,
        phase: phase,
        type: type
      };

      this.API.getAppointmentSubject(parm).then(data => {
        this.appointmentSubject = data.children;
        let appointmentSubjectValueArray = []
        let enableAppointSubjectCodeArray = []
        if (this.eduBackData.enableAppointSubjectCode.length > 0) {
          // this.eduBackData.enableAppointSubjectCode = this.appointmentSubject[0].value
          this.appointmentSubject.map(item => {
            appointmentSubjectValueArray.push(item.value)
          })
          enableAppointSubjectCodeArray = appointmentSubjectValueArray.filter(v => this.eduBackData.enableAppointSubjectCode.includes(v))
          this.eduBackData.enableAppointSubjectCode = enableAppointSubjectCodeArray
        }

        if (this.eduBackData.teaBu == "2") {
          this.addLearn(this.appointmentSubject);
        }
      }).catch(message => {
        console.log("getAppointmentSubject异常:", message)
        this.appointmentSubject = [];
      });
    },
    addLearn(data) {
      let exsitLearn = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].label == "学习力训练") {
          exsitLearn = true;
          break;
        }
      }
      if (!exsitLearn) {
        data.push({
          value: "LEARNING_ABILITY_TRAINING",
          label: "学习力训练"
        });
      }
    },
    getAllDicData() {
      if(this.eduBackData.hasOwnProperty('style') == false || this.eduBackData.hasOwnProperty('musicType') == false || this.eduBackData.hasOwnProperty('pianoLevel') == false){
        return;
      }
      this.API.getAllDic({}).then(data => {
        this.dicData = data;
        this.initDictData();
      }).catch(message => {
        console.log("getAllDic异常:", message)
        this.$Message({
          message
        });
      });
    },
    initDictData() {
      let item = null;
      for (let i = 0; i < this.dicData.length; i++) {
        item = this.dicData[i];
        if (item.nodeCode == "pianoLevel") {
          this.pianoLevelData = item.options;
        }
        if (item.nodeCode == "style") {
          this.styleData = item.options;
        }
        if (item.nodeCode == "musicType") {
          this.musicTypeData = item.options;
        }
      }
    },
    getFileUrl(sourceId) {
      if (document.getElementById(sourceId).value + "" == "") {
        return "";
      }
      var url;
      if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
        url = document.getElementById(sourceId).value;
      } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
      } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
      }
      return url;
    },
    initSubject() {
      if(!this.eduBackData){
        return;
      }
      this.basesubject = [];
      if(!this.eduBackData.teaTaughtStuGradeCode || !this.eduBackData.teaBu){
        return;
      }
      if(this.eduBackData.teaTaughtStuGradeCode.length == 0){
        return;
      }
      let phase = this.eduBackData.teaTaughtStuGradeCode.toString();
      let bu = this.eduBackData.teaBu;
      let type = "phase";
      if (this.eduBackData.teaBu == "2") {
        type = "grade";
      }
      let parm = {
        bu: bu,
        phase: phase,
        type: type
      };
      this.API.getSubject(parm).then(data => {
        this.basesubject = data.children;
      }).catch(message => {
        console.log("getSubject异常:", message)
        this.basesubject = [];
      });
    },
    initGradeHobby() {
      if(!this.eduBackData){
        return;
      }
      // timeType: 0兼职，timeType: 3 公校兼职，
      if (this.eduBackData.teaBu == "1" && (this.eduBackData.timeType == '0' || this.eduBackData.timeType == '3')) {
        // this.initgetGrade(); //初始化年级数据
        this.initgetPhase(); //初始化学段数据
      } else if (this.eduBackData.teaBu == "2") {
        this.initgetPhaseNew(); // 少儿的
      } else {
        this.initgetPhase(); //初始化学段数据
      }
    },
    uploadCard(eleID, imgID) {
      let url = this.getFileUrl(eleID);
      if (!!url) {
        loadFile({
          ID: eleID
        }).then(data => {
          if (eleID == "cardFace") {
            this.eduBackData.cardFaceUrl = data[0];
            this.cardFaceImgSrc = url;
          }
          if (eleID == "cardSide") {
            this.eduBackData.cardSideUrl = data[0];
            this.cardSideImgSrc = url;
          }
        }).catch(message => {
          console.log("loadFile异常:", message)
          this.$Message({
            message
          });
        });
      } else {
        if (eleID == "cardFace") {
          url = certificateOtherside;
          this.eduBackData.cardFaceUrl = "";
          this.cardFaceImgSrc = certificateOtherside;
        }
        if (eleID == "cardSide") {
          url = certificatePositive;
          this.eduBackData.cardSideUrl = "";
          this.cardSideImgSrc = certificatePositive;
        }
      }
    },
    getTextByValueForGoodFirst(id) {
      let text = "";
      for (let i = 0; i < this.basesubject.length; i++) {
        if (this.basesubject[i].value == id) {
          text = this.basesubject[i].label;
          break;
        }
      }
      return text;
    },
    getTextByValueForTeaTaughtStuGrade(id) {
      let text = "";
      for (let i = 0; i < this.gradeHobby.length; i++) {
        if (this.gradeHobby[i].value == id) {
          text = this.gradeHobby[i].label;
          break;
        }
      }
      return text;
    },
    getTeaTaughtStuGradeText(d) {
      if (Object.prototype.toString.call(d) !== '[object Array]') {
        d = [d];
      }
      let _data = [];
      for (let i = 0; i < d.length; i++) {
        _data.push(this.getTextByValueForTeaTaughtStuGrade(d[i]));
      }
      return _data;
    },
    initgetGrade() {
      if(!this.eduBackData){
        return;
      }
      this.gradeHobby = [];
      let bu = this.eduBackData.teaBu;
      if(!bu){
        return;
      }
      let parm = {
        bu: bu
      }
      this.API.getGrade(parm).then(data => {
        this.gradeHobby = data.children;
        //判断如果code与text是否一致,如果不一致 则将text赋值给code,属于脏数据处理
        this.translateTeaTaughtData();
      }).catch(message => {
        console.log("getGrade异常:", message)
        this.gradeHobby = [];
      });
    },
    initgetPhase() {
      if(!this.eduBackData){
        return;
      }
      this.gradeHobby = [];
      let bu = this.eduBackData.teaBu;
      if(!bu){
        return;
      }
      let parm = {
        bu:bu
      }
      this.API.getPhase(parm).then(data => {
        this.gradeHobby = data.children;
        //判断如果code与text是否一致,如果不一致 则将text赋值给code
        this.translateTeaTaughtData();
      }).catch(message => {
        console.log("getPhase异常:", message)
        this.gradeHobby = [];
      });
    },
    initgetPhaseNew() {
      if(!this.eduBackData){
        return;
      }
      this.gradeHobby = [];
      let bu = this.eduBackData.teaBu;
      if(!bu){
        return;
      }
      let parm = {
        bu:bu
      }
      getPhaseNew(parm).then(data => {
        this.gradeHobby = data.children;
        //判断如果code与text是否一致,如果不一致 则将text赋值给code
        this.translateTeaTaughtData();
      }).catch(message => {
        console.log("getPhase异常:", message)
        this.gradeHobby = [];
      });
    },
    translateTeaTaughtData() {
      let _teaTaughtStuGrade;
      if (Object.prototype.toString.call(this.eduBackData.teaTaughtStuGrade) === '[object Array]') {
        _teaTaughtStuGrade = this.eduBackData.teaTaughtStuGrade;
      } else {
        _teaTaughtStuGrade = this.eduBackData.teaTaughtStuGrade.split(',');
      }
      if (_teaTaughtStuGrade.length == 0) {
        return;
      }
      //获取text对应code
      let _code = "",
        item = null;
      for (let i = 0; i < _teaTaughtStuGrade.length; i++) {
        item = _teaTaughtStuGrade[i];
        let __code = this.getValueByTextForTeaTaughtStuGrade(item);
        if (__code != "") {
          _code = _code + __code + ",";
        }
      }
      if (_code == "") {
        return;
      }
      _code = _code.substr(0, _code.length - 1)
      let _teaTaughtStuGradeCode = [];
      Object.assign(_teaTaughtStuGradeCode, this.eduBackData.teaTaughtStuGradeCode)
      if (_code != _teaTaughtStuGradeCode.toString()) {
        this.eduBackData.teaTaughtStuGradeCode = _code.split(',');
      }
    },
    getValueByTextForTeaTaughtStuGrade(text) {
      let value = "";
      for (let i = 0; i < this.gradeHobby.length; i++) {
        if (this.gradeHobby[i].label == text) {
          value = this.gradeHobby[i].value;
          break;
        }
      }
      return value;
    },
    initHignSchollSub() {
      if(!this.eduBackData){
        return;
      }
      this.hignSchollSub = [];
      this.API.getSubject({}).then(data => {
        this.hignSchollSub = data.children;
      }).catch(message => {
        console.log("getSubject异常:", message)
        this.hignSchollSub = [];
      });
    },
    getProData_edu() {
      this.API.getProvinces().then(data => {
        this.proData_edu = data;
        if (this.waitShowPro_edu) {
          this.eduBackData.ceeProvince = this.waitShowPro_edu;
          this.waitShowPro_edu = '';
        }
      }).catch(message => {
        console.log("getProvinces异常:", message)
        this.$Message({
          message
        });
      })
    },
    getProId_edu(name) {
      let id = "";
      if (!this.proData_edu) {
        return "";
      }
      for (let i = 0; i < this.proData_edu.length; i++) {
        if (this.proData_edu[i].label == name) {
          id = this.proData_edu[i].value;
          break;
        }
      }
      return id;
    },
    getCityData_edu(id) {
      this.API.getCitys({
        provinceId: id
      }).then(data => {
        this.cityData_edu = data;
        if (this.waitShowCity_edu) {
          this.eduBackData.ceeCity = this.waitShowCity_edu;
          this.waitShowCity_edu = '';
        }
      }).catch(message => {
        console.log("getCitys异常:", message)
        this.$Message({
          message
        });
      })
    },
    handingData(data) {
      //处理图片链接
      let _imgList = [];
      if (this.eduBackData.teaBu == "3") {
        _imgList = this.eduBackData.awardList;
      } else {
        _imgList = this.eduBackData.studentidCardList;
      }
      if (!!_imgList && _imgList.length > 0) {
        let _studentidCardList = [];
        for (let i = 0; i < _imgList.length; i++) {
          _studentidCardList.push(_imgList[i].url)
        }
        window.uploadInterval = window.setInterval(() => {
          if (!!this.$refs.uploadPeilian) {
            window.clearInterval(window.uploadInterval)
            this.$refs.uploadPeilian.initData(_studentidCardList);
          }
        }, 10)
      }
      //处理身份证
      if (!!this.eduBackData.idCardListFace) {
        this.cardFaceImgSrc = this.eduBackData.idCardListFace;
      }
      if (!!this.eduBackData.idCardListSide) {
        this.cardSideImgSrc = this.eduBackData.idCardListSide;
      }
      //处理省市
      this.waitShowPro_edu = this.eduBackData.ceeProvince;
      this.waitShowCity_edu = this.eduBackData.ceeCity;
      //处理科目问题
      let firstSubCode = this.getCodeByText(this.allSubject,this.eduBackData.teaGoodFirst);
      let secondSubCode = this.getCodeByText(this.allSubject,this.eduBackData.teaGoodSecond);
      if(this.eduBackData.teaGoodFirstCode == ""){
        this.eduBackData.teaGoodFirstCode = firstSubCode;
      }
      if(this.eduBackData.teaGoodSecondCode == ""){
        this.eduBackData.teaGoodSecondCode = secondSubCode;
      }
      this.initTrainLevelData();
    },
    getCodeByText(data,text){
      let code = "";
      for(let i = 0; i < data.length; i++){
        if(data[i].label == text){
          code = data[i].value;
          break;
        }
      }
      return code;
    },
    initTrainLevelData() {
      if(!this.eduBackData){
        return;
      }
      this.trainLevelData = [];
      let bu = this.eduBackData.teaBu;
      let timeType = this.eduBackData.timeType;
      if(!bu || !timeType){
        return
      }
      let parm = {
        bu: bu,
        timeType:timeType
      };
      this.API.getTeaLevel(parm).then(data => {
        let _data = [];
        for (let i = 0; i < data.children.length; i++) {
          _data.push({
            value: data.children[i].value + "",
            label: data.children[i].label
          })
        }
        this.trainLevelData = _data;
      }).catch(message => {
        this.$Message({
          message
        });
        console.log("getTeaLevel异常:", message)
      });
    },
    apiSetting(){
      if(!!this.getEduBack){
        this.API.getEduBack = this.getEduBack;
      }else{
        this.API.getEduBack = getEduBack;
      }
      if(!!this.updateTeaEduBackInfo){
        this.API.updateTeaEduBackInfo = this.updateTeaEduBackInfo;
      }else{
        this.API.updateTeaEduBackInfo = updateTeaEduBackInfo;
      }
      if(!!this.getSubject){
        this.API.getSubject = this.getSubject;
      }else{
        this.API.getSubject = getSubject;
      }
      if(!!this.getAppointmentSubject){
        this.API.getAppointmentSubject = this.getAppointmentSubject;
      }else{
        this.API.getAppointmentSubject = getAppointmentSubject;
      }
      if(!!this.getAllDic){
        this.API.getAllDic = this.getAllDic;
      }else{
        this.API.getAllDic = getAllDic;
      }
      if(!!this.getGrade){
        this.API.getGrade = this.getGrade;
      }else{
        this.API.getGrade = getGrade;
      }
      if(!!this.getPhase){
        this.API.getPhase = this.getPhase;
      }else{
        this.API.getPhase = getPhase;
      }
      if(!!this.getProvinces){
        this.API.getProvinces = this.getProvinces;
      }else{
        this.API.getProvinces = getProvinces;
      }
      if(!!this.getCitys){
        this.API.getCitys = this.getCitys;
      }else{
        this.API.getCitys = getCitys;
      }
      if(!!this.getTeaLevel){
        this.API.getTeaLevel = this.getTeaLevel;
      }else{
        this.API.getTeaLevel = getTeaLevel;
      }
    }
  },
  computed: {
    requirePermission() {
      //限制该页面=>BU、授课类型、工作性质、第一擅长科目、年级偏好 、上课科目必填，其他非必填
      return this.pageInfo === '招师-兼职-面试管理-个人信息-基本信息';
    }
  },
  components: {
    upload
  }
}
</script>
<style scoped media="screen">
  .basic-message-standard{
    width: auto !important;
  }
  .basic-message-standard .el-input,.basic-message-standard .el-select{
    width: 200px !important;
  }
  .edu-scholld-item{
    padding: 10px;
    background-color: #ddd;
    position: relative;
    margin-bottom: 5px;
  }
  .edu-scholld-item .el-form-item{
    margin-bottom: 0px;
  }
  .edu-scholld-item .edu-item{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 30px;
    outline: 0;
    padding: 0 15px;
    width: 200px;
  }
  .edu-scholld-item .del{
    position: absolute;
    cursor: pointer;
    top:20px;
    right:10px;
    font-size: 12px;
  }
  .edu-experience-add{
    padding: 0px 10px 10px 0px;
    color:#169BD5;
    cursor: pointer;
    display: inline-block;
  }
  .cardPanel{
    width: 200px;
    height: 58px;
    text-align: center;
    cursor: pointer;
    line-height: 100px;
    position: relative;
  }
  .cardPanel img{
    float: left;
    width: 50%;
  }
  .cardPanel .file{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  /* .el-button{
    padding: 0 20px;
  } */

</style>
