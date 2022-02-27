<template>
<div id="teaPersonalInfo" class="basic-tab-item">
  <div v-if="!statueText">
    <div class="basic-tab-item-content">
      <el-row>
        <el-col :span="3">
          <img @click="loadHeadImg()" v-if="!!teaPersonalInfoData.headImageUrl" id="basecHeadAvatarImg" class="basic-message-logo" :src="teaPersonalInfoData.headImageUrl">
          <img @click="loadHeadImg()" v-else class="basic-message-logo" :src="defaultImg">
          <span class="previewBtn" @click="preView()">预览</span>
        </el-col>
        <el-col :span="21" class="basic-message-introduction">
          <el-form :inline="false" class="basic-message-form">
            <div v-if="teaPersonalInfoData.state == 2 || teaPersonalInfoData.state == 3" class="basic-message-audit-state">
              <div class="basic-message-audit-text">
                <div class="basic-message-audit-title">
                  {{getStateStr(teaPersonalInfoData.state)}}
                </div>
                <div class="basic-message-audit-description">
                  <span v-if="teaPersonalInfoData.state == 2 && !!teaPersonalInfoData.checkPassReason">
                        理由:{{teaPersonalInfoData.checkPassReason}}
                      </span>
                  <span v-if="teaPersonalInfoData.state == 3 && !!teaPersonalInfoData.checkUnPassReason">
                        理由:{{teaPersonalInfoData.checkUnPassReason}}
                      </span>
                </div>
              </div>
            </div>
            <div v-show="!!teaPersonalInfoData.userName" class="personal-wait-audit-panel">
              <span class="name">{{teaPersonalInfoData.userName}}</span>
              <span>{{teaPersonalInfoData.teaGoodSubject}}</span>
              <div v-if="teaPersonalInfoData.state == 1" class="wait-audit">
                待审核
              </div>
            </div>
            <el-form-item label="教育经历" v-if="teaPersonalInfoData.list && teaPersonalInfoData.list.length > 0">
              <div class="mes-content" v-for="(item,index) in teaPersonalInfoData.list" :key="index">
                {{!!item ? item.schoolname : ''}} {{!!item ? item.degree : ''}}
              </div>
            </el-form-item>
            <el-form-item label="高考经历" v-if="teaPersonalInfoData.ceeProvince && (teaPersonalInfoData.ceeSubjectFirst || teaPersonalInfoData.ceeSubjectSecond || teaPersonalInfoData.ceeSubjectThird)">
              <div v-if="teaPersonalInfoData.ceeProvince">
                高考省份-{{teaPersonalInfoData.ceeProvince}}
              </div>
              <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectFirst">
                {{teaPersonalInfoData.ceeSubjectFirst}}:{{teaPersonalInfoData.ceeSubjectFirstScore}}/{{teaPersonalInfoData.ceeSubjectFirstTotalScore }}
              </div>
              <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectSecond">
                {{teaPersonalInfoData.ceeSubjectSecond}}:{{teaPersonalInfoData.ceeSubjectSecondScore}}/{{teaPersonalInfoData.ceeSubjectSecondTotalScore }}
              </div>
              <div class="mes-content ceeSubject" v-if="teaPersonalInfoData.ceeSubjectThird">
                {{teaPersonalInfoData.ceeSubjectThird}}:{{teaPersonalInfoData.ceeSubjectThirdScore}}/{{teaPersonalInfoData.ceeSubjectThirdTotalScore }}
              </div>
            </el-form-item>
            <el-form-item label="兴趣爱好" v-if="teaPersonalInfoData.hobby">
              <div class="mes-content">{{teaPersonalInfoData.hobby}}</div>
            </el-form-item>
            <el-form-item label="　　教龄" v-if="teaPersonalInfoData.teachingAge || teaPersonalInfoData.teachingAge == 0">
              <div class="mes-content">{{teaPersonalInfoData.teachingAge|teachingAgeFilter}}</div>
            </el-form-item>
            <el-form-item label="教学经验" v-if="teaPersonalInfoData.teachingExperience">
              <div class="mes-content">{{teaPersonalInfoData.teachingExperience}}</div>
            </el-form-item>
            <el-form-item style="width:100%" label="获奖经历" v-if="teaPersonalInfoData.awardRecordFirstFile || teaPersonalInfoData.awardRecordSecondFile || teaPersonalInfoData.awardRecordThirdFile">
              <div class="awardPanel">
                <div class="award" v-if="teaPersonalInfoData.awardRecordFirstFile">
                  <div class="awardImg">
                    <img @click="previewImgWithPath(teaPersonalInfoData.awardRecordFirstFile)" :src="teaPersonalInfoData.awardRecordFirstFile" />
                  </div>
                  获奖竞赛级别:{{teaPersonalInfoData.awardRecordFirstCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordFirstSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordFirstLevel}}
                </div>
                <div class="award" v-if="teaPersonalInfoData.awardRecordSecondFile">
                  <div class="awardImg">
                    <img @click="previewImgWithPath(teaPersonalInfoData.awardRecordSecondFile)" :src="teaPersonalInfoData.awardRecordSecondFile" />
                  </div>
                  获奖竞赛级别:{{teaPersonalInfoData.awardRecordSecondCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordSecondSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordSecondLevel}}
                </div>
                <div class="award" v-if="teaPersonalInfoData.awardRecordThirdFile">
                  <div class="awardImg">
                    <img @click="previewImgWithPath(teaPersonalInfoData.awardRecordThirdFile)" :src="teaPersonalInfoData.awardRecordThirdFile" />
                  </div>
                  获奖竞赛级别:{{teaPersonalInfoData.awardRecordThirdCompetitionLevel}}，获奖科目:{{teaPersonalInfoData.awardRecordThirdSubject}}，获奖级别:{{teaPersonalInfoData.awardRecordThirdLevel}}
                </div>
              </div>
            </el-form-item>
            <el-form-item label="专业证书" v-if="teaPersonalInfoData.awardRecordEnglishLevel || teaPersonalInfoData.awardRecordToeflScore || teaPersonalInfoData.awardRecordIeltsScore || teaPersonalInfoData.certificateNum || teacherFilePath">
                <div class="mes-content">
                    <template v-if="teaPersonalInfoData.awardRecordEnglishLevel">
                        <p>英语：{{teaPersonalInfoData.awardRecordEnglishLevel}}</p>
                    </template>
                    <template v-if="teaPersonalInfoData.awardRecordToeflScore">
                        <p>托福：{{teaPersonalInfoData.awardRecordToeflScore}}</p>
                    </template>
                    <template v-if="teaPersonalInfoData.awardRecordIeltsScore">
                        <p>雅思：{{teaPersonalInfoData.awardRecordIeltsScore}}</p>
                    </template>
                    <ul>
                      <li>教师资格证（{{teaPersonalInfoData.certificateType | certificateTypeFilter}}
                        <span :style="{color: teaPersonalInfoData.certificateState === 2 ? '#007fff' : 'red'}">{{teaPersonalInfoData.certificateState | certificateStateFilter}}</span>）
                      </li>
                      <li>编号：{{teaPersonalInfoData.certificateNum}}</li>
                      <li>第一擅长科目：{{teaPersonalInfoData.teaGoodFirst}}</li>
                      <li>类型：{{teaPersonalInfoData.certificateNum | certificateClassFilter}}</li>
                      <li>颁发年份：{{teaPersonalInfoData.certificateNum | certificateYearFilter}}</li>
                      <li v-if="teacherFilePath">准考证照片：
                        <div class="awardImg">
                          <img @click="preview(teacherFilePath)" :src="teacherFilePath" />
                        </div>
                      </li>
                    </ul>
                </div>
            </el-form-item>
            <el-form-item label="提分心得" v-if="teaPersonalInfoData.teachingNotes">
              <div class="mes-content">{{teaPersonalInfoData.teachingNotes}}</div>
            </el-form-item>
            <el-form-item label="教学风格" v-if="teaPersonalInfoData.teachingStyle">
              <div class="mes-content">{{teaPersonalInfoData.teachingStyle}}</div>
            </el-form-item>
            <el-form-item label="个人介绍" v-if="teaPersonalInfoData.teaIntro">
              <div class="mes-content">{{teaPersonalInfoData.teaIntro}}</div>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="basic-tab-item-control">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm" type="primary">审核</el-button>
    </div>
  </div>
  <div v-else class="basicinfo-no-data">
    {{statueText}}
  </div>

  <input style="display:none;" @change="selectHeadImg()" type="file" id="headImgFile">
