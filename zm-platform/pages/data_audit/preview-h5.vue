<template>
    <div class="resume-back" @click="cancel">
      <div class="resume" @click.stop>
        <div>
          <el-radio-group class="h5-tab-radio" v-model="previewH5Tab" @change="h5TabChange">
            <el-radio-button label="new">个人介绍（新版）</el-radio-button>
            <el-radio-button label="old" v-if="h5RowData.oldNewVal === 'newold'">个人介绍（旧版）</el-radio-button>
          </el-radio-group>
          <div class="close-previewh5" @click="closePreviewH5Dialog">
            <i class="el-dialog__close el-icon el-icon-close "></i>
          </div>
        </div>
        <div class="resume-scroll">
          <div class="resume-user-info">
              <div class="resume-logo"></div>
              <div class="resume-user">
                  <div class="user-img">
                      <img :src="teaMsg.headImageUrl || defaultHeadImg" />
                  </div>
                  <div class="other-info">
                      <template>
                          <p class="name">{{teaMsg.name}}老师</p>
                          <p class="teaType">授课老师</p>
                          <p class="style-line" v-if="teaMsg.teachingSytle">
                              <span class="style-item" v-for="(item, index) in teaMsg.teachingSytle" :key="index">{{item}}</span>
                          </p>
                      </template>
                      <!--<template v-if="teaMsg.teaBu == 2">
                          <p class="name">{{teaMsg.userName}}<span class="nick-name">{{teaMsg.nickName}}老师</span></p>
                      </template> -->
                  </div>
              </div>
          </div>
          <div class="resume-other-infos">
              <div class="resume-other-item" v-if="teaMsg.teaVideoUrl && teaMsg.teaVideoUrl.length">
                  <p class="other-item-title">
                      <span>视频介绍</span>
                  </p>
                  <div class="showVideo">
                      <video width="240" height="165" controls autoplay controlsList="nodownload">
                          <source :src="teaMsg.teaVideoUrl[0].ossPath" type="video/mp4">
                      </video>
                  </div>
                  <i class="other-info-pic video"></i>
              </div>
              <!-- <div class="resume-other-item" v-if="teaMsg.ceeInfo && teaMsg.ceeInfo.length > 0">
                  <p class="other-item-title">
                      <span>高考经历</span>
                  </p>
                  <div class="other-item-content">
                      <p>高考省份：{{teaMsg.ceeProvince}}</p>
                      <p style="display: flex;">
                          <span>高考成绩：</span>
                          <span style="flex: 1;">
                              <template v-for="(item, index) in teaMsg.ceeInfo">
                                  {{item}} <br :key="index"/>
                              </template>
                          </span>
                      </p>
                  </div>
                  <i class="other-info-pic jxln"></i>
              </div> -->
              <div class="resume-other-item" v-if="teaMsg.hobby">
                  <p class="other-item-title">
                      <span>兴趣爱好</span>
                  </p>
                  <p class="other-item-content">{{teaMsg.hobby}}</p>
                  <i class="other-info-pic jxjy"></i>
              </div>
              <div class="resume-other-item" v-if="teaMsg.teachingExperience">
                  <p class="other-item-title">
                      <span>教学经验</span>
                  </p>
                  <p class="other-item-content">{{teaMsg.teachingExperience}}</p>
                  <i class="other-info-pic jxjy"></i>
              </div>
              <div class="resume-other-item" v-if="teaMsg.awardRecordInfo && teaMsg.awardRecordInfo.length >0 ">
                  <p class="other-item-title">
                      <span>获奖经历</span>
                  </p>
                  <p class="other-item-content">
                      <template v-for="(item, index) in teaMsg.awardRecordInfo">
                          {{item}} <br :key="index"/>
                      </template>
                  </p>
                  <i class="other-info-pic jxfc"></i>
              </div>
              <div class="resume-other-item" v-if="teaData && (teaData.awardRecordEnglishLevel || teaData.awardRecordToeflScore || teaData.awardRecordIeltsScore)">
                  <p class="other-item-title">
                      <span>专业证书</span>
                  </p>
                  <p class="other-item-content">
                      <template v-if="teaData.awardRecordEnglishLevel">
                          英语：{{teaData.awardRecordEnglishLevel}} <br />
                      </template>
                      <template v-if="teaData.awardRecordToeflScore">
                          托福：{{teaData.awardRecordToeflScore}}分<br />
                      </template>
                      <template v-if="teaData.awardRecordIeltsScore">
                          雅思：{{teaData.awardRecordIeltsScore}}分
                      </template>
                  </p>
                  <i class="other-info-pic jxjy"></i>
              </div>
              <div class="resume-other-item" v-if="teaMsg.teachingNotes">
                  <p class="other-item-title">
                      <span>提分心得</span>
                  </p>
                  <p class="other-item-content">{{teaMsg.teachingNotes}}</p>
                  <i class="other-info-pic jxts"></i>
              </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
