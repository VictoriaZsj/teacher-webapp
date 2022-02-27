import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取教师基本信息
 *
 @method basicInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回值
  {
    code:1,
    data:{
      mobile//联系电话
      teaGender//性别
      email//讲师邮箱
      teaQq//讲师QQ
      teaWeixin//讲师微信
      teaArea//现居住地
      emergencyContactRelation//紧急联系人关系
      emergencyContact//紧急联系人手机号
      hrMark//备注
    },
    message:''
  }
 */
export default function basicInfo (options) {
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/PersonalInfo/getBaseInfo',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    if(isEmpty(data.teaQq)){
                      data.teaQq = "";
                    }
                    if(isEmpty(data.email)){
                      data.email = "";
                    }
                    if(isEmpty(data.emergencyContact)){
                      data.emergencyContact = "";
                    }
                    if(isEmpty(data.emergencyContactRelation)){
                      data.emergencyContactRelation = "";
                    }
                    if(isEmpty(data.hrMark)){
                      data.hrMark = "";
                    }
                    if(isEmpty(data.mobile)){
                      data.mobile = "";
                    }
                    if(isEmpty(data.name)){
                      data.name = "";
                    }
                    if(isEmpty(data.teaArea)){
                      data.teaArea = "";
                    }
                    if(isEmpty(data.teaGender)){
                      data.teaGender = "";
                    }
                    if(isEmpty(data.teaWeixin)){
                      data.teaWeixin = "";
                    }

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
