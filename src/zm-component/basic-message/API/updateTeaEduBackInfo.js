import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 修改教育背景
 *
 @method updateTeaEduBackInfo
 *
 @param  {Object} options 请求参数
     @property  {Array} teaId 教师ID数组 必填
     @property  {string} teaBu// 所属BU
     @property  {string} teaSchoolGao// 高中学校
     @property  {string} teaWenli// 高考文理科
     @property  {string} ceeProvince// 高考所在地(省)
     @property  {string} ceeCity// 高考所在地(市)
     @property  {string} ceeSubjectFirst// 高考科目
     @property  {string} ceeSubjectFirstScore// 高考分数
     @property  {string} ceeSubjectFirstTotalScore// 高考满分
     @property  {string} ceeSubjectSecond// 高考科目
     @property  {string} ceeSubjectSecondScore// 高考分数
     @property  {string} ceeSubjectSecondTotalScore// 高考满分
     @property  {string} ceeSubjectThird// 高考科目
     @property  {string} ceeSubjectThirdScore// 高考分数
     @property  {string} ceeSubjectThirdTotalScore// 高考满分
     @property  {string} educatList// 学习经历
     @property  {string} classType// 授课类型
     @property  {string} timeType// 工作性质
     @property  {string} teaRegion// 所在分区
     @property  {string} teacherCertificate// 是否有教师资格证
     @property  {string} majorTeacher// 主课老师
     @property  {string} abrsm// 英皇辅导经验
     @property  {string} style// 授课风格
     @property  {string} musicType// 识谱方式
     @property  {string} pianoLevel// 钢琴等级
     @property  {string} teachingExperience// 教学经验
     @property  {string} teaGoodFirstCode//获取第一擅长科目中文
     @property  {string} teaGoodSecondCode//获取第二擅长科目中文
     @property  {string} teaTaughtStuGradeCode//获取年级偏好中文
     @property  {string} teaGoodFirst//获取第一擅长科目中文
     @property  {string} teaGoodSecond//获取第二擅长科目中文
     @property  {string} teaTaughtStuGrade//获取年级偏好中文
     @property  {string} enableAppointSubjectCode//预约科目
     @property  {string} teaTaughtStuLevel//学生水平偏好
     @property  {string} teaTaughtStuGradeCode//年级偏好存在多个 所以需要转一下
     @property  {string} teaTaughtStuGrade//年级偏好存在多个 所以需要转一下
     @property  {string} idCardListFace//身份证正面
     @property  {string} idCardListSide//身份证反面
     @property  {string} studentIdCardList //获奖证书
     @property  {string} awardList//获奖证书


     招师-兼职-面试管理-个人信息-基本信息=>BU、授课类型、工作性质、第一擅长科目、年级偏好 、上课科目 必填，其他非必填；
 *
 @return 返回值
   {
   code:1,
   data:'',
   message:''
  }
 */
export default function updateTeaEduBackInfo (options,requirePermission) {
    //数据正确性判断
    if(isEmpty(!requirePermission&&options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(isEmpty(options.teaBu)){
        return Promise.reject('请选择所属BU');
    }
    if(options.teaBu != 3){
      if(isEmpty(!requirePermission&&options.teaSchoolGao)){
          return Promise.reject('请输入高中学校');
      }
      if(isEmpty(!requirePermission&&options.teaWenli)){
          return Promise.reject('请选择高考文理科');
      }
      if(isEmpty(!requirePermission&&options.ceeProvince)){
          return Promise.reject('请选择省份');
      }
      if(isEmpty(!requirePermission&&options.ceeCity)){
          return Promise.reject('请选择市');
      }
      if(isEmpty(!requirePermission&&options.ceeSubjectFirst)){
          return Promise.reject('请完善高考成绩(科目)');
      }
      if(isEmpty(!requirePermission&&options.ceeSubjectFirstScore)){
          return Promise.reject('请完善高考成绩(分数)');
      }
      if(isEmpty(!requirePermission&&options.ceeSubjectFirstTotalScore)){
          return Promise.reject('请完善高考成绩(满分)');
      }
    }

    if(isEmpty(!requirePermission&&options.educatList)){
        return Promise.reject('请完善教学经历');
    }
    let eduErr = "",
        eduItem = null;
    if(options.educatList.length > 0){
      for(let i = 0; i < options.educatList.length; i++){
        eduItem = options.educatList[i];
        eduItem.teaId = options.teaId;//应服务器端要求 加上这个。。。
        if(!requirePermission&&isEmpty(eduItem.degree)){
          eduErr = '请完善教学经历的学历';
          break;
        }
        if(!requirePermission&&isEmpty(eduItem.toyear)){
          eduErr = '请完善教学经历的毕业时间';
          break;
        }
        if(!requirePermission&&isEmpty(eduItem.schoolname)){
          eduErr = '请完善教学经历的毕业院校';
          break;
        }
        if(!requirePermission&&isEmpty(eduItem.submajor)){
          eduErr = '请完善教学经历的所学专业';
          break;
        }
        delete eduItem.edudetail
        delete eduItem.frommonth
        delete eduItem.isoverseas
        delete eduItem.moremajor
        delete eduItem.tomonth
      }
    }
    if(!!eduErr){
      return Promise.reject(eduErr);
    }

    if(isEmpty(options.classType)){
        return Promise.reject('请选择授课类型');
    }
    if(isEmpty(options.timeType)){
        return Promise.reject('请选择工作性质');
    }
    if(isEmpty(options.teaTaughtStuGradeCode) || options.teaTaughtStuGradeCode.length == 0){
        let errStr = "请选择学段偏好";
        if(options.teaBu != '3'){
          errStr = "请选择年级偏好";
        }
        return Promise.reject(errStr);
    }
    if(isEmpty(options.teaGoodFirstCode)){
        return Promise.reject('请选择第一擅长科目');
    }
    // 暂时去掉上课科目的必填项
    // if(isEmpty(options.enableAppointSubjectCode) || options.enableAppointSubjectCode.length == 0){
    //     return Promise.reject('请选择上课科目');
    // }
    if(options.teaBu == '3'){
      // if(isEmpty(options.teaTaughtStuLevel) || options.teaTaughtStuLevel.length == 0){
      //     return Promise.reject('请选择学生水平偏好');
      // }
      // if(isEmpty(options.majorTeacher)){
      //     return Promise.reject('请选择是否主课老师');
      // }
      if(isEmpty(!requirePermission&&options.abrsm)){
          return Promise.reject('请选择是否英皇辅导经验');
      }
      if(isEmpty(!requirePermission&&options.teachingExperience)){
          return Promise.reject('请填写教学经验');
      }
    }


    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teachers-mp/api/PersonalInfo/editEduInfo',
          method: 'post',
          data: Object.assign({}, options, {
            teachingExperience: encodeURIComponent(options.teachingExperience)
          })
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
          }
          else {
            reject(message);
          }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
