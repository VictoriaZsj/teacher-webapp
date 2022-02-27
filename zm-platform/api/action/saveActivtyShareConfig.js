import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method saveActivtyShareConfig
 *
 @param  {Object} options 请求参数
    @property  {String} id:'',	//活动id
    @property  {String} sharetitle:'',	//分享标题
    @property  {String} shareContent:'',	//分享内容
    @property  {String} sharethumbnail:'',	//缩略图


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function saveActivtyShareConfig (options) {
    //数据正确性判断
    if(window.isEmpty(options.sharetitle)){
        return Promise.reject('请填写分享标题');
    }else if(options.sharetitle.length > 20){
        return Promise.reject('分享标题字数应该限制在20字以内');
    }
    if(window.isEmpty(options.shareContent)){
        return Promise.reject('请填写分享内容');
    }else if(options.shareContent.length > 30){
        return Promise.reject('分享内容的字数应该在30字以内');
    }
    if(window.isEmpty(options.sharethumbnail)){
        return Promise.reject('请填写缩略图');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/saveActivtyShareConfig',
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
