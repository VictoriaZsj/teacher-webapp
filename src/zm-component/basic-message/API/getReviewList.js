import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明
 *
 @method getReviewList
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回数据
 {
   code:1,
   data:[
     {
       createdAt:'',//操作时间
       optUserName:'',//审核人
       result:'',//审核结果
       remark:'',//备注
     }
   ],
   message:''
 }
 */
export default function getReviewList (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/PersonalInfo/getRecordAuditingInfo',
            method: 'get',
            params:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if (!!data) {
                    resolve(data);
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
