<template>
  <div @click="cancel()" class="back-model">
    <div class="export-resume">
      <el-button type="primary" @click="handlerConvert2canvas">导出简历</el-button>
    </div>
    <div @click.stop="contentClick()" class="container-resume" id="containerResume">
      <div class="gap"></div>
      <div class="log-pl"></div>
      <div class="resume-pic">
        <img :onerror="errorImg" :src="resumeInfo.headImageUrl" />
      </div>
      <div class="resume-info" ref="resumeInfo">
        <div class="resume-detail" ref="resumeDetail">
          <div class="teacher-name">{{resumeInfo.userName}}</div>
          <!-- <div class="lesson-time">累计课时 23 小时</div> -->
          <div class="teacher-style">
            <div v-for="(item, index) in resumeInfo.teaStyle" :key="index">{{item}}</div>
          </div>
          <div class="teaching-describe">
            <p><i class="teaching-experence"></i><span>教学经验</span></p>
            <div>
              {{resumeInfo.teachingExperience}}
            </div>
          </div>
          <div class="teaching-describe">
            <p><i class="teaching-honor"></i><span>奖项荣誉</span></p>
            <div>
              {{resumeInfo.honors}}
            </div>
          </div>
          <div class="teaching-describe">
            <p><i class="teaching-evaluate"></i><span>自我评价</span></p>
            <div>
              {{resumeInfo.selfEvaluate}}
            </div>
          </div>
        </div>
      </div>
      <div class="resume-bottom">在线1对1钢琴陪练</div>
    </div>
  </div>
</template>
<script>

import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      resumeInfo: {},
      headImageUrl: '',
      errorImg: 'this.src=" '+require('../../../src/assets/default.jpg')+' "'
    }
  },
  props:{
    // 次组件没有用到 props
    // 传入时为数组，报错
    // 注释
    //
    // currentID: {
    //   type: String,
    //   default: ''
    // },
    viewState: {
      type: Boolean,
      default: false
    },//false表示页面关闭，true表示页面展开
    teaData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    teaData (data) {
      let teaStyle = []
      if (data.teachingSytle){
        let teachingSytle = data.teachingSytle
        teaStyle = data.teachingSytle.split(',')
      }
      this.resumeInfo = {...data, teaStyle: teaStyle}
      // this.resumeInfo.headImageUrl ? this.headImageUrl = this.resumeInfo.headImageUrl : this.headImageUrl = require('../../../src/assets/default.jpg')
      // this.resumeInfo.headImageUrl = this.headImageUrl
    }
  },
  methods:{
    handlerConvert2canvas() {
      let shareContent = document.getElementById('containerResume')
      let width = shareContent.offsetWidth
      let height = shareContent.offsetHeight
      let canvas = document.createElement("canvas")
      let scale = 2
      canvas.width = width * scale
      canvas.height = height * scale
      canvas.getContext("2d").scale(scale, scale)
      var opts = {
        scale: scale,
        canvas: canvas,
        width: width,
        height: height,
        useCORS: true
      }
      html2canvas(shareContent, opts).then(canvas => {
        let dataURL =canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        let filename = `${this.resumeInfo.userName}简历` + '.jpg'
        this.saveFile(dataURL, filename)
      })
    },
    getHeaderUrl(teaId) {
      this.$Fetch({
        url: `/api/teacherInfo/getHeadImageUrl?teaId=${teaId}`,
        method: 'get'
      })
       .then(res => {
         this.resumeInfo.headImageUrl = res
       })
    },
    saveFile(data, filename) {
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = data
      save_link.download = filename
      var event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      save_link.dispatchEvent(event)
      this.$Message({
        message: '简历导出成功！',
        type: 'success'
      })
    },
    cancel () {
      this.$emit("cancel");
    }
  }
}
</script>
<style scoped>
    .back-model{
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.5);
      z-index: 9999;
    }
    .export-resume{
      position: fixed;
      top: 1%;
      right: 28%;
    }
    .container-resume{
      width: 375px;
      height: auto;
      background-color: #FDFDFD;
      background-size: 375px 193px;
      margin: 0 auto;
      background-image: url('../../../src/assets/img_resume.png');
      background-repeat: no-repeat;
    }
    .container-resume > .gap{
      width: 100%;
      height: 13px;
    }
    .container-resume > .log-pl{
      width: 66px;
      height: 23px;
      margin: 0 0 65px 15px;
      background-size: 66px 23px;
      background-image: url('../../../src/assets/logo_pl.png');
      background-repeat: no-repeat;
    }
    .container-resume > .resume-pic{
      width: 96px;
      height: 128px;
      position: absolute;
      top: 100px;
      left:50%;
      transform: translate(-50%,-50%);
      z-index: 100001;
    }
    .container-resume > .resume-pic > img{
      width: 100%;
      height: 100%;
    }
    .container-resume > .resume-info{
      width: 345px;
      height: 100%;
      background-color: #fff;
      border: 2px solid #fff;
      border-radius: 15px;
      box-shadow: 5px 5px 10px 5px  #888;
      margin: 0 auto;
    }
    .container-resume > .resume-info > .resume-detail{
      width: 325px;
      height: 100%;
      margin: 0 auto;
    }
    .resume-detail > .teacher-name{
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: #3C3C3C;
      margin-top: 65px;
    }
    .resume-detail > .lesson-time{
      width: 100%;
      height: 20px;
      text-align: center;
      color: #999;
      margin-bottom: 5px;
    }
    .resume-detail > .teacher-style{
      width: 265px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      margin-top: 5px;
    }
    .teacher-style > div{
      padding: 3px 14px;
      background-color: #FEC812;
      color: #fff;
      font-size: 12px;
      border: 1px solid #FEC812;
      border-radius: 15px;
      margin: 5px;
    }
    .resume-detail > .teaching-describe{
      width: 94%;
      margin: 0 auto;
      margin-top: 20px;
    }
    .resume-detail > .teaching-describe:last-child{
      margin-bottom: 20px;
    }
    .teaching-describe > p{
      width: 100%;
      display: flex;
      align-items: center;
    }
    .teaching-describe > p > i{
      width: 24px;
      height: 20px;
      display: inline-block;
      margin-right: 11px;
    }
    .teaching-describe > p > i.teaching-experence{
      background-image: url('../../../src/assets/icon_experience.png');
      background-size: cover;
    }
    .teaching-describe > p > i.teaching-honor{
      background-image: url('../../../src/assets/icon_reward.png');
      background-size: cover;
    }
    .teaching-describe > p > i.teaching-evaluate{
      background-image: url('../../../src/assets/icon_evaluate.png');
      background-size: cover;
    }
    .teaching-describe > p > span{
      font-size: 18px;
      color: #3c3c3c;
      display: inline-block;
    }
    .teaching-describe > div{
      font-size: 12px;
      color: #ACACAC;
      margin-top: 5px;
    }
    .container-resume > .resume-bottom{
      width: 100%;
      font-size: 14px;
      color: #ccc;
      text-align: center;
      padding: 20px 0;
    }
    </style>
