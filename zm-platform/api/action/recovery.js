import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 恢复至某状态(批量)
 *
 @method recovery
 *
 @param  {Object} options 请求参数
    @property  {Array} teaIds 教师ID数组
    @property  {Array} state 恢复至某个状态
    @property  {Array} remark 原因
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function recovery (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teaIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.state)){
      return Promise.reject('请选择状态');
    }
    if(!window.isEmpty(options.remark) && options.reason.remark > 300){
      return Promise.reject('备注字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRecycleController/multiRecoveryTo',
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
