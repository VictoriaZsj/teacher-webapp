import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取可以恢复至哪里
 *
 @method getChildPreviewImgUrl
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getChildPreviewImgUrl (options) {
    if(window.isEmpty(options.id)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/encrypt',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            console.log(result);
            if (result.code === '0') {
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
