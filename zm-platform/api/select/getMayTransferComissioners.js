import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取可以移交的人员名单
 *
 @method getMayTransferComissioners
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getMayTransferComissioners () {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/reserve/getMayTransferComissioners',
            method: 'get'
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(Object.prototype.toString.call(data) === '[object Array]' && data.length > 0){
                    resolve(data);
                }else{
                    reject("暂无可移交人员");
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
