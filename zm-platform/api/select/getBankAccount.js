import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
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
export default function getBankAccount (options) {
    if(window.isEmpty(options.mobile)){
        return Promise.reject('请传递手机号');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/agentMember/findBankByMobile',
            method: 'get',
            params:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
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
