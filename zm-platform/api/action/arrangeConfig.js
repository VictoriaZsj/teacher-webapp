import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 排课设置
 *
 @method arrangeConfig
 *
 @param  {Object} options 请求参数
    @property  {String} teaIds 教师ID数组
    @property  {String} type 1表示培训管理模块 2表示试用期模块 3正式管理模块
    @property  {bool} offerNoticeFlag Offer通知
    @property  {Int} recommend 1建议排课 0不建议排课
    @property  {Int} lessonCount 排课次数
    @property  {Array[timeList]} timeListStr 排课详细设置数组
        @property  {Int} weekNum 表示周几
        @property  {String} startTime 表示上班时间
        @property  {String} endTime 表示下班时间
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function arrangeConfig (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teaIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    if(window.isEmpty(options.type)){
      return Promise.reject('请传递type参数');
    }
    if(window.isEmpty(options.recommend)){
        return Promise.reject('请设置排课');
    }
    if(options.recommend == 1){
        if(window.isEmpty(options.lessonCount)){
            return Promise.reject('请设置排课次数');
        }else if(isNaN(options.lessonCount)){
            return Promise.reject('排课次数应该是数字');
        }else if(options.lessonCount < 0){
            return Promise.reject('排课次数应该大于0');
        }else if(options.lessonCount >= 100){
            return Promise.reject('排课次数应该小于100');
        }

        if(window.isEmpty(options.timeListStr)){
            return Promise.reject('请设置排课时间');
        }
        let len = options.timeListStr.length;
        if(len == 0){
            return Promise.reject('请设置排课时间');
        }
        if(len > 7){
            return Promise.reject('上班班次最多为7次');
        }
        let item = null;
        let isHaveNull = false;//是否含有null值
        let isHaveRepeat = false;//是否含有重复值
        let weekNumStr = "";
        for(let i = 0; i < len; i++){
          item = options.timeListStr[i];
          if(weekNumStr.indexOf(item.weekNum) != -1){
            isHaveRepeat = true;
          }
          if(!item.endTime || !item.startTime || !item.weekNum){
            isHaveNull = true;
          }
          weekNumStr = weekNumStr + item.weekNum;
        }
        if(isHaveNull){
          return Promise.reject('请将上班班次填写完整');
        }
        if(isHaveRepeat){
          return Promise.reject('上班班次日期不可重复');
        }
    }else{
      options.timeListStr = [];
    }
    let url = "";
    switch (options.type) {
      case "1":
          url = "/api/newTrainController/multiArrangeConfig";
        break;
      case "2":
          url = "/api/newTryOutController/multiArrangeConfig";
        break;
      case "3":
          url = "/api/newRegularController/multiArrangeConfig";
        break;
      case "4":
          url = "/api/newEntry/multiArrangeConfig";
        break;
      default:

    }
    let parm = {};
    Object.assign(parm,options);
    if(parm.offerNoticeFlag == "1"){
      parm.offerNoticeFlag = true;
    }else{
      parm.offerNoticeFlag = false;
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: url,
          method: 'post',
          data: parm
        }).then((result) => {
          const code = result.code;
          const message = result.message;
          const data = result.data;
          if (code == 0) {
            let _data = {
              data:data,
              message:message
            }
            resolve(_data);
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
