import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量跑单(面试管理)
 *
 @method batchStandUp
 *
 @param  {Object} options 请求参数
    @property  {Array} teacherIds 教师ID数组
    @property  {String} reason 跑单原因
    @property  {String} remark 跑单原因备注
    @property  {String} smallGrade 跑单至小班课: 所选年级
    @property  {String} smallSubject 跑单至小班课: 所选科目
    @property  {String} standUpToType 跑单至哪里
    @property  {String} timeType 求职类型 0-兼职(默认选择), 1-全职
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function batchStandUp (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teacherIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teacherIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.standUpToType)){
      return Promise.reject('请选择跑单类型');
    }
    if(options.standUpToType == 102){
      if(window.isEmpty(options.reason)){
        return Promise.reject('请选择跑单原因');
      }
    }
    if(options.standUpToType == 105){
      if(window.isEmpty(options.smallGrade)){
        return Promise.reject('请选择小班课年级');
      }
      if(window.isEmpty(options.smallSubject)){
        return Promise.reject('请选择小班课科目');
      }
      if(window.isEmpty(options.timeType)){
        return Promise.reject('请选择小班课求职类型');
      }
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 15){
      return Promise.reject('备注字数不可大于15');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/newInterviewService/multiStandUp',
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
