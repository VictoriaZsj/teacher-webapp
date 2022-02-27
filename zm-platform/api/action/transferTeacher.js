import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量移交老师
 *
 @method transferTeacher
 *
 @param  {Object} options 请求参数
    @property  {Array} teacherIds 教师ID数组
    @property  {String} toCommissionerId 移交人ID
    @property  {Int} transferReasonType 移交原因类型
    @property  {Int} transferBu 移交至哪个bu
    @property  {Int} transferStatus 移交状态
    @property  {Int} transferOtherReason 其他原因

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function transferTeacher (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teacherIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teacherIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.toCommissionerId)){
        return Promise.reject('请选择移交人');
    }
    if(window.isEmpty(options.transferReasonType)){
        return Promise.reject('请选择移交原因');
    }
    // if(window.isEmpty(options.transferBu)){
    //     return Promise.reject('请选择移交至');
    // }
    // if(window.isEmpty(options.transferStatus)){
    //     return Promise.reject('请选择移交状态');
    // }
    let parm = {};
    Object.assign(parm,options);
    delete parm.transferStatus;
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/reserve/transferTeacher',
          method: 'post',
          data: parm
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
