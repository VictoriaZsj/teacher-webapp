import fetch from '../../../src/utils/fetch'
import {getVilidAttrWithEmpty} from '../../../src/utils/assist'
/**
 *
 方法说明 获取代理列表
 *
 @method agentMember
 *
 @param  {Object} options 请求参数
    @property  {String} agentType 查询的代理商类型	number	0兼职，1全职
    @property  {String} isInternal 1是内部代理 0不是内部代理
    @property  {String} teaType	代理类型
    @property  {String} readyAt null:全部,1:入库,0:未入库
    @property  {String} keyWord 关键字
    @property  {String} sortField 排序字段
    @property  {String} sortType 排序类型
    @property  {String} pageNo
    @property  {String} pageSize

 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export default function agentMember (options) {
    if(window.isEmpty(options.isInternal)){
        return Promise.reject('请选择查询类型');
    }
    options = getVilidAttrWithEmpty(options);
    return new Promise((resolve, reject) => {
        fetch({
            url:'/api/agentMember/search',
            method: 'post',
            data:options,
        }).then((result) => {
            const data = result.data;
            const code = result.code;
            const message = result.message;
            if (code == 0) {
                resolve(data);
            } else {
                reject(message);
            }
            this.$sdk.sendEvent({
              eventId: 'click_teacher_agentMember_search',
              eventParam: options
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
