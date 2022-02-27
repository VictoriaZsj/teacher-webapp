import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method delAgentAppConfig
 *
 @param  {Object} options 请求参数0

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function delAgentAppConfig (options) {
    //数据正确性判断
    if(window.isEmpty(options.id)){
        return Promise.reject('请传递ID');
    }
    return new Promise((resolve, reject) => {
        let url = "/api/agent/delAgentAppConfig?id=" + options.id;

        fetch({
          url: url,
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
