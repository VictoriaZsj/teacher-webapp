import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method updateActivtyState
 *
 @param  {Object} options 请求参数0
    @property  {String} id  活动id
    @property  {String} status  活动状态 0未开始，1进行中，2已结束，3已关闭

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function updateActivtyState (options) {
    //数据正确性判断
    if(window.isEmpty(options.id)){
        return Promise.reject('请填写活动id');
    }
    if(window.isEmpty(options.status)){
        return Promise.reject('请填写活动状态');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/updateActivtyState',
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
