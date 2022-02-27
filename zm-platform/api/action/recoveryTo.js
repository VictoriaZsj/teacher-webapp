import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 恢复至某状态(单个)
 *
 @method recoveryTo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 恢复至某个状态
    @property  {String} remark 原因
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function recoveryTo (options) {
    //数据正确性判断
    if(typeof options.teaId == 'undefined'){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.state)){
      return Promise.reject('请选择状态');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRecycleController/oneRecoveryTo',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
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
