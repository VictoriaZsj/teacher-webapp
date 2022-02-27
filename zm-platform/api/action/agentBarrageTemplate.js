import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 修改教师沟通结果备注
 *
 @method agentBarrageTemplate
 *
 @param  {Object} options 请求参数0
    @property  {String} text1	文本1	//string	body	true
    @property  {String} text2	文本2	//string	body	true
    @property  {String} text3	文本3	//string	body	true
    @property  {String} type1	角色1:0不显示，1代理姓名，2讲师姓名	//string	body	true
    @property  {String} type2	角色2:0不显示，1代理姓名，2讲师姓名

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function agentBarrageTemplate (options) {
    //数据正确性判断
    if(window.isEmpty(options.text1)){
        return Promise.reject('请填写文本1');
    }
    if(window.isEmpty(options.text2)){
        return Promise.reject('请填写文本2');
    }
    if(window.isEmpty(options.text3)){
        return Promise.reject('请填写文本3');
    }
    if(window.isEmpty(options.type1)){
        return Promise.reject('请填写角色1');
    }
    if(window.isEmpty(options.type2)){
        return Promise.reject('请填写角色2');
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/agent/agentBarrageTemplate',
          method: 'post',
          data: options
        }).then((result) => {
          const code = result.code;
          const message = result.message;
          const data = result.data;
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
