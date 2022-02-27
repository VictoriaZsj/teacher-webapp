import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 获取教师薪资与支付信息
 *
 @method getSalaryInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return 返回值
  {
    code:1,
    data:{
      rating//讲师等级
      teaRank//老师档次
      positionType//职位类型
      monthSalary//基本薪资
      payroll//基本薪资
      bankProvince//开户省
      bankCity//开户市
      bankName//开户银行
      bankBranch//银行支行
      bankAccount//银行账号
      alipayAccount//支付宝号
      remark//备注信息
    },
    message:''
  }
 */
export default function getSalaryInfo (options) {
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/teachers-mp/api/PersonalInfo/getSalaryInfo',
            method: 'get',
            params:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                if(!!data){
                    //异常值处理
                    // if(data.teaBu != "3"){
                    //   if(data.positionType != 1 && data.positionType != 2){
                    //     data.positionType = null;
                    //   }
                    //   if(data.monthSalary != 1200 && data.monthSalary != 3200 && data.monthSalary != 3600 && data.monthSalary != 4000 && data.monthSalary != 4400 && data.monthSalary != 4800 && data.monthSalary != 5200 && data.monthSalary != 5600 && data.monthSalary != 6000 && data.monthSalary != 6400 && data.monthSalary != 6800){
                    //     data.monthSalary = null;
                    //   }
                    // }

                    if(isEmpty(data.rating)){
                      data.rating = "";
                    }
                    if(isEmpty(data.bankProvince)){
                      data.bankProvince = "";
                    }
                    if(isEmpty(data.bankCity)){
                      data.bankCity = "";
                    }
                    if(isEmpty(data.bankName)){
                      data.bankName = "";
                    }
                    if(isEmpty(data.bankBranch)){
                      data.bankBranch = "";
                    }
                    if(isEmpty(data.bankAccount)){
                      data.bankAccount = "";
                    }
                    if(isEmpty(data.alipayAccount)){
                      data.alipayAccount = "";
                    }
                    if(isEmpty(data.remark)){
                      data.remark = "";
                    }
                    if(isEmpty(data.monthSalary)){
                      data.monthSalary = "";
                    }
                    if(isEmpty(data.payroll)){
                      data.payroll = "";
                    }
                    if(isEmpty(data.positionType)){
                      data.positionType = "";
                    }
                    if(isEmpty(data.teaRank)){
                      data.teaRank = "";
                    }








                    // data.bankProvinceEmpty = !!data.bankProvince;
                    // data.bankCityEmpty = !!data.bankCity;
                    // data.bankNameEmpty = !!data.bankName;
                    // data.bankBranchEmpty = !!data.bankBranch;
                    // data.bankAccountEmpty = !!data.bankAccount;

                    data.bankProvinceEmpty = false;
                    data.bankCityEmpty = false;
                    data.bankNameEmpty = false;
                    data.bankBranchEmpty = false;
                    data.bankAccountEmpty = false;

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
