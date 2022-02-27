import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取教师教学背景
 *
 @method getEduBack
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回值
  {
    code:1,
    data:{
      teaBu// 所属BU
      teaSchoolGao// 高中学校
      teaWenli// 高考文理科
      ceeProvince// 高考所在地(省)
      ceeCity// 高考所在地(市)
      ceeSubjectFirst// 高考科目
      ceeSubjectFirstScore// 高考分数
      ceeSubjectFirstTotalScore// 高考满分
      ceeSubjectSecond// 高考科目
      ceeSubjectSecondScore// 高考分数
      ceeSubjectSecondTotalScore// 高考满分
      ceeSubjectThird// 高考科目
      ceeSubjectThirdScore// 高考分数
      ceeSubjectThirdTotalScore// 高考满分
      educatList// 学习经历
      classType// 授课类型
      timeType// 工作性质
      teaRegion// 所在分区
      teacherCertificate// 是否有教师资格证
      majorTeacher// 主课老师
      abrsm// 英皇辅导经验
      style// 授课风格
      musicType// 识谱方式
      pianoLevel// 钢琴等级
      teachingExperience// 教学经验
      teaGoodFirstCode//获取第一擅长科目中文
      teaGoodSecondCode//获取第二擅长科目中文
      teaTaughtStuGradeCode//获取年级偏好中文
      teaGoodFirst//获取第一擅长科目中文
      teaGoodSecond//获取第二擅长科目中文
      teaTaughtStuGrade//获取年级偏好中文
      enableAppointSubjectCode//预约科目
      teaTaughtStuLevel//学生水平偏好
      teaTaughtStuGradeCode//年级偏好存在多个 所以需要转一下
      teaTaughtStuGrade//年级偏好存在多个 所以需要转一下
      idCardListFace//身份证正面
      idCardListSide//身份证反面
      studentIdCardList //获奖证书
      awardList//获奖证书
    },
    message:''
 }
 */
export default function getEduBack (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/PersonalInfo/getEduInfo',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
            } else {
                reject(message || "数据不存在");
            }
        }).catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
