import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取培训主题
 *
 @method getTextVersion
 *
 @param  {Object} options 请求参数
    @property  {String} grade 培训日期
    @property  {String} endTrainTime 培训日期
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTextVersion (options) {
    if(window.isEmpty(options.bu)){
        return Promise.reject('请传递教师BU');
    }
    if(window.isEmpty(options.grade)){
        return Promise.reject('请传递年级');
    }
    if(window.isEmpty(options.subject)){
        return Promise.reject('请传递科目');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newLeave/getTextVersion',
            method: 'post',
            data:options,
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
