import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  删除代理
 *
 @method deleteOperatingAgent
 *
 @param  {Object} options 请求参数
    @property  {Array} agentId ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function deleteOperatingAgent (options) {
    //数据正确性判断
    if(window.isEmpty(options.agentId)){
        return Promise.reject('请传递agentId');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agentMember/deleteOperatingAgent',
          method: 'get',
          params:options,
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
