import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  批量预约培训
 *
 @method entryMultiSignContract
 *
 @param  {Object} options 请求参数
 @property  {String} teaIds 教师ID
 @property  {String} remark	备注	string	可选
 @property  {String} trainTime	培训时间	string	必选: 格式 yyyy-MM-dd HH:mm:ss
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function entryMultiSignContract (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newEntry/multiSignContract',
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
