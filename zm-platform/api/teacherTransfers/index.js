import axios from 'axios';
const CAS_TEA = '/api/teacher-web'

// 获取老师移交申请列表(新，有权限)
export function getTeacherTransfersPageNew(data = {}) {
  return axios.post(`${CAS_TEA}/api/teacherTransfer/listTeacherTransfersForAuthority`, data);
}
// 获取老师移交申请列表（旧）
export function getTeacherTransfersPage(data = {}) {
  return axios.post(`${CAS_TEA}/api/teacherTransfer/listTeacherTransfers`, data);
}
// 完整手机号查询
export function getTeacherSecretInfo(params = {}) {
  return axios.get(`${CAS_TEA}/api/teacherInfo/getTeacherSecretInfo`, { params });
}

// 手机号查询老师
export function getTransferTeacher(data = {}) {
  return axios.post(`${CAS_TEA}/api/teacherTransfer/queryTransferTeacher`, data);
}

// 移交申请提交
export function submitTeaTransferApply(data = {}) {
  return axios.post(`${CAS_TEA}/api/teacherTransfer/submitTeaTransferApply`, data);
}

// 批量审批
export function batchTransferAudit(data = {}) {
  return axios.post(`${CAS_TEA}/api/teacherTransfer/batchTransferAudit`, data);
}
