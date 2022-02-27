import fetch from '../../../src/utils/fetch'
const config = require('@config');
const BASE_URL = process.env.NODE_ENV === "development"
    ? config.dev.proxypath
    :'';

/**
 *
 方法说明  移出黑名单
 *
 @method sendOffer
 *
 @param  {Object} options 请求参数
    @property  {Array} teaId 教师ID数组
    @property  {String} content 内容
    @property  {String} defaultAttachment 默认附件ID 多个以逗号隔开
    @property  {Array} files 文件数组
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function sendOffer (options) {
    //数据正确性判断
    if(window.isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(window.isEmpty(options.content)){
        return Promise.reject('请填写内容');
    }
    // if(window.isEmpty(options.defaultAttachment)){
    //     return Promise.reject('请传递默认附件');
    // }
    return new Promise((resolve, reject) => {
      
      var formData = new FormData();
      formData.append("teaId", options.teaId);
      formData.append("content", options.content);
      formData.append("defaultAttachment", options.defaultAttachment);
      if (options.files.length > 0) {
        for (let i = 0; i < options.files.length; i++) {
          var file = document.getElementById(options.files[i]).files;
          formData.append("files", file[0]);
        }
      }
      fetch({
        url: "/api/newTrainController/sendOffer",
        method: 'post',
        data: formData
      }).then(result => {
        resolve(result);
      }).catch(err => {
        console.log(err);
        reject('网络有问题');
      });
      
      // var ajx = new XMLHttpRequest();
      // ajx.open("post", url, true);
      // ajx.onload = function () {
      //     if (ajx.readyState == 4 && ajx.status == 200) {
      //         resolve(ajx.responseText);
      //     } else {
      //         reject('网络有问题');
      //     }
      // }
      // ajx.send(formData);
    });
}
