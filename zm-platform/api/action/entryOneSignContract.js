import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  删除代理
 *
 @method entryOneSignContract
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function entryOneSignContract (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请传递teaId');
    }
    options.time = new Date(options.time).getTime();
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newEntry/oneSignContract',
          method: 'post',
          data:options,
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
