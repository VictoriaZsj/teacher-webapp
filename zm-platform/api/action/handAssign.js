import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量移出黑名单
 *
 @method handAssign
 *
 @param  {Object} options 请求参数
    @property  {Array} teacherIds 教师ID数组
    @property  {Array} assginInfo 待分配名单

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function handAssign (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teacherIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teacherIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(Object.prototype.toString.call(options.assginInfo) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.assginInfo.length == 0){
        return Promise.reject('请至少选择带分配名单');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/1.0.0/unAssign/handAssign',
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
