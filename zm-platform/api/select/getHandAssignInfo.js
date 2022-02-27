import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 *
 方法说明 获取待分配名单书
 *
 @method getHandAssignInfo
 *
 @param  {Object} options 请求参数
    @property  {Array} teacherIds 教师ID数组
    @property  {Array} bu bu数组
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getHandAssignInfo (options) {
    if(Object.prototype.toString.call(options.teacherIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teacherIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(Object.prototype.toString.call(options.bu) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.bu.length == 0){
        return Promise.reject('请至少选择一个BU类型');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/1.0.0/unAssign/getHandAssignInfo',
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
