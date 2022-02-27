

/**
 *
 方法说明 转正管理导出
 *
 @method newRegularControllerExport
 *
 @param  {Object} options 请求参数
     @property  {String} timeType 工作性质
     @property  {String} positionType 职位类型
     @property  {String} teaLevel 档次
     @property  {String} recommend 排课状态 0-不建议排课，1建议排课
     @property  {String} keyWord 关键词
     @property  {String} teaGoodFirst 第一科目
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function newRegularControllerExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/newRegularController/export"+encodeURI(window.toParams(options));
    console.log("url:",url);
    window.open(url, '_blank');
}
