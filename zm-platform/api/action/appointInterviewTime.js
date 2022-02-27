import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  预约面试时间
 *
 @method appointInterviewTime
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID数组
    @property  {String} appointInterviewTime	预约时间	string	条件下必选: 4-条件符合下, 预约时间必选
    @property  {Int} communicateResultType	沟通结果	number	必选
    @property  {Int} connectNumber	沟通次数	number	必选
    @property  {String} remark	备注	string	可选

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function appointInterviewTime (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.communicateResultType)){
        return Promise.reject('请选择沟通结果');
    }
    if(options.communicateResultType == '4'){
      if(window.isEmpty(options.appointInterviewTime)){
          return Promise.reject('请选择面试时间');
      }
    }
    // if(window.isEmpty(options.connectNumber)){
    //     return Promise.reject('请填写沟通次数');
    // }else if(isNaN(options.connectNumber)){
    //     return Promise.reject('沟通次数应该是数字');
    // }else if(options.connectNumber < 0){
    //     return Promise.reject('沟通次数应该大于0');
    // }else if(options.connectNumber > 100){
    //     return Promise.reject('沟通次数应该小于100');
    // }
    if(!window.isEmpty(options.remark) && options.remark.length > 15){
      return Promise.reject('备注字数不可以大于15字');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newInterviewService/appointInterviewTime',
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
