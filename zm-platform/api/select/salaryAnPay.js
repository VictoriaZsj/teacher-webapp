import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取教师薪资与支付信息
 *
 @method salaryAnPay
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function salaryAnPay (options) {
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teacherInfo/salaryAnPay',
            method: 'get',
            params:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    //异常值处理
                    if(data.teaBu != "3"){
                      if(data.positionType != 1 && data.positionType != 2){
                        data.positionType = null;
                      }
                    }

                    data.bankProvinceEmpty = !!data.bankProvince;
                    data.bankCityEmpty = !!data.bankCity;
                    data.bankNameEmpty = !!data.bankName;
                    data.bankBranchEmpty = !!data.bankBranch;
                    data.bankAccountEmpty = !!data.bankAccount;
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
