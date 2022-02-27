import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  添加转正结果
 *
 @method changeToRegular
 *
 @param  {Object} options 请求参数
    @property  {Array} teaIds 教师ID数组
    @property  {Array} state	1转正，0延期
    @property  {Array} mark	备注
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function changeToRegular (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaIds)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.state)){
        return Promise.reject('请选择转正结果');
    }else if(isNaN(options.state)){
      return Promise.reject('转正结果参数应该是数字');
    }
    if(!window.isEmpty(options.mark) && options.mark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newTryOutController/multiChangeToRegular',
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
