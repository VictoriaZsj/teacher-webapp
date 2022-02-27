import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'


/**
 *
 方法说明 教师个人资料审核
 *
 @method reviewTeaPersonalInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 状态：2代表审核通过，3代表审核未通过
    @property  {String} desc 备注
 *
 @return 返回值
  {
   code:'',
   data:'',
   message:''
  }
 */
export default function reviewTeaPersonalInfo (options) {
    //数据正确性判断
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(isEmpty(options.state)){
        return Promise.reject('请选择审核结果');
    }
    if(!isEmpty(options.desc) && options.desc.length > 50){
      return Promise.reject('备注字数不可大于50');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teachers-mp/api/PersonalInfo/AuditingIntroduceInfo',
          method: 'post',
          data: options
        }).then((result) => {
          const code = result.code;
          const message = result.message;
          const data = result.data;
          if (code == 0) {
            resolve(data);
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
