import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取培训管理的老师
 *
 @method getTrainTeachers
 *
 @param  {Object} options 请求参数
    @property  {int} infoState 完善资料 可选: 0-否, 1-是
    @property  {int} trainResultType 培训结果 可选: 1-未反馈, 2-培训通过, 3-培训延期, 4-培训延期 (暂时)
    @property  {int} offerState offer状态 可选: 0-未发, 1-已发
    @property  {int} timeType 工作性质 可选: 1-全职, 2-公校全职
    @property  {int} recommendState 排课状态 可选: 0-不建议排课, 1-建议排课
    @property  {int} teacherState 老师状态 可选: 3-待入库, 30-待offer, 4-待入职
    @property  {String} startTrainTime:'',	//培训开始时间	string	可选: 格式: yyyy-MM-dd HH:mm:ss
    @property  {String} endTrainTime:'',
    @property  {String} trainTheme:'',	//培训主题	string	可选:
    @property  {String} grade:'',	//字典年级	number	可选:
    @property  {String} subject:'',	//字典科目	number	可选:
    @property  {String} followPerson:'',	//跟进人
    @property  {int} keyWord 关键字
    @property  {Int} pageNo 页码
    @property  {Int} pageSize 每页个数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTrainTeachers (options) {
  options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newTrainController/getTrainTeachers',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    resolve(data);
                }else{
                    reject("数据不存在");
                }
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
