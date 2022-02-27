import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 单个跑单(培训模块)
 *
 @method oneStandUp
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} reason 跑单原因 必选: 20-个人介绍不通过
    @property  {String} remark 跑单原因备注
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function oneStandUp (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.reason)){
      return Promise.reject('请选择跑单原因');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 15){
      return Promise.reject('备注字数不可大于15');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newTrainController/oneStandUp',
          method: 'post',
          data: options
        }).then((result) => {
          const code = result.code;
          const message = result.message;
          const data = result.data;
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
