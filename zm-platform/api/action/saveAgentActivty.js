import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method saveAgentActivty
 *
 @param  {Object} options 请求参数0
    @property  {String} activityendtime:'',	//活动结束时间
    @property  {String} activitystarttime:'',	//活动开始时间
    @property  {String} activitytitle:'',	//活动标题
    @property  {String} delaydays:'',	//延迟天数
    @property  {String} linkid:'',	//链接id
    @property  {String} bu:'',	//bu
    @property  {String} timetype:'',	//工作性质


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function saveAgentActivty (options) {
    //数据正确性判断
    if(window.isEmpty(options.activityendtime)){
        return Promise.reject('请填写活动结束时间');
    }
    if(window.isEmpty(options.activitystarttime)){
        return Promise.reject('请填写活动开始时间');
    }
    if(window.isEmpty(options.activitytitle)){
        return Promise.reject('请填写活动标题');
    }else if(options.activitytitle.length > 50){
        return Promise.reject('活动标题字数应该限制在50字以内');
    }
    if(window.isEmpty(options.delaydays)){
        return Promise.reject('请填写延迟天数');
    }else if(isNaN(options.delaydays)){
        return Promise.reject('延迟天数应该是数字');
    }else if(options.delaydays < 0){
        return Promise.reject('延迟天数应该大于0');
    }else if(parseInt(options.delaydays, 10) != options.delaydays){
        return Promise.reject('延迟天数应该是整数');
    }
    if(window.isEmpty(options.linkid)){
        return Promise.reject('请填写链接id');
    }
    if(window.isEmpty(options.bu)){
        return Promise.reject('请填写bu');
    }
    if(window.isEmpty(options.timetype)){
        return Promise.reject('请填写工作性质');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/saveAgentActivty',
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
