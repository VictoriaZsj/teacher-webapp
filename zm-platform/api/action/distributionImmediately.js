import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明  立即分配
 *
 @method distributionImmediately
 *
 @param  {Object} options 请求参数

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function distributionImmediately (options) {
    //数据正确性判断
    return new Promise((resolve, reject) => {
        fetch({
          url: '/api/1.0.0/unAssign/assignByTag',
          method: 'post',
          data: null
        }).then((result) => {
          const data = result.data;
          const code = result.code;
          const message = result.message;
          if (code == 0) {
            resolve(data);
          }
          else {
            reject(message);
          }
          this.$sdk.sendEvent({
            eventId: 'click_teacher_unAssign_assign',
            eventParam: result
          });
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
            reject(err);
        });
    });
}
