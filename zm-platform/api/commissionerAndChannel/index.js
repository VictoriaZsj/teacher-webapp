import axios from 'axios';
const CAS_TEA = '/api/zm-teacher-recruit-web'

export * from './bindChannel'; // 绑定渠道
export * from './bindingTea'; // 绑定期间获得新讲师

// 渠道专员绑定统计
export function commissionerChannelBindstatistic(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/commissionerChannelBindstatistic`, data);
}

//复制链接
export function copyLink(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/getChannelCommissionerBindUrl`, data);
}
