import fetch from '../../../src/utils/fetch';
const config = require('../../../config');
const BASE_URL = process.env.NODE_ENV === "development"
    ? config.dev.subjectPath
    :config.build.subjectPath;

/**
 *
 方法说明 获取薪资列表
 *
 @method getGradeHobby
 *
 @param  {Object} options 无


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getGradeHobby (option) {

    let parm = [
        {
            "bizCategory": "common",
            "dictCode": "GRADE",
            "filterMap": {

            }
        }
    ];
    if(!!option.phase){
      parm[0]["filterMap"].PHASE = option.phase;
    }
    if(option.bu){
      parm[0]["filterMap"].ZM_BU = option.bu;
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:"/api/cascade/dict/service",
            method: 'post',
            data:parm,
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
