import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 根据id查询老师个人介绍快照
 *
 @method getTobeFixedSalaryCount
 *
 @param  {Object} options 请求参数
    @property  {String} teaId ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getTobeFixedSalaryCount (options) {
    options = getVilidAttrWithEmpty(options);
    let url = '';
    if (options.type === 'pre_training') { // 面试管理
      url = '/api/fixSalary/interview/getTobeFixedSalaryCount';
    } else if (options.type === 'bef_int') { // 培训管理
      url = '/api/fixSalary/train/getTobeFixedSalaryCount';
    }
    return new Promise((resolve, reject) => {
      fetch({
        url: url,
        method: 'get',
        params: options,
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
