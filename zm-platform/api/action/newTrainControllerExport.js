

/**
 *
 方法说明 培训管理导出
 *
 @method newTrainControllerExport
 *
 @param  {Object} options 请求参数
     @property  {int} infoState 完善资料 可选: 0-否, 1-是
     @property  {int} trainResultType 培训结果 可选: 1-未反馈, 2-培训通过, 3-培训延期, 4-培训延期 (暂时)
     @property  {int} offerState offer状态 可选: 0-未发, 1-已发
     @property  {int} timeType 工作性质 可选: 1-全职, 2-公校全职
     @property  {int} recommendState 排课状态 可选: 0-不建议排课, 1-建议排课
     @property  {int} teacherState 老师状态 可选: 3-待入库, 30-待offer, 4-待入职
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newTrainControllerExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newTrainController/export"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
