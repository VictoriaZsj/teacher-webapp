import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取市
 *
 @method getCitys
 *
 @param  {Object} options 请求参数
    @property  {String} provinceId 省ID
 *
 @return 返回数据
 {
   code:1,
   data:[ {value: "3", label: "北京"}, {value: "2", label: "上海"}]//字典数据,
   message:''
 }
 */
export default function getCitys (options) {
    if(isEmpty(options.provinceId)){
        return Promise.reject('请选择省份');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/basicData/getCitys',
            method: 'get',
            params:options,
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
