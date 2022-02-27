import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 实名认证
 *
 @method teacherInfoSetTeacherRealName
 *
 @param  {Object} options 请求参数
    teaId 教师ID
    realName 真实姓名
    certificateType 证件类型 1身份证 2其他
    idCard 证件号

 *
 @return 返回值
   {
   code:1,
   data:'',
   message:''
  }
 */
export default function teacherInfoSetTeacherRealName (options) {
    //数据正确性判断
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(isEmpty(options.realName)){
        return Promise.reject('请填写姓名');
    }
    if(isEmpty(options.certificateType)){
        return Promise.reject('请选择证件类型');
    }
    if(isEmpty(options.idCard)){
        return Promise.reject('请填写证件号');
    }else if(options.certificateType == "1"){
        let reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
        if(reg.test(options.idCard) == false){
          return Promise.reject('身份证格式不正确');
        }
    }


    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teachers-mp/api/PersonalInfo/saveRealnameInfo',
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
