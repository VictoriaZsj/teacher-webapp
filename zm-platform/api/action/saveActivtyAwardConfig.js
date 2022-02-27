import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明
 *
 @method addAgentLink
 *
 @param  {Object} options 请求参数

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function addAgentLink (options) {
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/saveActivtyAwardConfig',
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
