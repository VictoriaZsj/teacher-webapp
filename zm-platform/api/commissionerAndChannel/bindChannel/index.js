import axios from 'axios';
const CAS_TEA = '/api/zm-teacher-recruit-web'

// 专员渠道绑定列表
export function listCommissionerChannelRelation(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/listCommissionerChannelRelation`, data);
}

// 根据ID查绑定老师列表
export function listBindAfterTeas(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/listBindAfterTeas`, data);
}

// 专员渠道绑定
export function bindCommissionerChannel(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/bindCommissionerChannel`, data);
}

// 专员渠道解除绑定
export function unbindCommissionerChannel(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/unbindCommissionerChannel`, data);
}

// 查询专员或渠道绑定
export function getCommissionerOrChannel(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/getCommissionerOrChannel`, data);
}
