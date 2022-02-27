import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取回收站的老师
 *
 @method getRecycleTeachers
 *
 @param  {Object} options 请求参数
    @property  {String} recycleReasonType 原因类型
    @property  {Int} blackName 是否黑名单
    @property  {String} keyword 关键字
    @property  {Int} pageNo 页码
    @property  {Int} pageSize 每页个数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getRecycleTeachers (options) {
    options = getVilidAttrWithEmpty(options);
    if(!window.isEmpty(options.keyWord) && options.keyWord.length > 300){
      return Promise.reject('关键字字数不可大于300');
    }
    if(!window.isEmpty(options.operatorName) && options.operatorName.length > 300){
      return Promise.reject('操作者字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRecycleController/getRecycleTeachers',
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
