import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取教师移交记录
 *
 @method getImportUnassaignList
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getImportUnassaignList (options) {

    options = getVilidAttrWithEmpty(options)
    return new Promise((resolve, reject) => {
      fetch({
        url: '/api/teachers/register/recordPage',
        method: 'GET',
        params:options
      }).then((res) => {
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
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }
        reject(err)
      })
  })
}
