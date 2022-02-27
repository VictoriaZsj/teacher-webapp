import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取老师标签
 *
 @method getTeaPersonalInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回值
 {
 code:1,
 data:{
  headImageUrl
  state
  checkPassReason
  userName
  teaGoodSubject
  list//教育经历
  ceeProvince//高考经历省
  ceeSubjectFirst
  ceeSubjectFirstScore
  ceeSubjectFirstTotalScore
  ceeSubjectSecond
  ceeSubjectSecondScore
  ceeSubjectSecondTotalScore
  ceeSubjectThird
  ceeSubjectThirdScore
  ceeSubjectThirdTotalScore
  hobby
  teachingExperience
  awardRecordFirstFile
  awardRecordFirstCompetitionLevel
  awardRecordFirstSubject
  awardRecordFirstLevel
  awardRecordSecondFile
  awardRecordSecondCompetitionLevel
  awardRecordSecondSubject
  awardRecordSecondLevel
  awardRecordThirdFile
  awardRecordThirdCompetitionLevel
  awardRecordThirdSubject
  awardRecordThirdLevel
  teachingNotes
  teachingStyle
  teaIntro
 },
 message:''
}
 */
export default function getTeachTagInfo (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api//tag/queryTagTree',
            method: 'get',
            params:options,
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
