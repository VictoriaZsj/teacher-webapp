import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取培训主题
 *
 @method getTrainTopic
 *
 @param  {Object} options 请求参数
    @property  {String} startTrainTime 培训日期
    @property  {String} endTrainTime 培训日期
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTrainTopic (options) {
    if(window.isEmpty(options.startTrainTime)){
        return Promise.reject('请传递开始日期');
    }
    if(window.isEmpty(options.endTrainTime)){
        return Promise.reject('请传递结束日期');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newInterviewService/getTrainTopic',
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
