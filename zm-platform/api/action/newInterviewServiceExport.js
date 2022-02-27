

/**
 *
 方法说明 面试管理导出
 *
 @method newInterviewServiceExport
 *
 @param  {Object} options 请求参数
     @property  {String} testStatus 笔试状态 1-未提交, 2-已提交
     @property  {String} communicateResult 沟通结果
     @property  {String} interviewState 老师状态 0-待预约, 1-待面试, 10-待二面, 11-面试缺席, 2-待预约培训, 20-待培训通知, 21-培训延期, 22-培训缺席
     @property  {String} timeType 工作性质 1-全职, 2-校招全职
     @property  {String} grade 报名年级 0-小学, 1-初中, 2-高中
     @property  {String} subject 报名科目 0-语文, 1-数学, 2-英语, 3-政治, 4-历史, 5-地理, 6-物理, 7-化学, 8-生物, 9-科学, 10-奥数, 11-文综, 12-理综
     @property  {String} startTrainTime 培训开始时间
     @property  {String} endTrainTime 培训结束时间
     @property  {String} startApplyTime 报名开始时间
     @property  {String} endApplyTime 报名结束时间
     @property  {String} startInterviewTime 面试开始时间
     @property  {String} endInterviewTime 面试结束时间
     @property  {String} keyWord 关键字
     @property  {String} QQ QQ
     @property  {String} trianNo 培训主题
     @property  {String} followPerson 跟进人
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newInterviewServiceExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newInterviewService/export"+encodeURI(window.toParams(options));
    window.open(url, '_blank');
}
