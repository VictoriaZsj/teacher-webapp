import fetch from '../assets/js/fetch'
/**
 *
 方法说明 获取省
 *
 @method getProvinces
 *
 @param  {Object} options 无
 *
 @return 返回数据
 {
   code:1,
   data:[ {value: "3", label: "北京"}, {value: "2", label: "上海"}]//字典数据,
   message:''
 }
 */
export default function getProvinces () {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/basicData/getProvinces',
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
