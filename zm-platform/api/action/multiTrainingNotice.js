import fetch from '../../../src/utils/fetch'

/**
 *
 方法说明 培训通知(批量)
 *
 @method multiTrainingNotice(批量)
 *
 @param  {Object} options 请求参数
    @property  {Array} teaIds 教师ID数组
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function multiTrainingNotice (options) {
    //数据正确性判断
    if(Object.prototype.toString.call(options.teaIds) !== '[object Array]'){
        return Promise.reject('请求参数不符合格式');
    }
    if(options.teaIds.length == 0){
        return Promise.reject('请至少选择一个老师');
    }
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/newInterviewService/multiTrainingNotice',
            method:'post',
            data:options
        }).then((result)=>{
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code ==0){
                resolve(data);
            } else {
                reject(data);
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
