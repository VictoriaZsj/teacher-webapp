import fetch from '../../../src/utils/fetch';

/**
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function getChannelType() {
  return new Promise((resolve, reject) => {
    fetch({
      url: '/api/zm-teacher-recruit-web/common/dicts',
      method: 'post',
      data: ['CHANNEL_TYPE'],
    })
      .then((result) => {
        const data = result.data;
        const code = result.msgCode;
        const message = result.msgContent;
        if (code == '200') {
          resolve(data.CHANNEL_TYPE);
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
