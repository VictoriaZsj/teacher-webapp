import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method savaAgentTextConfig
 *
 @param  {Object} options 请求参数0
    @property  {String} linkid	链接ID	integer	query	false
    @property  {String} position	文字位置:1推荐攻略，2我的推荐	string	query	false
    @property  {String} type	文字类型:1攻略文字，2滚动公告，3滚动弹幕	string	query	false
    @property  {String} content	文字内容

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function savaAgentTextConfig (options) {
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newEntry/offlineContract',
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
