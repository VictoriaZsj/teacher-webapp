import fetch from '@/utils/fetch';
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 * 方法说明 兼职老师相关接口集合
 * @method partTimeTeacherFlowGetTeachers
 * @param  {Object} options 请求参数0
 * @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */

export default function partTimeTeacherFlowGetTeachers (url,options) {
    console.log(options);
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url: url,
            method: 'post',
            data: options
        }).then((result) => {
            const code = result.code;
            const message = result.message;
            const data = result.data;
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