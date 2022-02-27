import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量移出黑名单
 *
 @method notHeadmaster
 *
 @param  {Object} options 请求参数
    @property  {string} stuId (integer, optional): 学生id ,
    @property  {string} teaId (integer, optional): 老师id

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function notHeadmaster (options) {
  if(window.isEmpty(options.teaId)){
      return Promise.reject('请选择教师');
  }
  if(window.isEmpty(options.stuId)){
      return Promise.reject('请选择学生');
  }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newLeave/notHeadmaster',
          method: 'post',
          data: options
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
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