let defaultHeadImg = require('../../../src/assets/default.jpg');
import getPreviewH5DataNew from '../../api/select/getPreviewH5DataNew'; // 获取的预览H5 页面数据
import getTeaPersonalInfo from '../../api/select/getTeaPersonalInfo'; // 获取的预览H5 页面数据
export default {
    name: 'persenal_preview',
    data() {
        return {
            defaultHeadImg,
            previewH5Tab: 'new', // 切换tab
            teaData: {}, // 当前老师信息
            teaMsg:{
                headImageUrl: null, //头像
                name: "", //姓名
                teachingSytle: null, //教学风格
                personalIntroduce: "", //个人介绍
                schoolInfo: "", //最高学历
                // ceeInfo: null, //高考成绩概况
                ceeProvince: "", //高考城市
                teachingExperience: '', //教学经验
                honors: '', // 奖项荣誉
                selfEvaluate: '', // 自我评价
                teachingNotes: "", //教学心得
                awardRecordInfo: null, //获奖经历
                awardRecordInfoImg: [], //获奖经历
                hobby: "", //兴趣爱好
                gradeCase: "", //优秀案例
                teaBu: "" //老师bu
            }
        };
    },
    props: ['h5RowData', 'teaId'],
    mounted() {
        this.previewH5Tab = 'new';
      // 初始化个人介绍h5 预览 新版页面
      this.showData();
    },
    watch: {
        // teaData: function(data) {
        //     Object.assign(this.teaMsg, data);
        //     this.teaMsg.teachingSytle = this.teaMsg.teachingSytle.split(',');
        //     this.teaMsg.ceeProvince = data.ceeProvince;
        //     let ceeInfo = [];
        //     if (data.ceeSubjectFirst && data.ceeSubjectFirstScore) {
        //         ceeInfo.push(data.ceeSubjectFirst + ':' + data.ceeSubjectFirstScore + '/' + data.ceeSubjectFirstTotalScore);
        //     }
        //     if (data.ceeSubjectSecond && data.ceeSubjectSecondScore) {
        //         ceeInfo.push(data.ceeSubjectSecond + ':' + data.ceeSubjectSecondScore + '/' + data.ceeSubjectSecondTotalScore);
        //     }
        //     if (data.ceeSubjectThird && data.ceeSubjectThirdScore) {
        //         ceeInfo.push(data.ceeSubjectThird + ':' + data.ceeSubjectThirdScore + '/' + data.ceeSubjectThirdTotalScore);
        //     }
        //     this.teaMsg.ceeInfo = ceeInfo;
        //     let awardRecordInfo = [];
        //     if(!!data.awardRecordFirstCompetitionLevel && !!data.awardRecordFirstSubject && !!data.awardRecordFirstLevel){
        //         awardRecordInfo.push("曾获" + data.awardRecordFirstCompetitionLevel + data.awardRecordFirstSubject + "竞赛" + data.awardRecordFirstLevel + "等奖");
        //     }
        //     if(!!data.awardRecordSecondCompetitionLevel && !!data.awardRecordSecondSubject && !!data.awardRecordSecondLevel){
        //         awardRecordInfo.push("曾获" + data.awardRecordSecondCompetitionLevel + data.awardRecordSecondSubject + "竞赛" + data.awardRecordSecondLevel + "等奖");
        //     }
        //     if(!!data.awardRecordThirdCompetitionLevel && !!data.awardRecordThirdSubject && !!data.awardRecordThirdLevel){
        //         awardRecordInfo.push("曾获" + data.awardRecordThirdCompetitionLevel + data.awardRecordThirdSubject + "竞赛" + data.awardRecordThirdLevel + "等奖");
        //     }
        //     this.teaMsg.awardRecordInfo = awardRecordInfo;
        // }
    },
    methods: {
      // 关闭预览1对1 页面弹窗
      closePreviewH5Dialog() {
        this.$emit('cancel');
      },
      cancel() {
        this.$emit('cancel');
      },
      initData(data) {
        this.teaMsg = {};
        Object.assign(this.teaMsg, data);
        this.teaMsg.name = this.h5RowData.isRealName;
        this.teaMsg.teachingSytle = this.teaMsg.teachingSytle ? this.teaMsg.teachingSytle.split(',') : [];
        this.teaMsg.teaVideoUrl = this.teaMsg.teacherFiles &&
        this.teaMsg.teacherFiles.length &&
        this.teaMsg.teacherFiles[0].ossPath &&
        this.teaMsg.teacherFiles[0].ossPath.indexOf('.mp4') > -1 ? this.teaMsg.teacherFiles : [];
        // 暂时没有高考经历 模块
        // var ceeInfo = [];
        // if (this.teaData.ceeSubjectFirst && this.teaData.ceeSubjectFirstScore) {
        //     ceeInfo.push(this.teaData.ceeSubjectFirst + ':' + this.teaData.ceeSubjectFirstScore + '/' + this.teaData.ceeSubjectFirstTotalScore);
        // }
        // if (this.teaData.ceeSubjectSecond && this.teaData.ceeSubjectSecondScore) {
        //     ceeInfo.push(this.teaData.ceeSubjectSecond + ':' + this.teaData.ceeSubjectSecondScore + '/' + this.teaData.ceeSubjectSecondTotalScore);
        // }
        // if (this.teaData.ceeSubjectThird && this.teaData.ceeSubjectThirdScore) {
        //     ceeInfo.push(this.teaData.ceeSubjectThird + ':' + this.teaData.ceeSubjectThirdScore + '/' + this.teaData.ceeSubjectThirdTotalScore);
        // }
        // this.teaMsg.ceeInfo = ceeInfo;
        var awardRecordInfo = [];
        if (!!this.teaData.awardRecordFirstCompetitionLevel && !!this.teaData.awardRecordFirstSubject && !!this.teaData.awardRecordFirstLevel) {
            awardRecordInfo.push("曾获" + this.teaData.awardRecordFirstCompetitionLevel + this.teaData.awardRecordFirstSubject + "竞赛" + this.teaData.awardRecordFirstLevel + "等奖");
        }
        if (!!this.teaData.awardRecordSecondCompetitionLevel && !!this.teaData.awardRecordSecondSubject && !!this.teaData.awardRecordSecondLevel) {
            awardRecordInfo.push("曾获" + this.teaData.awardRecordSecondCompetitionLevel + this.teaData.awardRecordSecondSubject + "竞赛" + this.teaData.awardRecordSecondLevel + "等奖");
        }
        if (!!this.teaData.awardRecordThirdCompetitionLevel && !!this.teaData.awardRecordThirdSubject && !!this.teaData.awardRecordThirdLevel) {
            awardRecordInfo.push("曾获" + this.teaData.awardRecordThirdCompetitionLevel + this.teaData.awardRecordThirdSubject + "竞赛" + this.teaData.awardRecordThirdLevel + "等奖");
        }
        this.teaMsg.awardRecordInfo = awardRecordInfo;
      },
      // 初始化个人介绍h5 预览 新版页面
      showData(data) {
        this.getPreviewH5DataNew();
      },
      // 预览h5 调用新接口
      getPreviewH5DataNew() {
        getPreviewH5DataNew({
          teaId: this.teaId
        })
        .then(res => {
          this.teaData = res;
          this.initData(this.teaData);
        });
      },
      // 预览h5 调用老接口
      getPreviewH5DataOld() {
        getTeaPersonalInfo({
          teaId: this.teaId
        })
        .then(res => {
          this.teaData = res;
          this.teaData.teacherFiles = res.teaVideoUrl ? [{
            ossPath: res.teaVideoUrl
          }] : [];
          this.initData(this.teaData);
        });
      },
      // 切换预览h5的新版旧版页面
      h5TabChange(val) {
        // this.previewH5Tab = val;
        if (val === 'new') {
          this.getPreviewH5DataNew();
        } else if(val === 'old') {
          this.getPreviewH5DataOld();
        }
      }
    }
}
</script>

