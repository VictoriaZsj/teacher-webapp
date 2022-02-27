import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取某个老师的排课设置信息
 *
 @method getArrangeConfigByTeaId
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getArrangeConfigByTeaId (options) {
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    let url = "/api/newTrainController/getArrangeConfigByTeaId";
    if(options.type == '4'){
      url = "/api/newEntry/getArrangeConfigByTeaId";
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:url,
            method: 'POST',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    if(data.recommend != 1 && data.recommend != 0){
                      reject("返回数据不规范");
                    }else if(isNaN(data.lessonCount)){
                      reject("返回数据不规范");
                    }else if(isRegularData(data.timeListStr) == false){
                      reject("返回数据不规范");
                    }else{
                      resolve(data);
                    }
                }else{
                    reject("该用户尚未设置初始排课信息");
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

function isRegularData(data){
  let isRegular = true;
  let item = null;
  for(let i = 0; i < data.length; i++){
    item = data[i];
    if(item.weekNum != 1 && item.weekNum != 2 && item.weekNum != 3 && item.weekNum != 4 && item.weekNum != 5 && item.weekNum != 6 && item.weekNum != 7){
      isRegular = false;
      break;
    }
    if(item.startTime != '08:00' && item.startTime != '09:00' && item.startTime != '10:00' && item.startTime != '11:00' && item.startTime != '12:00' ){
      isRegular = false;
      break;
    }
    if(item.endTime != '18:00' && item.endTime != '19:00' && item.endTime != '20:00' && item.endTime != '21:00' && item.endTime != '22:00' ){
      isRegular = false;
      break;
    }
  }
}
