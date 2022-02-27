import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method addAgentLink
 *
 @param  {Object} options 请求参数0
    @property  {String} linkname  链接用途 ,
    @property  {String} accumulatedincomepic  累计收益图片 ,
    @property  {String} invitfriendpic  邀请好友图片 ,
    @property  {String} recommendedpic  我的推荐图片 ,
    @property  {String} recommendedstrategypic  推荐攻略图片 ,
    @property  {String} recommendedrulepic  推荐规则图片 ,

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function addAgentLink (options) {
    //数据正确性判断
    if(window.isEmpty(options.linkname)){
        return Promise.reject('请填写链接用途');
    }else if(options.linkname.length > 50){
        return Promise.reject('链接用途字数应该限制在50字以内');
    }
    if(window.isEmpty(options.accumulatedincomepic)){
        return Promise.reject('请填写累计收益图片');
    }
    if(window.isEmpty(options.invitfriendpic)){
        return Promise.reject('请填写邀请好友图片');
    }
    if(window.isEmpty(options.recommendedpic)){
        return Promise.reject('请填写我的推荐图片');
    }
    if(window.isEmpty(options.recommendedstrategypic)){
        return Promise.reject('请填写推荐攻略图片');
    }
    if(window.isEmpty(options.recommendedrulepic)){
        return Promise.reject('请填写推荐规则图片');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/agentLink',
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
