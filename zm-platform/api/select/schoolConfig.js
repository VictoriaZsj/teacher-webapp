import fetch from '../../../src/utils/fetch';

/**
 * 查询院校列表
 * @param {*} params
 */
export function queryColleges(params) {
  return fetch({
    url: '/api/baseCollege/queryColleges',
    method: 'get',
    params
  });
}

/**
 * 保存或者编辑院校，传id为编辑
 * @param {*} params
 */
export function saveCollege(params) {
  return fetch({
    url: '/api/baseCollege/saveCollege',
    method: 'post',
    data: params
  });
}

/**
 * 检索学校
 * @param {*} name
 */
export function queryCollegesByName(collegeName = '') {
  return fetch({
    url: '/api/baseCollege/queryCollegesByName',
    method: 'get',
    params: {
      collegeName
    }
  });
}

/**
 * 获取省份
 */
export function getProvinces() {
  return fetch({
    url: '/api/baseCollege/provinceList',
    method: 'get'
  });
}
