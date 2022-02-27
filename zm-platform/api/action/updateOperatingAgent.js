import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  修改代理
 *
 @method updateOperatingAgent
 *
 @param  {Object} options 请求参数
      @property  {String} bankAccount//银行卡号 ,
      @property  {String} bankBranch//开户支行 ,
      @property  {String} bankCity//开户城市 ,
      @property  {String} bankName//银行名称 ,
      @property  {String} bankProvince//开户省份 ,
      @property  {String} id
      @property  {String} mobile//手机号
      @property  {String} teaName//代理名称 ,
      @property  {String} agentType//代理老师类型
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function updateOperatingAgent (options) {
    //数据正确性判断
    if(window.isEmpty(options.id)){
        return Promise.reject('请传递代理ID');
    }
    if(window.isEmpty(options.teaName)){
        return Promise.reject('请填写名称');
    }
    if(window.isEmpty(options.agentType)){
        return Promise.reject('请选择类型');
    }
    if(window.isEmpty(options.mobile)){
        return Promise.reject('请填写手机号');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agentMember/updateOperatingAgent',
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
