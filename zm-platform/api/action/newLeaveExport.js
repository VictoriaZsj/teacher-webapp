

/**
 *
 方法说明 试用期管理导出
 *
 @method newLeaveExport
 *
 @param  {Object} options 请求参数
     @property  {String} bu	bu
     @property  {String} state	离职状态
     @property  {String} content 关键字
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newLeaveExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newLeave/export"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
