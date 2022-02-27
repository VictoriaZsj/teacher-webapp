import fetch from '../assets/js/fetch'
import {isEmpty} from '../assets/js/assist'


/**
 *
 方法说明 获取年级
 *
 @method getGrade 根据BU获取年级
 *
 @param  {Object} options 无
   bu 可不传

 *
 @return 返回值
 {
   code:1,
   data:{
     children:[ {value: "1", label: "本科"}, {value: "1", label: "本科"}]//字典数据
   },
   message:''
 }
 */
export default function getGrade (option) {
    if(isEmpty(option.bu)){
      return Promise.reject('请传递BU');
    }
    let dic = {
      "dictCode": "GRADE",
      "bizCategory": "common",
      "filterMap":{
        "ZM_BU": option.bu
      }
    }
    let parm = [
      dic
    ];
    return new Promise((resolve, reject) => {
        fetch({
            url:"/api/teachers-mp/api/basicData/cascade",
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
