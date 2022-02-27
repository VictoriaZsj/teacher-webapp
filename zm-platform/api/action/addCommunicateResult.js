import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果
 *
 @method addCommunicateResult
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {Int} communicateResultType 必选
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function addCommunicateResult (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.communicateResultType)){
        return Promise.reject('请选择沟通结果');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newInterviewService/addCommunicateResult',
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