<style lang="less" scoped>
  video::-internal-media-controls-download-button {
    display:none;
  }
  video::-webkit-media-controls-enclosure {
    overflow:hidden;
  }
  video::-webkit-media-controls-panel {
    width: calc(100% + 30px);
  }
.showVideo {
  width: 100%;
  height: 165px;
  margin-bottom: 10px;
}
.showVideo video{
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.resume-back {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 9999;
  .resume {
    height: 80vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fafafa;
    .resume-user-info {
      width: 375px;
      height: 270px;
      padding-top: 28px;
      background: url('../../../src/assets/resume_top@2x.png') left top / 378px 271px no-repeat;
      .resume-logo {
        width: 76px;
        height: 20px;
        margin: 0 auto;
        background: url('../../../src/assets/logo@2x.png') center/contain;
      }
      .resume-user {
        margin-top: 32px;
        margin-left: 22px;
        display: flex;
        .user-img {
            width: 87px;
            height: 108px;
            border: 4px solid #fff;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .other-info {
            flex: 1;
            margin-left: 14px;
            .name {
                font-size: 22px;
                line-height: 30px;
                color: #fff;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .nick-name {
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 400;
                    margin-left: 10px;
                    display: inline-block;
                }
            }
            .teaType {
                font-size: 12px;
                line-height: 17px;
                color: #fff;
                margin-top: 10px;
            }
            .style-line {
                margin-top: 12px;
                &::after {
                    content: '';
                    display: block;
                    clear: both;
                    height: 0;
                }
                .style-item {
                    float: left;
                    margin-right: 8px;
                    padding: 2px 8px;
                    background: linear-gradient(180deg,rgba(255,251,251,1) 0%,rgba(255,227,227,1) 100%);
                    border-radius: 12px;
                    font-size: 12px;
                    line-height: 17px;
                    color: #ED1E1E;
                }
            }
        }
      }
    }
    .resume-other-infos {
        padding-bottom: 34px;
        .resume-other-item {
            width: 345px;
            margin: 0 auto 25px;
            padding: 20px 18px 40px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 4px 10px 0px rgba(73, 56, 56, 0.07);
            position: relative;
            .other-info-pic {
                position: absolute;
                right: 10px;
                bottom: 0;
                width: 82px;
                height: 50px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: contain;
                &.jxjy {
                    background-image: url(../../../src/assets/jingyan_icon.png);
                }
                &.jxts {
                    background-image: url(../../../src/assets/xinde_icon.png);
                }
                &.jxln {
                    background-image: url(../../../src/assets/gaokao_icon.png);
                }
                &.jxfc {
                    background-image: url(../../../src/assets/huojiang_icon.png);
                }
                &.video {
                    background-image: url(../../../src/assets/video.jpg);
                }
            }
            .other-item-title {
                font-size: 16px;
                line-height: 22px;
                color: #000;
                font-weight: 500;
                span {
                    display: inline-block;
                    padding: 0 6px 0 2px;
                    position: relative;
                    &::after {
                        position: absolute;
                        content: '';
                        left: 0;
                        bottom: 0;
                        right: 0;
                        height: 7px;
                        background: #FF4545;
                        opacity: 0.3;
                    }
                }
            }
            .other-item-content {
                margin-top: 20px;
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
  }
}
.resume-scroll {
  overflow: auto;
  height: 70vh;
}

</style>
<style lang="less">
.h5-tab-radio {
  margin-bottom: 0;
  .el-radio-button__inner {
    border-radius: 0 !important;
  }
}
.close-previewh5 {
  position: relative;
  width: 25px;
  height: 25px;
  cursor: pointer;
  float: right;
  top: 7px;
  right: 4px;
  text-align: center;
  line-height: 24px;
}
</style>
