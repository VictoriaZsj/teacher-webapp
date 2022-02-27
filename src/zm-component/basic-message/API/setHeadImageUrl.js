import fetch from '../assets/js/fetch'
import {isEmpty} from '../assets/js/assist'
/**
 *
 方法说明 入职资料审核
 *
 @method setHeadImageUrl
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} headImageUrl 头像地址


 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function setHeadImageUrl (options) {
    //数据正确性判断
    if(isEmpty(options.teaId)){
        return Promise.reject('请选择教师');
    }
    if(isEmpty(options.headImageUrl)){
        return Promise.reject('请传递头像地址');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url: '/api/teacher-web/api/teacherInfo/setHeadImageUrl',
            method: 'get',
            params: options
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
