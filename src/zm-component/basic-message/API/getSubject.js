import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取第一 第二擅长科目
 *
 @method getSubject
 *
 @param  {Object} options
    @property  {String} bu BU 可不传
    @property  {String} phase 对应学段值 可不传
    @property  {String} type grade表示获取年级类型的擅长科目 phase表示获取学段类型的擅长科目 可不传
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
export default function getSubject (option) {
    let dic = {
      "dictCode": "BASIC_SUBJECTS",
    }
    if(isEmpty(option.bu) == false){
      dic.bizCategory = "common";
      dic.filterMap = {
        "ZM_BU": option.bu
      }
      if(!!option.phase){
        if(!!option.type && option.type == "grade"){
          dic["filterMap"].GRADE = option.phase;
        }else{
          dic["filterMap"].PHASE = option.phase;
        }
      }
    }
    let parm = [
      dic
    ]
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
