

/**
 *
 方法说明 回收站管理导出
 *
 @method newRecycleControllerExport
 *
 @param  {Object} options 请求参数
     @property  {String} recycleReasonType 原因类型
     @property  {Int} blackName 是否黑名单
     @property  {String} keyword 关键字
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newRecycleControllerExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = " /api/newEntry/export"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
