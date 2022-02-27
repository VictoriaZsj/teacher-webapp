import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 获取全部字典
 *
 @method getAllDic
 *
 @param  {Object} options 无

 *
 @return 返回值
 {
   code:1,
   data:[{
     nodeCode//字典类别
     nodeName//字典名称
     options:[ {value: "1", label: "本科"}, {value: "1", label: "本科"}]//字典数据
   }],
   message:''
 }
 */
export default function getAllDicCode (options) {
  return new Promise((resolve, reject) => {
    fetch({
      url:'/api/cascade/dict/service',
      method: 'post',
      data: options
    }).then((res) => {
      const { data, code, message } = res
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
