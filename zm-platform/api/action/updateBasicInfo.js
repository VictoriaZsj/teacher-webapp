import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  修改教师基本信息
 *
 @method updateBasicInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} teaName: 教师名称,
    @property  {String} teaMobile: 联系电话
    @property  {String} teaGender: 性别//男 女
    @property  {String} teaEmail: 讲师邮箱
    @property  {String} qq: 教师qq
    @property  {String} location: 地址
    @property  {String} remark: 备注
    @property  {String} emergencyContactRelation: 紧急联系人
    @property  {String} emergencyContactMobile: 紧急联系人电话
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function updateBasicInfo (options) {
  
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.teaName)){
        return Promise.reject('请填写教师名称');
    }else if(options.teaName.length > 300){
        return Promise.reject('教师名称字数不可以大于300');
    }
    if(window.isEmpty(options.teaMobile)){
        return Promise.reject('请填写联系电话');
    }
    if(options.teaStatue > 1){
      if(window.isEmpty(options.teaGender)){
          return Promise.reject('请选择性别');
      }
      if(window.isEmpty(options.teaEmail)){
          return Promise.reject('请填写讲师邮箱');
      }
      if(window.isEmpty(options.qq)){
          return Promise.reject('请选择qq');
      }else if(options.qq.length > 300){
          return Promise.reject('qq字数不可以大于300');
      }
      if(!window.isEmpty(options.location) && options.location.length > 300){
        return Promise.reject('地址字数不可以大于300');
      }
    
    
      // let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
      // if(!regIdNo.test(options.chinaId)){
      //     return Promise.reject('身份证号格式填写有误');
      // }
      //let regTel = /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/;
      let regTel = /^\d{11}$/;
      if(!regTel.test(options.teaMobile)){
          return Promise.reject('联系电话格式填写有误');
      }
      //let regMail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      let regMail = /@.+\./;
      if(!regMail.test(options.teaEmail)){
          return Promise.reject('邮箱格式填写有误');
      }
      
    }else if(options.teaStatue > 2){//入职管理之后tab的校验
      let regTel = /^\d{11}$/;
        if(window.isEmpty(options.emergencyContactRelation)){
            return Promise.reject('请填写紧急联系人');
        }else if(options.emergencyContactRelation&&options.emergencyContactRelation.length > 300){
            return Promise.reject('紧急联系人字数不可以大于300');
        }
        if(window.isEmpty(options.emergencyContactMobile)){
            return Promise.reject('请填写紧急联系人电话');
        }
        if(!regTel.test(options.emergencyContactMobile)){
          return Promise.reject('紧急联系人电话格式填写有误');
        }
      }else{
      let regTel = /^\d{11}$/;
      if(!regTel.test(options.teaMobile)){
          return Promise.reject('联系电话格式填写有误');
      }
    }


    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/updateSimpleInfo',
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
