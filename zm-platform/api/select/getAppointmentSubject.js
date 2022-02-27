import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明 获取薪资列表
 *
 @method getAppointmentSubject
 *
 @param  {Object} options 无


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getAppointmentSubject (option) {
    let dic = {
        "bizCategory": "common",
        "dictCode": "RESERVATIONS_COURSE",
        "filterMap": {
            "ZM_BU": option.bu,
            "BASIC_SUBJECTS": option.sub
        }
    };
    if(!!option.phase){
      dic["filterMap"].PHASE = option.phase;
    }
    let parm = [
        dic
    ];
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
