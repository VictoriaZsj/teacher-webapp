/**
 * 页面菜单：招师报表 > 工作台数据报表
 *
 * swagger： report-controller 报表服务
 *
 *
 */

import axios from 'axios';
const CAS_TEA = '/api/teacher-web';

// 招师专员效率报表
export function getEngageEfficiencyReport(data = {}) {
  return axios.post(`${CAS_TEA}/api/report/engageEfficiencyReport`, data);
}

// 招师专员效率报表底部汇总
export function getEngageEfficiencySumReport(data = {}) {
  return axios.post(`${CAS_TEA}/api/report/engageEfficiencySumReport`, data);
}

// 导出报表
export function exportEngageEfficiencyReport(data = {}) {
  return axios.post(`${CAS_TEA}/api/report/engageEfficiencyReportExport`, data, {
    responseType: 'arraybuffer'
  });
}

// OA组人员查询
export function queryOaPersono(params = {}) {
  return axios.get(`${CAS_TEA}/api/report/queryOaPerson`, { params });
}
