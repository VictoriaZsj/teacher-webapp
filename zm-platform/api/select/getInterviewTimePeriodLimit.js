
import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明 查询招师跟进记录
 *
 @method getFollowUpLogs
 *
 @param  {Object} options 请求参数
 @property  {Array} teacherIds 教师ID数组
 @property  {Array} bu bu数组
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getInterviewTimePeriodLimit (options) {
  return new Promise((resolve, reject) => {
    fetch({
      url:'/api/appointLimit/appointInterviewTimePeriodLimit',
      method: 'post',
      data: options,
    }).then((res) => {
      const { code, data, message } = res;
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
