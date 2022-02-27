import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  预约面试时间
 *
 @method teacherInfoSetTeacherRealName
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} idCard	证件号
    @property  {String} realName	姓名
    @property  {String} certificateType	证件类型

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function teacherInfoSetTeacherRealName (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.realName)){
        return Promise.reject('请填写姓名');
    }
    if(window.isEmpty(options.certificateType)){
        return Promise.reject('请选择证件类型');
    }
    if(window.isEmpty(options.idCard)){
        return Promise.reject('请填写证件号');
    }else{
      if(options.certificateType == "1"){
        var reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
        if(reg.test(options.idCard) == false){
          return Promise.reject('身份证格式不正确');
        }
      }

    }


    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/teacherRealName',
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
