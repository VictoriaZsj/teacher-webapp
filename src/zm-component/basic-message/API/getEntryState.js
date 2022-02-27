import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

 /**
  *
  方法说明 获取教师入职资料提交审核状态
  *
  @method getEntryState
  *
  @param  {Object} options 请求参数
     @property  {String} teaId 教师ID
  *
  @return 返回数据
  {
    code:1,
    data:{
      entryState:'',//审核状态 0待提交，1待审核，2审核通过，3审核不通过
      entryMaterialProblem:'',//如果是审核不通过这里存放不通过原因
      entryRemark:''审核备注
    },
    message:''
  }
  */
export default function getEntryState (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teacher-web/api/newEntry/getEntryState',
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
