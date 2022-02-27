import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 *
 方法说明 获取转正的老师
 *
 @method regularList
 *
 @param  {Object} options 请求参数
    @property  {String} timeType 工作性质
    @property  {String} positionType 职位类型
    @property  {String} recommend 排课状态 0-不建议排课，1建议排课
    @property  {String} keyWord 关键词
    @property  {String} teaGoodFirst 第一科目
    @property  {String} positionResultType 职位状态 :6-试用期, 7-转正期, 8-实习期
    @property  {String} rank 档次: 清北, 普通, VIP
    @property  {Int} pageNo 页码
    @property  {Int} pageSize 每页个数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function regularList (options) {
    options = getVilidAttrWithEmpty(options);
    if(!window.isEmpty(options.keyWord) && options.keyWord.length > 300){
      return Promise.reject('关键词字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newRegularController/getRegularTeachers',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                resolve(data);if(!!data){
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
