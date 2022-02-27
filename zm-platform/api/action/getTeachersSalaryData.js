import fetch from '../../../src/utils/fetch';
import {getVilidAttrWithEmpty} from '../../../src/utils/assist';

/**
 *
 方法说明 恢复至某状态(单个)
 *
 @method getFixedSalaryTeachers
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 恢复至某个状态
    @property  {String} remark 原因
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTrainTeachersSalary (options) {
    let url = '';
    if (options.type == 'pre_training') { // 面试管理
      url = '/api/fixSalary/interview/getFixedSalaryTeachers';
    } else if (options.type == 'bef_int') { // 培训管理
      url = '/api/fixSalary/train/getFixedSalaryTeachers';
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => { 
        fetch({
            url: url,
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                resolve(data);
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
