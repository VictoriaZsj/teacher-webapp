<template>
  <div>
    <div class="personalIntroduce" >
      <div class="checkState">
        <el-table :data="rowData" border  style="width:100%">
          <el-table-column prop="isRealName" align="center" label="姓名" width="80">
          </el-table-column>
          <el-table-column prop="teaBu" align="center" label="所属BU" width="80" >
            <template scope="scope">
              {{scope.row.teaBu === '1' ? '1对1' : scope.row.teaBu === '2' ? '少儿' :  scope.row.teaBu === '5'?'优课':'陪练' }}
            </template>
          </el-table-column>
          <el-table-column prop="timeType" align="center" label="老师性质" width="80" >
            <template scope="scope">
              {{scope.row.timeType | timeTypeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="periodState" align="center" label="老师阶段" width="80" >
            <template scope="scope">
              {{scope.row.periodState | periodFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="toBeAudit" align="center" label="待审内容" >
          </el-table-column>
          <el-table-column prop="grade" align="center" label="年级" width="100" >
          </el-table-column>
          <el-table-column prop="subject" align="center" label="科目" width="100" >
          </el-table-column>
          <el-table-column prop="submitTime" align="center" label="提交时间" width="120" >
          </el-table-column>
          <el-table-column prop="lastAuditResult" align="center" label="上次审核结果" width="80" >
          </el-table-column>
        </el-table>
      </div>
      <div class="section">
        <el-row>
          <el-col :span="11">
            <div class="left">
              <div  class="audit-state">
                <div class="audit-text">
                  <span class="audit-title">
                    {{getChinaIdStateStr(chinaidState)}}
                  </span>
                  <template v-if="chinaidState === '1'">
                    <span class="chinaid-content">身份证号：{{chinaIdContent}}</span>
                    <span class="show-chinaid" @click="showChinaidContent">{{showChinaidVal}}</span>
                  </template>
                </div>
              </div>

              <div class="picVideo">
                <div>
                  <span class="personalPic">个人头像</span>
                  <img :src="introduceShowObj.headImageUrl ? introduceShowObj.headImageUrl : defaultImage" @click="handleShowImage(introduceShowObj.headImageUrl)">
                </div>
                <div class="videoContainer">
                  <span class="videoIntro">视频介绍</span>
                  <div class="videoPlayer" @click="viewVedio('10')">
                    <img :src="playerImage">
                  </div>
                </div>
                <div class="videoContainer" v-if="bu === '2'">
                  <span class="videoIntro">精彩课堂</span>
                  <div class="videoPlayer" @click="viewVedio('13')">
                    <img :src="playerImage">
                  </div>
                </div>
              </div>
              <div class="infoDetail" v-if="bu == '1'||bu == '5'">
                <div>
                  <span class="title">兴趣爱好</span>
                  <span class="contentSub">{{introduceShowObj.hobby}}</span>
                </div>
                <div>
                  <span class="title">　　教龄</span>
                  <span class="contentSub">{{introduceShowObj.teachingAge|teachingAgeFilter}}</span>
                </div>
                <div>
                  <span class="title">教学经验</span>
                  <span class="contentSub">{{introduceShowObj.teachingExperience}}</span>
                </div>
                <div>
                  <span class="title">提分心得</span>
                  <span class="contentSub">{{introduceShowObj.teachingNotes}}</span>
                </div>
                <div>
                  <span class="title">优秀案例</span>
                  <span class="contentSub">
                    <div class="contentSub">
                      {{`曾帮助班级排名 ${introduceShowObj.caseWeakStudentCount ? introduceShowObj.caseWeakStudentCount : ''}
                      名的学生在 ${introduceShowObj.caseWeakStudentMonth ? introduceShowObj.caseWeakStudentMonth : ''}
                      个月内，提分 ${introduceShowObj.caseWeakStudentImproveScore ? introduceShowObj.caseWeakStudentImproveScore : ''}
                      分`}}
                    </div>
                    <div class="contentSub">
                      {{`曾帮助班级排名 ${introduceShowObj.caseGeneralStudentCount ? introduceShowObj.caseGeneralStudentCount : ''}
                      名的学生在${introduceShowObj.caseGeneralStudentMonth ? introduceShowObj.caseGeneralStudentMonth : ''}个月内，提分${introduceShowObj.caseGeneralStudentImproveScore ? introduceShowObj.caseGeneralStudentImproveScore : ''}
                      分，最终考至 ${introduceShowObj.caseGeneralStudentDestination ? introduceShowObj.caseGeneralStudentDestination : ''}`}}
                    </div>
                    <div class="contentSub">
                      {{`曾帮助学生在 ${introduceShowObj.caseExcellentStudentMonth ? introduceShowObj.caseExcellentStudentMonth : ''}
                      个月内，提分 ${introduceShowObj.caseExcellentStudentImproveScore ? introduceShowObj.caseExcellentStudentImproveScore : ''} 分，最终以
                      ${introduceShowObj.caseExcellentStudentScore ? introduceShowObj.caseExcellentStudentScore : ''} 分/满分
                      ${introduceShowObj.caseExcellentStudentTotalScore ? introduceShowObj.caseExcellentStudentTotalScore : ''}，考至
                      ${introduceShowObj.caseExcellentStudentDestination ? introduceShowObj.caseExcellentStudentDestination : ''}`}}
                    </div>
                  </span>
                </div>
                <div>
                  <span class="title">客户评价</span>
                  <span class="contentSub">{{ introduceShowObj.customerEvaluation ? introduceShowObj.customerEvaluation : '' }}</span>
                </div>
                <div>
                  <span class="title">证书奖励</span>
                  <span class="contentSub">{{introduceShowObj.awardRecordEnglishLevel ? introduceShowObj.awardRecordEnglishLevel : ''}}</span>
                </div>
                <!-- <div class="certificateDetail">
                  <span>获得xxx证书</span>
                  <span>获得xxx证书</span>
                </div> -->
              </div>
              <div class="infoDetail" v-if="bu == '2'">
                <div>
                  <span class="title">　　教龄</span>
                  <span class="contentSub">{{introduceShowObj.teachingAge|teachingAgeFilter}}</span>
                </div>
                <div>
                  <span class="title">自我介绍</span>
                  <span class="contentSub">{{introduceShowObj.teachingExperience ? introduceShowObj.teachingExperience : ''}}</span>
                </div>
                <div>
                  <span class="title">教学特色</span>
                  <span class="contentSub">{{introduceShowObj.teachFeature ? introduceShowObj.teachFeature : ''}}</span>
                </div>
                <div>
                  <span class="title">教学理念</span>
                  <span class="contentSub">{{introduceShowObj.teachIdea ? introduceShowObj.teachIdea : ''}}</span>
                </div>
                <div>
                  <span class="title">教师风采</span>
                </div>
                <div class="certificatePic">
                    <img :src="item" v-for="(item, index) in getTeachingUrl" :key="index" @click="handleShowImage(item)">
                    <!-- <img :src="defaultImage" v-else> -->
                  </div>
              </div>
              <div class="infoDetail" v-if="bu == '3'">
                <div>
                  <span class="title">　　教龄</span>
                  <span class="contentSub">{{introduceShowObj.teachingAge|teachingAgeFilter}}</span>
                </div>
                <div>
                  <span class="title">教学经验</span>
                  <span class="contentSub">{{introduceShowObj.teachingExperience ? introduceShowObj.teachingExperience : ''}}</span>
                </div>
                <div>
                  <span class="title">自我评价</span>
                  <span class="contentSub">{{introduceShowObj.selfEvaluate ? introduceShowObj.selfEvaluate : ''}}</span>
                </div>
                <div>
                  <span class="title">奖项荣誉</span>
                  <span class="contentSub">{{introduceShowObj.honors ? introduceShowObj.honors : ''}}</span>
                </div>
                <div>
                  <span class="title">获奖证书</span>
                </div>
                <div class="certificatePic">
                  <img :src="item" v-for="(item, index) in getAwardUrl" :key="index" @click="handleShowImage(item)">
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="middle">
              <div class="middleDivider"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="right">
              <div class="teachingDiploma" v-if="bu != '3'">
                <div class="titleDiploma">教师资格证</div>
                <div class="contentDiploma">
                  <div class="detailDiploma">
                    <span class="leftRow">教师资格证：{{introduceShowObj.certificateType | certificateTypeFilter }}</span>
                    <br>
                    <span class="rightRow" v-if="introduceShowObj.certificateType === 2||introduceShowObj.certificateType === 4||introduceShowObj.certificateType === 5">编号：{{introduceShowObj.certificateNum}}</span>
                    <span class="leftRow" v-if="hasCertificateImg">教资学科：{{subject}}</span>
                    <span class="rightRow" v-if="introduceShowObj.certificateType === 2||introduceShowObj.certificateType === 4||introduceShowObj.certificateType === 5">类型：{{introduceShowObj.certificateNum | certificateClassFilter }}</span>
                    <span class="leftRow" v-if="introduceShowObj.certificateType === 2||introduceShowObj.certificateType === 4||introduceShowObj.certificateType === 5">颁发年份：{{introduceShowObj.certificateNum | certificateYearFilter}}</span>
                  </div>
                  <div class="piclDiploma" >
                    <span v-if="hasCertificateImg">{{introduceShowObj.certificateType | certificateTypefilterImg}}</span>
                    <div class="picList">
                      <img :src="item" v-for="(item, index) in getUrl" :key="index" @click="handleShowImage(item)">

                    </div>
                  </div>
                </div>
                <div class="teacherLabel">
                  <div>老师标签</div>
                  <span>教学风格：{{ introduceShowObj.teachingStyle }}</span>
                </div>
              </div>
              <div class="teachingDiploma" v-if="bu == '3'">
                <div class="contentDiploma">
                  <div class="piclDiploma">
                    <span class="IDCardPic">身份证（正/反面）</span>
                    <div class="picList">
                      <img :src="item" v-for="(item, index) in getIdcardUrl" :key="index" @click="handleShowImage(item)">
                    </div>
                  </div>
                </div>
                <!-- <div class="teacherLabel">
                  <div>老师标签</div>
                  <span>{{introduceShowObj.teaching_style}}</span>
                </div> -->
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="footerContainer">
        <p class="footerTitle">
          近期审核记录
        </p>
        <el-table :data="reviewList" border  style="width:100%">
          <el-table-column prop="createdAt" align="center" label="审核时间" width="150">
          </el-table-column>
          <el-table-column prop="reviewer" align="center" label="审核人" width="100" >
          </el-table-column>
          <el-table-column prop="periodStateStr" align="center" label="所属阶段" width="100" >
          </el-table-column>
          <el-table-column prop="toBeAudit" align="center" label="待审内容" width="200" >
          </el-table-column>
          <el-table-column prop="checkStateStr" align="center" label="操作结果" width="120" >
          </el-table-column>
          <el-table-column prop="reviewMark" align="center" label="备注" >
          </el-table-column>
        </el-table>
        <div class="show-more-review" @click="showMoreReview" v-if="showMoreFlg">查看更多</div>
        <div class="line"></div>

        <div class="auditResult">
          <div class="auditForm">
            <el-form :model="auditForm" :rules="rules" ref="auditForm" label-width="100px">
              <el-form-item label="审核结果" prop="state">
                <el-radio-group v-model="auditForm.state" @change="handleChange">
                  <el-radio label="2">通过</el-radio>
                  <el-radio label="3">拒绝</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审核备注" prop="desc">
                <el-input type="textarea" v-model="auditForm.desc" :placeholder="placeholder"></el-input>
              </el-form-item>
              <!-- <el-form-item class="btnGroup">
                <el-button class="btnCancle" @click="resetForm('auditForm')">取消</el-button>
                <el-button class="btnConfirm" type="primary" @click="handleClickAudit('auditForm')">确定</el-button>
              </el-form-item> -->
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="viewVedioDialog" class="fixedVedio">
        <div class="sameParent">
          <div class="title"><i class="el-icon-close" @click="handleClose"></i></div>
          <div class="contentParentsVideo">
            <video controls autoplay controlsList="nodownload">
              <source :src="videoUrl" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
      <preview-img :show="previewState" @close="closePreview" :imgPath="imgPath"></preview-img>
    </div>
  </div>
</template>

<script>
  import getIntroduceSnapshot from '../../../api/select/getIntroduceSnapshot'
  import reviewTeaPersonalInfo from '../../../api/action/reviewTeaPersonalInfo'
  import getReviewList from '../../../api/select/getReviewList'
  import filterMixin from '../../data_audit/filterMixin'
  import previewImg from '../preview_img'
  import basicInfo from '../../../api/select/basicInfo'; // 获取身份证信息
  import fetch from '../../../../src/utils/fetch.js';
  import certificate_subject from './certificate_subject.js'

  export default {
    mixins: [filterMixin],
    data() {
      var checkAuditMark = (rule, value, callback) => {
        if (this.auditForm.state === '3' && !value){
          callback(new Error('请填写备注'))
        }
        else{
          callback()
        }
      }
      return {
        defaultImage: require('@/images/default.jpg'),
        playerImage: require('@/images/player.png'),
        introduceShowObj: {},
        auditForm: {
          state: '2',
          desc: ''
        },
        isRequired: false,
        rules: {
          desc: [
            { validator: checkAuditMark, trigger: 'blur' }
          ]
        },
        placeholder: '请填写备注（选填）',
        viewVedioDialog: false,
        videoUrl: '',
        teaVideoUrl: '',
        reviewList: [], // 近期审核记录初始化
        reviewListALL: [], // 近期审核记录所有记录
        showMoreFlg: true, // 显示查看更多按钮
        statueText: '正在加载...',
        previewState: false,
        imgPath: '',
        showChinaidVal: '显示', // 显示，隐藏身份证信息flg
        chinaIdContent: '******************', // 身份证信息
        chinaidState: '', // 身份证实名认证flg
        subject:'',
        teaSubjectOptions:[]
      }
    },
    props: [
      'teaId',
      'bu',
      'auth',
      'rowData'
    ],
    computed:{
        hasCertificateImg(){
          return (
            this.introduceShowObj.certificateType === 8||this.introduceShowObj.certificateType === 10||
            this.introduceShowObj.certificateType === 9||this.introduceShowObj.certificateType === 11||
            this.introduceShowObj.certificateType === 6||this.introduceShowObj.certificateType === 7||
            this.introduceShowObj.certificateType === 5||
            this.introduceShowObj.certificateType === 2||this.introduceShowObj.certificateType === 4)
        }
    },
    filters: {
      teachingAgeFilter(val) {
        if (!val) {
          return val == 0 ? '0年' : '';
        } else {
          return val == 10 ? '10年及以上' : val + '年';
        }
      },
    },
    components: {
      previewImg
    },
    methods: {
       getTeaSubject(){
              //教资学科
              certificate_subject.certificateSubject.forEach(item => {
                   if (item.value==this.introduceShowObj.certificateSubject){
                      this.subject=item.label
                   }
                 })
       },
      // 切换身份证信息
      showChinaidContent() {
        this.showChinaidVal = this.showChinaidVal === '显示' ? '隐藏' : '显示';

        this.getChinaInfo('switch');
      },
      // 身份证信息状态
      getChinaIdStateStr(state){
        if(state == "1"){
          return '已实名认证'
        }
        if(state == "0"){
          return '未实名认证'
        }
        return "";
      },
      // 查看更多近期审核记录
      showMoreReview() {
        this.showMoreFlg = false;
        this.reviewList = this.reviewListALL;
      },
      initData() {
        this.$refs['auditForm'].resetFields()
      },
      getSnapshot() {
        getIntroduceSnapshot({teaId: this.rowData[0].teaId})
          .then(res => {
            this.introduceShowObj = {...this.introduceShowObj, ...res}
            this.getTeaSubject();
          })
          .catch((err) => {
            console.log(err)
            this.introduceShowObj = {}
          })
      },
      // 获取身份证信息
      getChinaInfo(type) {
        // this.showChinaidVal = this.showChinaidVal === '显示' ? '隐藏' : '显示';
        // if(this.showChinaidVal === '显示') {
        //   this.chinaIdContent = '******************';
        //   return;
        // }
        basicInfo({teaId: this.rowData[0].cipherTId}).then(data => {
          this.chinaidState = data.chinaIdState;
          if (type === 'init') { // 初始化
            this.chinaIdContent = '******************';
          } else {
            if(this.showChinaidVal === '显示') {
              this.chinaIdContent = '******************';
              return;
            } else {
              this.chinaIdContent = data.chinaId || '';
            }
          }
        }).catch(message => {
          this.$Message({
            message
          })
        })
      },
      getReview() {
        getReviewList({teaId: this.rowData[0].teaId})
        .then(res => {
          this.reviewListALL = JSON.parse(JSON.stringify(res));
          this.reviewList = res.length ? [res[0]] : [];
          if (!res.length || res.length == 1) {
            this.showMoreFlg = false;
          } else {
            this.showMoreFlg = true;
          }
        });
        // 获取身份证信息
        this.getChinaInfo('init');
      },
      handleChange(value) {
        if (value === '2')
          this.placeholder = '请填写备注（选填）'
        else
          this.placeholder = '请填写未通过原因（必填）'
      },
      handleClickAudit() {
        this.$refs['auditForm'].validate((valid) => {
          if (valid) {
            this.auditForm = {...this.auditForm, teaId: this.rowData[0].teaId}
            reviewTeaPersonalInfo(this.auditForm)
              .then(res => {
                this.$Message({
                  type: 'success',
                  message: '审核成功！'
                })
                setTimeout(() => {
                  this.$parent.$parent.handleClickCancle()
                  this.initData()
                }, 1000)
              })
              .catch(message => {
                this.$Message({
                  type: 'error',
                  message
                })
              })
          } else {
            return false
          }
        })
      },
      // 根据类型获取对应播放地址
      getVideoUrl(fileType) {
        let url = ''
        const teacherFilesId = this.introduceShowObj.teacherFiles || []
        teacherFilesId.map(file => {
          if (file.fileType=== fileType) {
            url = file.ossPath
          }
        })
        return url
      },
      // 视频查看
      viewVedio (fileType) {
        this.videoUrl = this.getVideoUrl(fileType);
        if (this.videoUrl) {
          this.viewVedioDialog = true
        } else {
          this.$Message({
            type: 'warning',
            message: '该老师暂无视频介绍'
          })
        }
      },
      // 关闭预览
      handleClose () {
        this.viewVedioDialog = false
      },
      closePreview() {
        this.previewState = false
      },
      handleShowImage(url) {
        if(!url){
          return
        }
        this.imgPath = url
        this.previewState = true
      },
    },
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
  .personalIntroduce{
    .section{
      margin-top: 20px;
      .left{
        .picVideo{
          display: flex;
          flex-direction: row;
          div{
            width: 50%;
            display: flex;
            flex-direction: row;
            span{
              width:56px;
              height:20px;
              font-size:14px;
              font-weight:600;
              color:rgba(51,51,51,1);
              line-height:20px;
              display: inline-block;
              margin-right: 16px;
            }
            img{
              width:80px;
              height:80px;
              border-radius:4px;
            }
          }
          .videoContainer{
            div.videoPlayer{
              position: relative;
              width:80px;
              height:80px;
              background:rgba(44,44,44,1);
              border-radius:4px;
              img{
                width:23px;
                height:23px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            &:hover{
              cursor: pointer;
            }
          }
        }
        .infoDetail{
          div{
            display: flex;
            flex-direction: row;
            margin-top: 20px;
            span{
              display: inline-block;
              font-size:14px;
            }
            .title{
              font-weight:600;
              color:rgba(51,51,51,1);
              margin-right: 16px;
            }
            .contentSub{
              width:358px;
              font-weight:400;
              color:rgba(119,119,119,1);
            }
          }
          .certificatePic{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-left: 72px;
            img{
              width:80px;
              height:80px;
              border-radius:4px;
              margin-right: 16px;
              margin-bottom: 16px;
            }
          }
          .certificateDetail{
            margin-left: 72px;
            margin-top: 0;
            display: flex;
            flex-direction: column;
          }
        }
      }
      .middle{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .middleDivider{
          width:1px;
          height:525px;
          background-color: #DDDDDD;
        }
      }
      .right{
        .teachingDiploma{
          .titleDiploma{
            height:20px;
            font-size:14px;
            font-weight:600;
            color:rgba(51,51,51,1);
          }
          .contentDiploma{
            margin-top: 20px;
            .detailDiploma{
              span{
                display: inline-block;
                height:20px;
                font-size:14px;
                font-family:PingFangSC;
                font-weight:400;
                color:rgba(119,119,119,1);
                margin-bottom: 20px;
              }
              .leftRow{
                width: 40%;
              }
              .rightRow{
                width: 60%;
              }
            }
            .piclDiploma{
              display: flex;
              flex-direction: row;
              span{
                display: inline-block;
                width: 100px;
                font-size:14px;
                font-weight:400;
                color:rgba(119,119,119,1);
                margin-right: 16px;
              }
              .picList{
                img{
                  width:80px;
                  height:80px;
                  border-radius:4px;
                  margin-right: 16px;
                  margin-bottom: 16px;
                }
              }
              .IDCardPic{
                width: 144px;
                font-size:14px;
                font-weight:600;
                color:rgba(51,51,51,1);
              }
            }
          }
          .teacherLabel{
            margin-top: 20px;
            div{
              font-size:14px;
              font-weight:600;
              color:rgba(51,51,51,1);
            }
            span{
              display: inline-block;
              font-size:14px;
              font-weight:400;
              color:rgba(119,119,119,1);
              margin-top: 20px;
            }
          }
        }
      }
      .el-row::before,.el-row::after{
        content: '';
        display: table;
      }
      .el-row::after{
        clear: both;
      }
    }
    .footerContainer{
      .footerTitle{
        font-size: 14px;
        font-weight:400;
        color:rgba(51,51,51,1);
        margin-bottom: 16px;
      }
      .line{
        height: 1px;
        border-bottom: 1px solid #DDD;
        margin-top: 27px;
      }
      .auditResult{
        height: 110px;
        margin-top: 17px;
        position: relative;
        .auditForm{
          width: 50%;
          position: absolute;
          right: 0;
          .btnGroup{
            text-align: right;
            .btnCancle{
              color:rgba(29,145,252,1);
            }
            .btnConfirm{
              background:rgba(29,145,252,1);
              color:rgba(255,255,255,1);
              margin-left: 16px;
            }
          }
        }
      }
    }
    .fixedVedio {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3000;
      width: 100%;
      height: 100%;
      .sameParent {
        position: absolute;
        left: 50%;
        top: 25%;
        z-index: 3002;
        width: 100%;
        height: 658px;
        // padding: 0 15px 0;
        background:rgba(130,130,130,1);
        .title {
          height: 40px;
          text-align: right;
          font-size: 14px;
          i {
            line-height: 40px;
            &:hover {
              color: #409EFF;
            }
          }
        }
        .contentParentsVideo {
          text-align: center;
          height: 600px;
          position: relative;
          video {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto;
            width:539px;
            height:539px;
          }
        }
      }
    }
  }
  .no-data{
    min-height: 300px;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
  }
.show-more-review {
  position: relative;
  color: #169bd5;
  cursor: pointer;
  text-align: center;
  margin-top: 20px;
}
.audit-state{
    padding: 10px 0 20px 0;
  }
.audit-text:after{
  content: '';
  display: block;
  clear: both;
}
.audit-title{
  width: 100px;
  min-height: 40px;
  line-height: 40px;
  background-color: rgba(22, 155, 213, 1);
  color:white;
  font-size: 14px;
  text-align: center;
  float: left;
}
.audit-description{
  min-height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding-left: 120px;
}
</style>
