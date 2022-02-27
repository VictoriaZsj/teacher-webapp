import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 教师个人资料审核
 *
 @method reviewTeaPersonalInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 状态：2代表审核通过，3代表审核未通过
    @property  {String} desc 备注
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function reviewTeaPersonalInfo (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
      return Promise.reject('请选择教师')
    }
    // if(window.isEmpty(options.state)){
    //   return Promise.reject('请选择审核结果')
    // }
    if(!window.isEmpty(options.desc) && options.desc.length > 50){
      return Promise.reject('备注字数不可大于50')
    }
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/teacherInfo/reviewTeaPersonalInfo',
          method: 'post',
          data: options
        }).then((result) => {
          const { code, message, data } = result
          if (code == 0) {
            resolve(data)
          } else {
            reject(message)
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err)
          }
          reject(err)
        })
    })
}
