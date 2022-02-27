import fetch from '../../../src/utils/fetch'
/**
 *
 方法说明 获取省
 *
 @method getProvinces
 *
 @param  {Object} options 请求参数
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getProvinces () {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/getProvinces',
            method: 'get'
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
