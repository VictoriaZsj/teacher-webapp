import fetch from '../../../src/utils/fetch';

/**
 * 校验当前岗位和基础信息是否一致
 * 查询岗位匹配
 * @param {*} teaId
 */
export function queryPostMatch(teaId = '') {
  return fetch({
    url: '/api/teacherPost/validate',
    method: 'get',
    params: {
      teaId
    }
  });
}

/**
 * 确定选择匹配岗位
 * @param {*} params
 */
export function confirmPostMatch(params) {
  return fetch({
    url: '/api/teacherPost/changePost',
    method: 'get',
    params
  });
}

/**
 * 获取教师等级与薪资的字典
 * @param {*} option
 */
export function getTeaLevelWithSalaryDic(option) {
  let parm = {
    $ZM_BU: option.bu,
    $TEACHER_ORIGIN: option.TEACHER_ORIGIN,
    teaId: option.teaId
  };
  return fetch({
    url: '/api/cascade/dict/queryTeacherLevelWithSalary',
    method: 'post',
    data: parm
  });
}

/**
 * 查询当前 教师等级与薪资
 * @param {*} teaId
 */
export function queryTeacherLevelAndSalary(teaId) {
  return fetch({
    url: '/api/fixSalary/getSalaryRatingInfo',
    method: 'get',
    params: {
      teaId
    }
  });
}

/**
 *
 * 更新教师新增与等级
 *
 @method saveFixedSalaryInfo
 *
 @param  {Object} options 请求参数
    @property  {String} teaId 教师ID
    @property  {String} state 恢复至某个状态
    @property  {String} remark 原因
 *
 @return {Object} 若code为0表示成功,返回data,执行then方法,否则执行catch方法
 */
export function saveFixedSalaryInfo(options) {
  return fetch({
    url: '/api/fixSalary/saveFixedSalaryInfo',
    method: 'post',
    data: options
  });
}
