import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取预约科目(根据bu sub phase查询预约科目)
 *
 @method getAppointmentSubject
 *
 @param  {Object} options 参数
    bu 老师所属
    sub 第一擅长科目
    phase 表示年级偏好 可不传
    type grade表示年级预约科目 phase表示查询学段预约科目 可不传

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
export default function getAppointmentSubject (option) {
    if(isEmpty(option.bu)){
      return Promise.reject('请传递BU');
    }
    if(isEmpty(option.sub)){
      return Promise.reject('请传递科目');
    }
    let dic = {
        "bizCategory": "common",
        "dictCode": "RESERVATIONS_COURSE",
        "filterMap": {
            "ZM_BU": option.bu,
            "BASIC_SUBJECTS": option.sub
        }
    };
    if(!!option.phase){
      if(!!option.type && option.type == "grade"){
        dic["filterMap"].GRADE = option.phase;
      }else{
        dic["filterMap"].PHASE = option.phase;
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
