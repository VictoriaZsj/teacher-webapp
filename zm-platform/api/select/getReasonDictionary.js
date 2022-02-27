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
export default function getReasonDictionary (options) {
    if(window.isEmpty(options.groupCode)){
        return Promise.reject('请输入获取的数据类型');
    }
    let reasonUrl = `/api/dict/getInnerEnumDict`;
    if (options.reasonType && options.reasonType === 'partTimeReason') {
      reasonUrl = '/api/zm-teacher-recruit-web/biz/common/getPartInnerEnumDict';
    }
    return new Promise((resolve, reject) => {
        fetch({
            url: reasonUrl,
            method: 'get',
            params: options,
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
