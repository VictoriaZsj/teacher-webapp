import fetch from '../../../src/utils/fetch';
/**
 *
 方法说明 获根据手机号获取银行信息
 *
 @method getBankAccount
 *
 @param  {Object} options 请求参数
    @property  {String} mobile 手机号
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getNumType (options) {
    if(window.isEmpty(options)){
        return Promise.reject('请输入获取的数据类型');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url: `/api/newInterviewService/getMum`,
            method: 'post',
            data
        }).then((res) => {
            const { code, data, message } = res;
            if (code == 0) {
                if(data !== null || data !== ''){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
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
