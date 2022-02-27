import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 教师资格状态字典接口
 *
 @method getTeaCerListService
 *
 @param  {Array} options 请求参数
 @property  {String} bizCategory common
 @property  {String} dictCode TEACHER_CERTIFICATE


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export function getTeaCertificateList (options) {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/api/dict/getDictByGroupCode',
      method: 'get',
      params:options
    }).then((result) => {
      const data = result.data;
      const code = result.code;
      const message = result.message;
      if (code == 0) {
        resolve(data,message);
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
