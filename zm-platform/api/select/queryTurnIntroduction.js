import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取教师移交记录
 *
 @method getTurnIntroduction
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTurnIntroduction (options) {

    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url: '/api/zm-teacher-recruit-web/api/turnIntroduction/query',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 200) {
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
