import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取教师简介
 *
 @method getLeaveTeachers
 *
 @param  {Object} options 请求参数

    @property  {String} bu (integer, optional): 部门 ,
    @property  {String} content (string, optional): 关键词 ,
    @property  {String} pageNo (integer, optional),
    @property  {String} pageSize (integer, optional),
    @property  {String} state (integer, optional): 状态
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getLeaveTeachers (options) {

    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newLeave/getLeaveTeachers',
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
