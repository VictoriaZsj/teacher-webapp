import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  删除代理
 *
 @method entryOneSignContract
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function setReleaseConfig (options) {
    return new Promise((resolve, reject) => {
        fetch({
            url: '/api/releaseConfig/save',
            method: 'post',
            data: options
        }).then((res) => {
            const { code, message } = res
            if (code == 0) {
                resolve(message);
            }
            else {
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
