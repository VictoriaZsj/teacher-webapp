import fetch from '../../../src/utils/fetch'
/**
 *
 方法说明
 *
 @method queryAgentAward
 *
 @param  {Object} options 请求参数
      @property  {String} activeTitle	活动标题	string	body	true
      @property  {String} agentName	代理姓名	string	body	true
      @property  {String} month	结算月份	string	body	true
      @property  {String} state	结算状态	string	body	true
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function queryAgentAward (options) {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/agent/queryAgentAward',
            method: 'post',
            data:options
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
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
