import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  释放账号(单个)
 *
 @method oneReleaseTeacher
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID数组
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function oneReleaseTeacher (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newRecycleController/oneReleaseTeacher',
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
