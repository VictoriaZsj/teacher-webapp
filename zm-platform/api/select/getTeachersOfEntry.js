import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 *
 方法说明 获取试用期的老师
 *
 @method getTeachersOfEntry
 *
 @param  {Object} options 请求参数
    @property  {String} readyWeeks	入职周数
    @property  {String} lesCount	课时量
    @property  {String} regularStuCount	正式生数
    @property  {String} testLesCount	测评棵数
    @property  {Int} conversionRate	转化率
    @property  {String} startTrainingTime	培训时间
    @property  {String} endTrainingTime	培训时间
    @property  {String} keyWord 关键字
    @property  {Int} pageNo 页码
    @property  {Int} pageSize 每页个数

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTeachersOfEntry (options) {
    options = getVilidAttrWithEmpty(options);
    if(!window.isEmpty(options.lesCount)){
      if(window.isNaN(options.lesCount)){
        return Promise.reject('课时量必须是数字');
      }
      if(options.lesCount.length > 300){
        return Promise.reject('课时量字数不可大于300');
      }
    }
    if(!window.isEmpty(options.regularStuCount)){
      if(window.isNaN(options.regularStuCount)){
        return Promise.reject('正式生数必须是数字');
      }
      if(options.regularStuCount.length > 300){
        return Promise.reject('正式生数字数不可大于300');
      }
    }
    if(!window.isEmpty(options.testLesCount)){
      if(window.isNaN(options.testLesCount)){
        return Promise.reject('测评棵数必须是数字');
      }
      if(options.testLesCount.length > 300){
        return Promise.reject('测评棵数字数不可大于300');
      }
    }
    if(!window.isEmpty(options.conversionRate)){
      if(window.isNaN(options.conversionRate)){
        return Promise.reject('转化率必须是数字');
      }
      if(options.conversionRate.length > 300){
        return Promise.reject('转化率字数不可大于300');
      }
    }
    if(!window.isEmpty(options.keyWord) && options.keyWord.length > 300){
      return Promise.reject('关键字字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newTryOutController/getTryOutTeachers',
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
