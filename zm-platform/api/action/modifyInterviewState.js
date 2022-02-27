import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改状态
 *
 @method modifyInterviewState
 *
 @param  {Object} options 请求参数
    @property  {Array} teaIds 教师ID数组
    @property  {Int} state 必选: 0-待预约, 1-待面试, 10-待二面, 11-面试缺席, 2-待预约培训, 20-待培训通知, 21-培训延期, 22-培训缺席
    @property  {String} remark 跑单至小班课: 所选年级
    @property  {int} type 0表示面试模块 1表示培训模块 2表示试用期模块 3表示转正模块 4回收站模块
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function modifyInterviewState (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teaIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.state)){
        return Promise.reject('请选择老师状态');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }
    let url = "";
    switch (options.type) {
      case "0":
          url = "/api/newInterviewService/modifyInterviewState";
        break;
      case "1":
          url = "/api/newTrainController/modifyTrainState";
        break;
      case "2":
          url = "/api/newTryOutController/modifyTryOutState";
        break;
      case "3":
          url = "/api/newRegularController/modifyRegularState";
        break;
      case "4":
          url = "/api/newRecycleController/modifyRecycleState";
        break;
      case "5":
          url = "/api/newEntry/modifyEntryState";
        break;
      default:

    }
    return new Promise((resolve, reject) => {
        fetch({
          url: url,
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
