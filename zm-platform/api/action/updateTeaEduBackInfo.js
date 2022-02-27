import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  修改教师教育背景
 *
 @method updateTeaEduBackInfo
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID

    @property  {String} teaBu:'',//所属BU
    @property  {String} teaWenli:'',//文理科
    @property  {String} teaSchoolGao:'',//高中学校
    @property  {String} ceeProvince:'',//高考所在地
    @property  {String} ceeCity:'',//高考所在地
    @property  {String} ceeSubjectFirst:'',//科目
    @property  {String} ceeSubjectFirstScore:'',//分数
    @property  {String} ceeSubjectFirstTotalScore:'',//总分
    @property  {String} ceeSubjectSecond:'',//科目
    @property  {String} ceeSubjectSecondScore:'',//分数
    @property  {String} ceeSubjectSecondTotalScore:'',//总分
    @property  {String} ceeSubjectThird:'',//科目
    @property  {String} ceeSubjectThirdScore:'',//分数
    @property  {String} ceeSubjectThirdTotalScore:'',//总分
    @property  {String} graduateInfos:[],//学习经历
    @property  {String} workInfos:[],//工作经历
    @property  {String} certificateUrls:[],//学历证书
    @property  {String} teaTaughtStuGrade:[],///	学生年级偏好中文
    @property  {String} teaTaughtStuLevel:[],//学生水平偏好中文
    @property  {String} goodFirstSubject:'',//第一擅长科目中文
    @property  {String} goodSecondSubject:'',//第二擅长科目中文
    @property  {Array} awardFiles:'',//证书

    teacherAttr:{
      classType:null,
      timeType:'',
      goodFirstSubjectCode:'',
      goodSecondSubjectCode:'',
      taughtStuLevelCode:[],///学生水平偏好
      enableAppointSubjectCode:[],//上课科目
      teaTaughtStuGradeCode:[],//年级偏好
      majorTeacher:'',//是否主课老师 1 是 0 否
      teachingExperience:'',//教学经验
      abrsm:''//是否英皇辅导经验 1 是 0 否
    }

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function updateTeaEduBackInfo (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.teaBu)){
        return Promise.reject('请选择所属BU');
    }
    // if(window.isEmpty(options.teaWenli)){
    //     return Promise.reject('请填写文理科');
    // }
    // if(window.isEmpty(options.teaSchoolGao)){
    //     return Promise.reject('请填写高中学校');
    // }
    // if(window.isEmpty(options.ceeProvince)){
    //     return Promise.reject('请选择高考所在地(省)');
    // }
    // if(window.isEmpty(options.ceeCity)){
    //     return Promise.reject('请选择高考所在地(市)');
    // }
    // if(window.isEmpty(options.ceeSubjectFirst) || window.isEmpty(options.ceeSubjectFirstScore) || window.isEmpty(options.ceeSubjectFirstTotalScore)){
    //     return Promise.reject('请完善高考成绩');
    // }
    if(options.graduateInfos.length != 0){
      let error = "";
      for(let i = 0; i < options.graduateInfos.length; i++){
        let item = options.graduateInfos[i];
        if(item.education === ''){
          error = "请填写学习经历中的学历";
          break;
        }
        if(!item.graduatedYear){
          error = "请填写学习经历中的毕业时间";
          break;
        }
        if(!item.graduatedSchool){
          error = "请填写学习经历中的毕业院校";
          break;
        }
      }
      if(error != ""){
        return Promise.reject(error);
      }
    }
    if(window.isEmpty(options.goodFirstSubject)){
        return Promise.reject('请选择第一擅长科目');
    }

    if(!!options.teacherAttr){
      if(window.isEmpty(options.teacherAttr.courseTypes)){
          return Promise.reject('请选择授课类型');
      }
      if(window.isEmpty(options.teacherAttr.timeType)){
          return Promise.reject('请选择工作性质');
      }
      if(window.isEmpty(options.teacherAttr.goodFirstSubjectCode)){
          return Promise.reject('请选择第一擅长科目');
      }
      // if(window.isEmpty(options.teacherAttr.enableAppointSubjectCode) || options.teacherAttr.enableAppointSubjectCode.length == 0){
      //     return Promise.reject('请选择上课科目');
      // }


      if(window.isEmpty(options.teacherAttr.teaTaughtStuGradeCode) || options.teacherAttr.teaTaughtStuGradeCode.length == 0){
          if(options.teaBu == "3"){
            return Promise.reject('请选择学段偏好');
          }else{
            return Promise.reject('请选择年级偏好');
          }
      }
      // if(options.teaBu == "3"){
      //   if(window.isEmpty(options.teacherAttr.taughtStuLevelCode) || options.teacherAttr.taughtStuLevelCode.length == 0){
      //       return Promise.reject('请选择学生水平偏好');
      //   }
      //   if(window.isEmpty(options.teacherAttr.majorTeacher)){
      //       return Promise.reject('请选择主课老师');
      //   }
      //   if(window.isEmpty(options.teacherAttr.abrsm)){
      //       return Promise.reject('请选择英皇辅导');
      //   }
      //   if(window.isEmpty(options.teacherAttr.teachingExperience)){
      //       return Promise.reject('请填写教学经验');
      //   }
      // }


    }

    if(!window.isEmpty(options.awardFiles) && options.awardFiles.length > 0){
        let awardError = "";
        let _awrd = options.awardFiles.length;
        for(let m = 0; m < _awrd.length; m++){
          let _item = _awrd[m];
          if(_item.ossPath == ""){
            awardError = "请补充完整证书";
            break;
          }else{
            let _index = _item.ossPath.lastIndexOf("\/");
            _item.fileOrigName = str .substring(_index + 1, _item.ossPath.length);
          }
        }
        if(awardError != ""){
          return Promise.reject(awardError);
        }

    }


    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/updateTeaEduBackInfo',
          method: 'post',
          data: options
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
