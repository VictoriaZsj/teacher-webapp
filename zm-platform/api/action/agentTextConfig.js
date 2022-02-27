import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method agentTextConfig
 *
 @param  {Object} options 请求参数 -数组
    @property  {String} linkid	链接ID	integer	query	false
    @property  {String} position	文字位置:1推荐攻略，2我的推荐	string	query	false
    @property  {String} type	文字类型:1攻略文字，2滚动公告，3滚动弹幕	string	query	false
    @property  {String} content	文字内容

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function agentTextConfig (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.activityTextDtoList) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(window.isEmpty(options.position)){
      return Promise.reject("请填写文字位置");
    }
    if(window.isEmpty(options.type)){
      return Promise.reject("请填写文字类型");
    }
    let error = "",
        item = null,
        list = options.activityTextDtoList;
    for(let i = 0; i < list.length; i++){
      item = list[i];
      if(window.isEmpty(item.linkid)){
        error = "请填写链接ID";
        break;
      }
      if(window.isEmpty(item.content)){
        error = "请填写文字内容";
        break;
      }
    }
    if(!!error){
      return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/agentTextConfig',
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
