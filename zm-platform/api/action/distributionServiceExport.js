

/**
 *
 方法说明 面试管理导出
 *
 @method distributionServiceExport
 *
 @param  {Object} options 请求参数
     @property  {String} testStatus 笔试状态 1-未提交, 2-已提交
     @property  {String} timeType 工作性质 1-全职, 2-校招全职
     @property  {String} grade 报名年级 0-小学, 1-初中, 2-高中
     @property  {String} subject 报名科目 0-语文, 1-数学, 2-英语, 3-政治, 4-历史, 5-地理, 6-物理, 7-化学, 8-生物, 9-科学, 10-奥数, 11-文综, 12-理综
     @property  {String} keyWord 关键字
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function distributionServiceExport (options) {
    delete options["pageNo"];
    delete options["pageSize"];
    let url = "/api/teacher-web/api/1.0.0/unAssign/export" + encodeURI(window.toParams(options));
    console.log("url:", url);
    window.open(url, '_blank');
}
