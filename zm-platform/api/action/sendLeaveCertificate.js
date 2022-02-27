import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 培训通知(单个)
 *
 @method sendLeaveCertificate
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function sendLeaveCertificate (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.idcardNo)){
        return Promise.reject('请填写身份证号');
    }else{
      var reg =  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
      if(reg.test(options.idcardNo) == false){
          return Promise.reject('身份证格式不正确');
      }
    }
    if(window.isEmpty(options.leaveTime)){
        return Promise.reject('请选择离职时间');
    }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newLeave/sendLeaveCertificate',
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
