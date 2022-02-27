import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明 取消实名认证
 *
 @method cancelTeacherRealName
 *
 @param  {Object} options 请求参数
    @property  {string} teaId (integer, optional): 老师id ,
    @property  {string} remark (integer, optional): 备注

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function cancelTeacherRealName (options) {
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/cancelTeacherRealName',
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
