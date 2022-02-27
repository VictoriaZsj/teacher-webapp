import fetch from '../../../src/utils/fetch';

/**
 *
 方法说明  招师跟进单个
 *
 @method setInterviewOneFollowUp
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} 	hireRemark	备注	string	可选
    @property  {String} 	hireTime	培训时间	string	必选: 格式 yyyy-MM-dd HH:mm:ss
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function setInterviewOneFollowUp (options) {
    //数据正确性判断
    return new Promise((resolve, reject) => {
        fetch({
            url: '/api/newInterviewService/oneFollowUp',
            method: 'post',
            data: options
        }).then((res) => {
            const { code, message } = res;
            if (code == 0) {
                resolve(message);
            }
            else {
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
