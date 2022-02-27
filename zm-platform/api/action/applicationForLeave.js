import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  单个预约培训
 *
 @method applicationForLeave
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} leaveReason	离职原因
    @property  {Array} conditionList	学生学习情况
      @property  {String} studentId	学生ID
      @property  {String} studentCondition	学生学习情况
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function applicationForLeave (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.leaveReason)){
        return Promise.reject('请填写离职原因');
    }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newLeave/newApplicationForLeave',
          method: 'post',
          data: options
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(result);
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
