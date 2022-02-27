import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  单个预约培训
 *
 @method appointOneTrainTime
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} remark	备注	string	可选
    @property  {String} trainTime	培训时间	string	必选: 格式 yyyy-MM-dd HH:mm:ss
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function appointOneTrainTime (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.trainTime)){
        return Promise.reject('请选择培训时间');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newInterviewService/appointOneTrainTime',
          method: 'post',
          data: options
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
          }
          else {
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
