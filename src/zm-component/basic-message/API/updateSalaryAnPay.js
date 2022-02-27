import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明 修改薪资支付
 *
 @method updateSalaryAnPay
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID数组 必填
    @property  {string} remark 备注信息 可不传
    @property  {string} rating//讲师等级 可不传
    @property  {string} teaRank//老师档次 可不传
    @property  {string} positionType//职位类型 可不传
    @property  {string} monthSalary//基本薪资 可不传
    @property  {string} payroll//基本薪资 可不传
    @property  {string} bankProvince//开户省 可不传
    @property  {string} bankCity//开户市 可不传
    @property  {string} bankName//开户银行 可不传
    @property  {string} bankBranch//银行支行 可不传
    @property  {string} bankAccount//银行账号 可不传
    @property  {string} alipayAccount//支付宝号 可不传
    @property  {string} remark//备注信息 可不传

 *
 @return 返回值
   {
   code:1,
   data:'',
   message:''
  }
 */
export default function updateSalaryAnPay (options) {
    //数据正确性判断
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(!isEmpty(options.remark) && options.remark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teachers-mp/api/PersonalInfo/saveSalary',
          method: 'post',
          data: options
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
          }
          else {
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
