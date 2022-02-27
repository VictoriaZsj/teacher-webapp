import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取全部字典
 *
 @method getAllDic
 *
 @param  {Object} options 无

 *
 @return 返回值
 {
   code:1,
   data:[{
     nodeCode//字典类别
     nodeName//字典名称
     options:[ {value: "1", label: "本科"}, {value: "1", label: "本科"}]//字典数据     
   }],
   message:''
 }
 */
export default function getAllDic () {
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/basicData/getAllDic',
            method: 'get',
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
