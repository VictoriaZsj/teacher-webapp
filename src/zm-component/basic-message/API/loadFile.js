import fetch from '../assets/js/fetch'
import {getVilidAttrWithEmpty,isEmpty} from '../assets/js/assist'

/**
 *
 方法说明
 *
 @method recycle
 *
 @param  {Object} options 请求参数
  ID:文件 ID
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function loadFile (options) {
    if(isEmpty(options.ID)){
      return Promise.reject('请传递文件ID');
    }
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      var file = document.getElementById(options.ID).files;
      formData.append("MultipartFile", file[0]);
      var ajx = new XMLHttpRequest();
      ajx.open("post", "/api/teachers-mp/api/upload/uploadAttachment", true);
      ajx.onload = function () {
          if (ajx.readyState == 4 && ajx.status == 200) {
            let result = JSON.parse(ajx.responseText);
            if(result.code == "0"){
              resolve(result.data);
            }else{
              reject(result.message);
            }
          } else {
            reject("文件上传出错");
          }
      }
      ajx.send(formData);
    });
}
