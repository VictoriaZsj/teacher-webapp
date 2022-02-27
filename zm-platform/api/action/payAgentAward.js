import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method payAgentAward
 *
 @param  {Object} options 请求参数0
    @property  {String} agentId:'',	//代理id
    @property  {String} month:'',	//结算月份

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function payAgentAward (options) {
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/payAgentAward',
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
