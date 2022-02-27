import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获根据手机号获取银行信息
 *
 @method getIntroduceAuditList
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getIntroduceAuditList (options) {
    options = getVilidAttrWithEmpty(options)
    return new Promise((resolve, reject) => {
      fetch({
        url: '/api/dataAudit/introduceAuditList',
        method: 'post',
        data: options,
      }).then(res => {
        const { code, data, message } = res
        if (code == 0) {
          if(!!data){
            resolve(data)
          }else{
            reject("数据不存在")
          }
        } else {
          reject(message)
        }
        this.$sdk.sendEvent({
          eventId: 'click_teacher_personalIntroductionAudit_list',
          eventParam: options
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
        reject(err)
      })
  })
}
