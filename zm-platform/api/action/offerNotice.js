import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 单个offer通知
 *
 @method offerNotice
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function offerNotice (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url: '/api/newTrainController/oneOfferNotice',
            method: 'post',
            data: options
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                resolve(data,message);
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
