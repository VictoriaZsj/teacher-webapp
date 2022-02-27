import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明  修改教师基本信息
 *
 @method updateBasicInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} mobile 联系电话 可不传
    @property  {String} teaGender//性别 可不传
    @property  {String} email//讲师邮箱 可不传
    @property  {String} teaQq//讲师QQ 可不传
    @property  {String} teaWeixin//讲师微信 可不传
    @property  {String} teaArea//现居住地 可不传
    @property  {String} emergencyContactRelation//紧急联系人关系 可不传
    @property  {String} emergencyContact//紧急联系人手机号 可不传
    @property  {String} hrMark//备注 可不传

 *
 @return 返回值
   {
   code:1,
   data:'',
   message:''
  }
 */
export default function updateBasicInfo (options) {
    //数据正确性判断
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(isEmpty(options.mobile)){
        return Promise.reject('请填写联系电话');
    }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teachers-mp/api/PersonalInfo/saveBasicInfo',
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

function checkPhoneNmber(value) {
  return /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/.test(value)
}
