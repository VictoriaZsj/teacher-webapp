

/**
 *
 方法说明 入职资料文件一键导出
 *
 @method downloadTeacherFilesZip
 *
 @param  {Object} options 请求参数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function downloadTeacherFilesZip (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newEntry/downloadTeacherFilesZip"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