</div>
</template>
<script>
import getTeaPersonalInfo from './API/getTeaPersonalInfo';
import loadFile from './API/loadFile';
let defaultImg = require('./assets/image/default.jpg');
import setHeadImageUrl from './API/setHeadImageUrl';

import teacherCertificateMixin from '../../../zm-platform/pages/userInfoItems/teacherCertificateMixin'

export default {
  mixins: [teacherCertificateMixin],
  data() {
    return {
      teaPersonalInfoData: {},
      defaultImg:defaultImg,
      API:{
        getTeaPersonalInfo:null,
        setHeadImageUrl:null
      },
      statueText:"正在加载..."
    }
  },
  mounted: function() {
    this.spiSetting();
    this.getData()
  },
  props: [
    'tea-id',
    'bu',
    'introduce-info-perssion',//获取个人介绍(权限)
    'get-tea-personal-info',//获取个人介绍
    'set-head-image-url'//修改个人头像
  ],
  filters: {
    teachingAgeFilter(val) {
      if (!val) {
        return val == 0 ? '0年' : '';
      } else {
        return val == 10 ? '10年及以上' : val + '年';
      }
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel")
    },
    confirm() {
      this.$emit("audit",this.teaPersonalInfoData.state)
    },
    loadHeadImg(){
      if(this.bu == "3"){
        document.getElementById("headImgFile").click();
      }
    },
    selectHeadImg(){
      let imgFile = document.getElementById("headImgFile");
      let isImgFile = this.isImgFile(imgFile.value);
      if(isImgFile){
        this.$MessageBox.confirm(`确定要修改头像吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.loadFile(imgFile);
        }).catch(message => {
          if(message == "cancel"){
            imgFile.value = "";
          }
        });
      }else{
        this.$Message({
          message: '请选择图片格式文件'
        });
      }
    },
    isImgFile(file){
      let extension = file.substring(file.lastIndexOf(".")+1)
      let imgExtense = ["png","jpg","jpeg","bmp"];
      if(imgExtense.indexOf(extension) != -1){
        return true;
      }
      return false;
    },
    loadFile(file){
      loadFile({ID:"headImgFile"}).then(data => {
        this.teaPersonalInfoData.headImageUrl = data[0];
        this.changeTeaHead(data[0]);
      }).catch(message => {
        console.log("上传文件异常:",message)
      });
    },
    changeTeaHead(headUrl){
      let parm = {
        teaId:this.teaId,
        headImageUrl:headUrl
      }
      this.API.setHeadImageUrl(parm).then(data => {
        this.$Message({
          message: '修改成功'
        });
      }).catch(message => {
        this.$Message({
          message
        });
      })
    },
    loadDefaultImg(e) {
      window.setTimeout(() => {
        let basecHeadAvatarImg = document.getElementById("basecHeadAvatarImg");
        if (!!basecHeadAvatarImg) {
          basecHeadAvatarImg.src = defaultImg;
        }
      }, 100)
    },
    getData() {
      if(!this.introduceInfoPerssion){
        this.statueText = "您暂时没有权限获取个人介绍数据"
        return;
      }
      this.$BMloading("teaPersonalInfo")
      this.statueText = ""
      this.API.getTeaPersonalInfo({
        teaId: this.teaId
      }).then(data => {
        this.teaPersonalInfoData = data;
        this.$BMloadingFinish("teaPersonalInfo")
      }).catch(message => {
        this.statueText = "暂无数据"
        this.teaPersonalInfoData = {};
        this.$BMloadingFinish("teaPersonalInfo")
        console.log("getTeaPersonalInfo异常:", message);
      });
    },
    spiSetting(){
      if(!!this.getTeaPersonalInfo){
        this.API.getTeaPersonalInfo = this.getTeaPersonalInfo;
      }else{
        this.API.getTeaPersonalInfo = getTeaPersonalInfo;
      }
      if(!!this.setHeadImageUrl){
        this.API.setHeadImageUrl = this.setHeadImageUrl;
      }else{
        this.API.setHeadImageUrl = setHeadImageUrl;
      }
    },
    saveData() {

    },
    preView() {
      this.$emit("preview", this.teaPersonalInfoData);
    },
    preview (path) {
      this.$root.$children[0].showBigImg(path);
    },
    getStateStr(val) {
      if (val == "0") {
        return "未提交";
      }
      if (val == "1") {
        return "待审核";
      }
      if (val == "2") {
        return "审核通过";
      }
      if (val == "3") {
        return "审核未通过";
      }
    },
  }
}
</script>
<style scoped media="screen">
  .previewBtn{
    display: block;
    cursor: pointer;
    font-size: 12px;
  }
  .basic-message-logo{
    max-width: 80%;
    max-height: 100%;
    margin-bottom: 6px;
  }
  .basic-message-introduction .el-row{
      padding: 5px 0;
  }
  .basic-message-introduction .el-row:after{
      display: table;
      content: '';
      clear: both;
  }
  .basic-message-introduction .search-form{
    padding-top: 0px;
  }
  .personal-wait-audit-panel{
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    position:relative;
  }
  .personal-wait-audit-panel .name{
    font-size: 20px;
    display: block;
    color: #333;
  }
  .personal-wait-audit-panel .wait-audit{
    position: absolute;
    right:0;
    top:50%;
    transform: translateY(-50%);
    background-color: rgba(22, 155, 213, 1);
    color: white;
    padding: 5px 20px;
    font-size: 14px;
    border-width: 0px;
  }
  .mes-content{
    font-size: 12px;
    line-height: 34px;
    margin-top: 2px;
  }
  .awardPanel{
    padding-left: 70px;
  }
  .awardPanel .award{
    padding-top: 10px;
  }

  .awardImg{
    width: 80px;
    height: 80px;
    display: inline-block;
    background-color: #c2c2c2;
    position: relative;
    vertical-align: middle;
    margin-right: 10px;
    cursor: pointer;
  }
  .awardImg img{
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  /* .el-button{
    padding: 0 20px;
  } */
</style>
