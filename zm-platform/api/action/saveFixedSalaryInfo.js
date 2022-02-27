import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 恢复至某状态(单个)
 *
 @method saveFixedSalaryInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 恢复至某个状态
    @property  {String} remark 原因
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function saveFixedSalaryInfo (options) {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/fixSalary/saveFixedSalaryInfo',
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
