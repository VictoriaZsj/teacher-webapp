

/**
 *
 方法说明 试用期管理导出
 *
 @method newTryOutControllerExport
 *
 @param  {Object} options 请求参数
     @property  {String} readyWeeks	入职周数
     @property  {String} lesCount	课时量
     @property  {String} regularStuCount	正式生数
     @property  {String} testLessonCount	测评棵数
     @property  {Int} conversionRate	转化率
     @property  {String} trainingTime	培训时间
     @property  {String} keyWord 关键字
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newTryOutControllerExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newTryOutController/export"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
