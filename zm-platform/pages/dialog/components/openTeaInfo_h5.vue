<template>
 <div class="formContainer">
          <div class="tip">
              请保证报名信息的真实性，如有虚假，概不录取
              <!-- <van-icon name="close" color='#EE9A0F' style="float:right"/> -->
          </div>
    <div class="detail">
        <p class='head'>个人信息</p>
        <div class="block">
           <div class="cell">
               <span class="block1_span1">姓名</span>
               <span class="content">{{info.name}}</span>
           </div>
           <div class="cell">
               <span class="block1_span1">邮箱</span>
                <span class="content">{{info.email}}</span>
            </div>
           <div class="cell">
                <span class="block1_span1">微信</span>
                 <span class="content">{{info.weChat}}</span>
           </div>
           <div class="cell">
                <span class="block1_span1">手机号</span>
                 <span class="content">{{info.mobile}}</span>
           </div>
           <div class="cell">
                <span class="block1_span1">出生日期</span>
                 <span class="content">{{info.birthday}}</span>
           </div>
           <div class="cell">
                <span class="block1_span1">姓别</span>
                 <span class="content">{{info.gender || '-'}}</span>
           </div>
        </div>
        <p class='head'>教育经历</p>
        <div class="block">
           <div class="cell">
               <span class="block1_span2">最高学历</span>
                <span class="content">{{info.highestEduDesc}}</span>
           </div>
           <div class="cell">
               <span class="block1_span2">学校</span>
                <span class="content">{{info.school}}</span>
            </div>
           <div class="cell">
                <span class="block1_span2">入学 - 毕业时间</span>
                 <span class="content">{{info.fromYear || '无' + '-' + info.toYear || '无'}}</span>
           </div>
           <div class="cell">
                <span class="block1_span2">学习形式</span>
                 <span class="content">{{info.learningFormDesc}}</span>
           </div>
           <div class="cell">
                <span class="block1_span2">是否特殊学制</span>
                 <span class="content">{{info.specialSystemDesc}}</span>
           </div>

            <div class="cell">
                <span class="block1_span2">毕业证和学位证</span>
                 <span class="content">{{info.diplomaDesc}}</span>
           </div>
           <div class="cell">
                <span class="block1_span2">教师资格证阶段</span>
                 <span class="content">{{info.certificateTypeDesc}}</span>
           </div>
        </div>
        <p class='head'>求职信息</p>
        <div class="block">
           <div class="cell">
                <span class="block1_span2">学段学科</span>
                 <span class="content">{{info.gradeDesc+info.subjectDesc}}</span>
           </div>
            <div class="cell">
                <span class="block1_span2">求职状态</span>
                 <span class="content">{{info.jobStateDesc}}</span>
           </div>
           <div class="cell">
                <span class="block1_span2">当前从事职业</span>
                 <span class="content">{{info.currentJobDesc || '-'}}</span>
           </div>
           <div class="cell">
                <span class="block1_span2">职业规划</span>
                <span class="content">{{info.careerPlanDesc || '-'}}</span>
           </div>
        </div>
         <p class='head'>其他</p>
        <div class="block">
           <div class="cell">
                <span class="block1_span1">婚姻状况</span>
                 <span class="content">{{info.maritalStatusDesc}}</span>
           </div>
            <div class="cell">
                <span class="block1_span1">特殊优势</span>
                 <span class="content">{{info.specialAdvantageDesc}}</span>
           </div>
        </div>
    </div>
    </div>
</template>

<script>
  import fetch from '../../../../src/utils/fetch';

export default {
    data(){
        return{
            info:{
                birthdayDesc: "",
                careerPlanDesc: "",
                certificateTypeDesc: "",
                commissionerNoDesc: "",
                diplomaDesc: "",
                emailDesc: "",
                schoolDesc: "",
                fullName: "",
                gradeDesc: "",
                subjectDesc:"",
                highestEduDesc: "",
                jobStateDesc: "",
                learningFormDesc: "",
                maritalStatusDesc: "",
                mobileDesc: "",
                schoolDesc: "",
                specialAdvantageDesc: "",
                specialSystemDesc: "",
                fromYearDesc:'',
                toYearDesc: "",
                wechatDesc:''
            },
        }
    },
    props:{
        currentID:''
    },
    methods:{
        init(){
            fetch({
                url: '/api/teacherInfo/selectTeacherRegInfo',
                method: 'post',
                data:{teaId: this.currentID}
                }).then((result) => {
                    const data = result.data;
                    const code = result.code;
                    const message = result.message;

                    if (code == 0) {
                        this.info=data
                    } else {
                        console.log(message);
                    }


                }
                )
        }
    },
    mounted(){

    }
}
</script>

<style lang="less" scoped>
.formContainer{
    min-height: 100%;
    width: 100%;
    background-color:#eeeeee ;
  .tip{
      background-color: #FDFAE3;
      padding: 8px 16px;
      color:#EE9A0F;
      font-size: 13px;
  }
.detail{
    background-color: #eeeeee;
    padding: 16px;
    .head{
        border-left:5px solid #EF4C4F ;
        font-size: 18px;
        margin-bottom: 14px;
        padding-left: 9px;
        font-weight: 600;
    }
    .block{
        border-radius: 10px;
        border: 1px solid #e4e0e0;
        background: #ffffff;
        padding: 0 8px;
        display: flex;
        flex-flow: column;
        flex: 1;
        margin: 16px 0;
        .cell{
            // height: 60px;
            padding: 16px 16px 16px 0;
            .block1_span1{
                font-size: 14px;
                color: #999999;
                display: inline-block;
                width: 70px;

            }
            .content{
                 font-size: 16px;
                color: #333333;

            }
            &:not(:last-child){
                border-bottom: 1px solid #f3f3f3;
            }
            .block1_span2{
                font-size: 14px;
                color: #999999;
                display: inline-block;
                width: 130px;

            }
        }
    }
}
}
</style>
