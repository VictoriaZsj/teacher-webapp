import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 获取入职资料审核记录
 *
 @method getAuditRecords
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回数据
 {
   code:1,
   data:[
     {
       opreateTime:'',//操作时间
       opreateName:'',//审核人
       opreateResult:'',//审核结果
       remark:'',//备注
     }
   ],
   message:''
 }
 */
export default function getAuditRecords (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newEntry/getAuditRecords',
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
