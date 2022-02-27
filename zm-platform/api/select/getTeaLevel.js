import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明 获取学段字典
 *
 @method getTeaLevel
 *



 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTeaLevel (option) {
    let parm = {
      "$ZM_BU": option.bu,
      "$TEACHER_ORIGIN":option.TEACHER_ORIGIN
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:"/api/cascade/dict/service/BU_TEACHE_LEVEL_1",
            method: 'post',
            data:parm,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                resolve(data);
            } else {
                reject(message || '获取学段字典失败');
            }
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err || '获取学段字典失败');
        });
    });
}
