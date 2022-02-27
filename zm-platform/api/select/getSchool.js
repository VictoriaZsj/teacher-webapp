import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明 获取学段字典
 *
 @method getSchool
 *
 @param  {Object} options 无


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getSchool (data) {
    let _parm;
    if(data&&data.page&&data.page == "config_person"){
        _parm = data.params
    }else{
        _parm = [];
        let parm = {
          "dictCode": "UNIVERSITIES",
        }
        _parm.push(parm); 
    };
    return new Promise((resolve, reject) => {
        fetch({
            url:"/api/cascade/dict/service",
            method: 'post',
            data:_parm,
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
