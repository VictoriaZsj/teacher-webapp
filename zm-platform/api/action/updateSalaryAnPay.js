import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 批量移交老师修改教师薪资
 *
 @method updateSalaryAnPay
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID数组 必填
    @property  {Array} bankAccount	银行账号	必填
    @property  {Array} bankBranch	支行	必填
    @property  {Array} bankName	银行名称	必填
    @property  {Array} level	老师等级	非必填
    @property  {Array} monthSalary	月薪	必填
    @property  {Array} positionType:	坐班状态	非必填	职位状态-0:默认,1:坐班,2:非坐班
    @property  {Array} remark	备注	非必填
    @property  {Array} alipayAccount	支付宝 必填
    @property  {Array} chinaId	身份证 必填
    @property  {Array} bankProvince	银行省 必填
    @property  {Array} bankCity	银行城市 必填
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function updateSalaryAnPay (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    // if(window.isEmpty(options.bankProvince)){
    //   return Promise.reject('请填写开户省');
    // }
    // if(window.isEmpty(options.bankCity)){
    //   return Promise.reject('请填写开户市');
    // }
    // if(window.isEmpty(options.bankAccount)){
    //   return Promise.reject('请填写银行账号');
    // }else if(options.bankAccount.length > 300){
    //   return Promise.reject('银行账号字数不可大于300');
    // }
    // if(window.isEmpty(options.bankBranch)){
    //   return Promise.reject('请填写支行');
    // }else if(options.bankBranch.length > 300){
    //   return Promise.reject('支行字数不可大于300');
    // }
    // if(window.isEmpty(options.bankName)){
    //   return Promise.reject('请填写银行名称');
    // }else if(options.bankName.length > 300){
    //   return Promise.reject('银行名称字数不可大于300');
    // }
    // if(window.isEmpty(options.alipayAccount)){
    //   return Promise.reject('请填写支付宝号');
    // }else if(options.alipayAccount.length > 300){
    //   return Promise.reject('支付宝号字数不可大于300');
    // }
    // if(window.isEmpty(options.chinaId)){
    //   return Promise.reject('请填写身份证号');
    // }else if(options.chinaId.length > 300){
    //   return Promise.reject('身份证号字数不可大于300');
    // }

    if(options.teaBu != 3 && window.isEmpty(options.monthSalary)){
      return Promise.reject('请填写月薪');
    }
    if(!window.isEmpty(options.remark) && options.remark.length > 300){
      return Promise.reject('备注字数不可大于300');
    }

    // let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;
    // if(!regIdNo.test(options.chinaId)){
    //     return Promise.reject('身份证号格式填写有误');
    // }

    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/updateSalaryAnPay',
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
