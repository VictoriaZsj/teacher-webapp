import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'

/**
 *
 方法说明 获取试用期的老师
 *
 @method getTeacherSecretInfo
 *
 @param  {Object} options 请求参数
 @property  {String} 	teaId	入职周数

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export  function getTeacherDetailInfo (options) {
  options = getVilidAttrWithEmpty(options);
  if(window.isEmpty(options.channelId)){
    return Promise.reject('请传递渠道ID');
  }
  return new Promise((resolve, reject) => {
    fetch({
      url:`/api/zm-teacher-recruit-web/api/agentMember/searchByChannelId`,
      method: 'post',
      data:options
    }).then((result) => {
      const data = result.data;
      const code = result.code;
      const message = result.msgContent;
      if (code == 200) {
        if(!!data){
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

/**
 * 根据渠道号, 查询渠道手机号
 * @param {Number} channelId 渠道号
 */
export function getMobileInfo (channelId) {
  return fetch({
    url: '/api/zm-teacher-recruit-web/api/agentMember/queryChannelMobile',
    method: 'POST',
    data: { channelId }
  }).then(({ code, data, msgContent, msgCode }) => {
    if (code === 200) {
      if (data) {
        return data
      } else {
        if (msgCode === '500') {
          throw new Error(msgContent)
        } else {
          return ''
        }
      }
    } else {
      return '数据不存在'
    }
  })
}
