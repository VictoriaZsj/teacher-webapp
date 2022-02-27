<template>
  <div @click="cancel()" class="back">
    <div @click.stop="contentClick()" id="content" class="content">
      <div class="teaMsg">
        <div class="head">
          <el-row>
            <el-col :span="10">
              <img id="preverAvatarHeadImg" class="headImg" :onerror="restoreLogo(teaMsg.headImageUrl)" :src="teaMsg.headImageUrl" />
            </el-col>
            <el-col :span="14">
              <span class="name">{{teaMsg.userName}}</span>
              <p class="teaType">授课老师</p>
              <ul class="labels">
                  <li v-for="(item,index) in teaMsg.teachingSytle" class="label-li" :key="index"><span >{{item}}</span></li>
              </ul>
            </el-col>
          </el-row>
          <!-- <p v-if="teaMsg.teaBu !== 3" class="otto">{{teaMsg.teachingExperience}}</p> -->
          <span class="boundary"></span>
          <div class="exprience" v-if="teaMsg.teaBu !== 3">
            <ul v-if="teaMsg.schoolInfo" class="educate-item">
              <li class="title">最高学历</li>
              <li class="depict">
                <span>学校:{{teaMsg.schoolInfo}}</span>
              </li>
            </ul>
            <ul v-if="teaMsg.city" class="educate-item">
              <li class="title">高考经历</li>
              <li class="depict">
                <span>
                  高考省份:{{teaMsg.city}}<br>
                  高考成绩:<span>{{teaMsg.ceeInfo}}</span>
                </span>
              </li>
            </ul>
            <ul v-if="!!teaMsg.teachingExperience" class="educate-item">
              <li class="title">教学经验</li>
              <li class="depict">
                <span>{{teaMsg.teachingExperience}}</span>
              </li>
            </ul>
            <ul v-if="!!teaMsg.honors" class="educate-item">
              <li class="title">奖项荣誉</li>
              <li class="depict">
                <span>{{teaMsg.honors}}</span>
              </li>
            </ul>
            <ul v-if="!!teaMsg.selfEvaluate" class="educate-item">
              <li class="title">自我评价</li>
              <li class="depict">
                <span>{{teaMsg.selfEvaluate}}</span>
              </li>
            </ul>
            <ul v-if="teaMsg.teachingNotes" class="educate-item">
              <li class="title">提分心得</li>
              <li class="depict">
                <span>{{teaMsg.teachingNotes}}</span>
              </li>
            </ul>
            <ul v-if="teaMsg.awardRecordInfo" class="educate-item">
              <li class="title">获奖经历</li>
              <li class="depict">
                <span>{{teaMsg.awardRecordInfo}}</span>
                <img v-for="(item,index) in this.teaMsg.awardRecordInfoImg" :key="index" @click="preview(item)" :src="item" alt="">
              </li>
            </ul>
            <ul class="educate-item" v-if="eduBackData && (eduBackData.awardRecordEnglishLevel || eduBackData.awardRecordToeflScore || eduBackData.awardRecordIeltsScore)">
                <li class="title">专业证书</li>
                <li class="depict">
                    <template v-if="eduBackData.awardRecordEnglishLevel">
                        <span>英语：{{eduBackData.awardRecordEnglishLevel}}</span>
                    </template>
                    <template v-if="eduBackData.awardRecordToeflScore">
                        <span>托福：{{eduBackData.awardRecordToeflScore}}分</span>
                    </template>
                    <template v-if="eduBackData.awardRecordIeltsScore">
                        <span>雅思：{{eduBackData.awardRecordIeltsScore}}分</span>
                    </template>
                </li>
            </ul>
            <ul v-if="teaMsg.hobby" class="educate-item">
              <li class="title">兴趣爱好</li>
              <li class="depict">
                <span>{{teaMsg.hobby}}</span>
              </li>
            </ul>
          </div>
          <div class="exprience" v-if="teaMsg.teaBu === 3">
            <ul   class="educate-item">
              <li class="title">教学经验</li>
              <li class="depict">
                <span>{{teaMsg.teachingExperience}}</span>
              </li>
            </ul>
            <ul v-if="!!teaMsg.honors" class="educate-item">
              <li class="title">奖项荣誉</li>
              <li class="depict">
                <span>{{teaMsg.honors}}</span>
              </li>
            </ul>
            <ul v-if="!!teaMsg.selfEvaluate" class="educate-item">
              <li class="title">自我评价</li>
              <li class="depict">
                <span>{{teaMsg.selfEvaluate}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let defaultHeadImg = require('../../../src/assets/default.jpg');

export default {
    data() {
        return {
          teaMsg:{
            headImageUrl:null,//头像
            userName:"",//姓名
            teachingSytle:null,//教学风格
            personalIntroduce:"",//个人介绍
            schoolInfo:"",//最高学历
            ceeInfo:"",//高考成绩概况
            city:"",//高考城市
            teachingExperience:'',//教学经验
            honors: '', // 奖项荣誉
            selfEvaluate: '', // 自我评价
            teachingNotes:"",//教学心得
            awardRecordInfo :"",//获奖经历
            awardRecordInfoImg :[],//获奖经历
            hobby:"",//兴趣爱好
            gradeCase:"",//优秀案例
            teaBu: "" // 老师bu
          }
        }
    },
    props:{
        currentID:null,
        viewState:false,//false表示页面关闭，true表示页面展开
        teaData:{},
        eduBackData: {}
    },
    watch:{
      viewState (val) {
        if(!val){
          this.default();
        }
      },
      teaData (data) {//
        //整理数据
        Object.assign(this.teaMsg,data);
        if(!!data.teachingSytle){
          this.teaMsg.teachingSytle = data.teachingSytle.split(',');
        }
        if(!!data.schoolGao){
          this.teaMsg.schoolInfo = data.schoolGao;
        }
        if(!!data.schoolBen){
          this.teaMsg.schoolInfo = data.schoolBen;
        }
        if(!!data.schoolYan){
          this.teaMsg.schoolInfo = data.schoolYan;
        }
        this.teaMsg.city = data.ceeProvince;
        this.teaMsg.ceeInfo = data.ceeSubjectFirst+':'+data.ceeSubjectFirstScore+'/'+data.ceeSubjectFirstTotalScore+";";
        this.teaMsg.ceeInfo = this.teaMsg.ceeInfo + data.ceeSubjectSecond+':'+data.ceeSubjectSecondScore+'/'+data.ceeSubjectSecondTotalScore+";";
        this.teaMsg.ceeInfo = this.teaMsg.ceeInfo + data.ceeSubjectThird+':'+data.ceeSubjectThirdScore+'/'+data.ceeSubjectThirdTotalScore;
        if(!!data.awardRecordFirstCompetitionLevel && !!data.awardRecordFirstSubject && !!data.awardRecordFirstLevel){
          this.teaMsg.awardRecordInfo = this.teaMsg.awardRecordInfo + "曾获" + data.awardRecordFirstCompetitionLevel + data.awardRecordFirstSubject + "竞赛" + data.awardRecordFirstLevel + "等奖;";
        }
        if(!!data.awardRecordSecondCompetitionLevel && !!data.awardRecordSecondSubject && !!data.awardRecordSecondLevel){
          this.teaMsg.awardRecordInfo = this.teaMsg.awardRecordInfo + "曾获" + data.awardRecordSecondCompetitionLevel + data.awardRecordSecondSubject + "竞赛" + data.awardRecordSecondLevel + "等奖;";
        }
        if(!!data.awardRecordThirdCompetitionLevel && !!data.awardRecordThirdSubject && !!data.awardRecordThirdLevel){
          this.teaMsg.awardRecordInfo = this.teaMsg.awardRecordInfo + "曾获" + data.awardRecordThirdCompetitionLevel + data.awardRecordThirdSubject + "竞赛" + data.awardRecordThirdLevel + "等奖;";
        }
        this.teaMsg.awardRecordInfoImg = [];
        if(!!data.awardRecordFirstFile){
          this.teaMsg.awardRecordInfoImg.push(data.awardRecordFirstFile);
        }
        if(!!data.awardRecordSecondFile){
          this.teaMsg.awardRecordInfoImg.push(data.awardRecordSecondFile);
        }
        if(!!data.awardRecordThirdFile){
          this.teaMsg.awardRecordInfoImg.push(data.awardRecordThirdFile);
        }
        if(!!data.caseWeakStudentCount && !!data.caseWeakStudentMonth && !!data.caseWeakStudentImproveScore){
          this.teaMsg.gradeCase = "曾帮助班级排名"+data.caseWeakStudentCount+"名的考生在"+data.caseWeakStudentMonth+"个月内 提分"+data.caseWeakStudentImproveScore+"分。";
        }
      }
    },
    methods:{
        preview (path) {
          this.$root.$children[0].showBigImg(path);
        },
        restoreLogo (picSrc) {
          if(!!document.getElementById("preverAvatarHeadImg") && !picSrc){
            document.getElementById("preverAvatarHeadImg").src = defaultHeadImg;
          }
        },
        cancel () {
            this.$emit("cancel");
        },
        contentClick () {

        },
        default () {

        }
    }
}
</script>
<style scoped>
    .el-row:after{
        content: '';
        display: table;
        clear: both;
    }
    .back{
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 9999;
    }
    .content{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 375px;
      height: 667px;
      background-size: 375px 667px;
      margin: 0 auto;
      background-image: url('../../../src/assets/back.png');
      padding: 55px 23px 39px 24px;
    }
    .teaMsg{
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 40px 15px;
      box-sizing: border-box;
    }
    .teaMsg .headImg{
      width: 90%;
    }
    .teaMsg .name{
      font-size: 22px;
      color: #000000;
      padding-right: 14px;
      background: url('../../../src/assets/index.png') no-repeat center right;
      background-size: auto auto;
      background-size: 11px 7px;;
    }
    .teaMsg .teaType{
      color: #666666;
      font-size:14px;
    }
    .teaMsg .labels{
      clear: both;
      overflow: hidden;
      margin-top: 18px;
      width: 100%;
    }
    .teaMsg .label-li{
      float: left;
      display: block;
      margin: 7.5px 7.5px 7.5px 0;
    }
    .teaMsg .label-li span{
      text-align: center;
      background-color: #ff6c78;
      padding: 5px 7.5px;
      color: #ffffff;
      font-size: 12px;
    }
    .otto{
      font-size: 14px;
      line-height: 19px;
      color: #262626;
      margin: 17.5px 20px;
    }
    .boundary{
      display: block;
      width: 260px;
      height: 1px;
      transform: scale(1,0.5);
      background: #cecece;
      margin-top: 19px;
      margin-left: auto;
      margin-right: auto;
    }
    .exprience{
      margin: 40px 12.5px 0 7.5px;
    }
    .exprience .title{
      float: left;
      width: 74px;
      color: #999999;
      font-size: 15px;
      margin-top: -8px;
    }
    .exprience .depict{
      position: relative;
      float: left;
      width: 185px;
      border-left: 1px solid #cecece;
      padding: 0 0 40px 17.5px;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
    }
    .exprience .depict span{
      margin-top: -8px;
      display: block;
    }
    .exprience .depict img{
      width: 48%;
      float: left;
      margin: 1%;
    }
    .exprience ul:last-child li:last-child{
      border-width: 0px;
    }
    .exprience .depict:after{
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #ff6c78;
      border-radius: 4px;
      position: absolute;
      top: 0px;
      left: -4px;
    }
    </style>
