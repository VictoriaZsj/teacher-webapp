import fetch from '../../../src/utils/fetch'
/**
 *
 方法说明 获取教师笔试信息
 *
 @method queryAgentTextConfig
 *
 @param  {Object} options 请求参数
  @property  {String} linkid	链接ID 非必传
  @property  {String} position	文字位置:1推荐攻略，2我的推荐
  @property  {String} type	文字类型:1攻略文字，2滚动公告，3滚动弹幕
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function queryAgentTextConfig (options) {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/agent/queryAgentTextConfig',
            method: 'get',
            params:options
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
