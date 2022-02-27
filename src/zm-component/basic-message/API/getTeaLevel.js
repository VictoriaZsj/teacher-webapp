import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取讲师等级
 *
 @method getTeaLevel
 *
 @param  {Object} options
    @property  {String} bu BU 可不传
    @property  {String} timeType 对应工作性质 可不传
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
export default function getTeaLevel (option) {
    if(isEmpty(option.bu)){
      return Promise.reject('请传递BU');
    }
    if(isEmpty(option.timeType)){
      return Promise.reject('请传递工作性质');
    }
    let parm = {
      $ZM_BU:option.bu,
      $TEACHER_ORIGIN:option.timeType
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:"/api/teachers-mp/api/basicData/cascade/BU_TEACHE_LEVEL_1",
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
