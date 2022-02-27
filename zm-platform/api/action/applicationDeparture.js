import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 申请离职
 *
 @method applicationDeparture
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {timestamp} applyTime 申请时间
    @property  {timestamp} leaveTime 离职时间
    @property  {String} reason 原因
    @property  {String} mark 备注
    @property  {String} leaveState 当时状态
    @property  {String} type  2表示试用期模块 3表示转正模块

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function applicationDeparture (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请传递教师唯一标志');
    }
    if(window.isEmpty(options.type)){
        return Promise.reject('请传递type参数');
    }else if(options.type != "2" && options.type != "3"){
      return Promise.reject('type参数传递不正确');
    }
    if(window.isEmpty(options.applyTime)){
        return Promise.reject('请选择申请时间');
    }
    if(window.isEmpty(options.leaveTime)){
        return Promise.reject('请选择离职时间');
    }
    if(window.isEmpty(options.reason)){
        return Promise.reject('请选择原因');
    }
    if(!window.isEmpty(options.mark) && options.mark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }
    let url = "";
    switch (options.type) {
      case "2":
        url = "/api/newTryOutController/oneFarFarAway";
        break;
      case "3":
        url = "/api/newRegularController/oneFarFarAway";
        break;
      default:

    }
    return new Promise((resolve, reject) => {
        fetch({
          url: url,
          method: 'post',
          data: {
            leaveReason:options.reason,
            leaveState:options.leaveState,
            leaveTime:new Date(options.leaveTime).getTime(),
            remark:options.mark,
            submitLeaveTime:new Date(options.applyTime).getTime(),
            teaId:options.teaId
          }
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
