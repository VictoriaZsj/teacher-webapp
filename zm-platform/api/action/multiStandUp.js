import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量跑单(培训模块)
 *
 @method multiStandUp
 *
 @param  {Object} options 请求参数
    @property  {String} teaIds 教师ID数组
    @property  {String} reason 跑单原因 20-个人介绍不通过
    @property  {String} remark 跑单原因备注
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function multiStandUp (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teaIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.reason)){
      return Promise.reject('请选择跑单原因');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 15){
      return Promise.reject('备注字数不可大于15');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newTrainController/multiStandUp',
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
