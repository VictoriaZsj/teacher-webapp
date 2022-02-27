
import axios from 'axios';
const CAS_TEA = '/api/teacher-web'

// 列表
export function getAppointLimitPage(data = {}) {
  return axios.post(`${CAS_TEA}/api/appointLimit/pageList`, data);
}

// 保存
export function appointLimitSave(data = {}) {
  return axios.post(`${CAS_TEA}/api/appointLimit/save`, data);
}

// 上架/下架
export function appointLimitChangeStatus(data = {}) {
  return axios.post(`${CAS_TEA}/api/appointLimit/changeStatus`, data);
}

// 删除
export function appointLimitDelete(data = {}) {
  return axios.post(`${CAS_TEA}/api/appointLimit/del`, data);
}

// 详情
export function appointLimitDetail(params = {}) {
  return axios.get(`${CAS_TEA}/api/appointLimit/detail`, {params});
}

// 获取具体条件选项
export function getAllFilterConditionLayerRules(params = {}) {
  return axios.get(`${CAS_TEA}/api/appointLimitTag/getAllFilterConditionLayerRules`, {params});
}
