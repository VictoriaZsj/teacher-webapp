import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取实名认证信息
 *
 @method getRealnameInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回值
  {
    code:1,
    data:{
      state//审核状态
      realName//姓名
      certificateType//证件类型
      idCard//证件号码
    },
    message:''
  }
 */
export default function getRealnameInfo (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/PersonalInfo/getRealnameInfo',
            method: 'get',
            params:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    if(isEmpty(data.idCard)){
                      data.idCard = "";
                    }
                    if(isEmpty(data.realName)){
                      data.realName = "";
                    }
                    if(isEmpty(data.state)){
                      data.state = "";
                    }
                    if(isEmpty(data.certificateType)){
                      data.certificateType = "";
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
