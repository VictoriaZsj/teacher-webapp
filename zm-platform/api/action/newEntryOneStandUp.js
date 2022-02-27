import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量跑单(转正模块)
 *
 @method newEntryOneStandUp
 *
 @param  {Object} options 请求参数
    @property  {String} teaIds 教师ID数组
    @property  {String} reason 跑单原因
    @property  {String} remark 跑单原因备注
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newEntryOneStandUp (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择一个老师');
    }

    if(window.isEmpty(options.reason)){
      return Promise.reject('请选择原因');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 15){
      return Promise.reject('备注字数不可大于15');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newEntry/oneStandUp',
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
