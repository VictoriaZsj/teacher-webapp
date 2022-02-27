import axios from 'axios';
const CAS_TEA = '/api/zm-teacher-recruit-web'

// 专员渠道绑定之后老师报名信息列表
export function listBindAfterTeaRelation(data = {}) {
  return axios.post(`${CAS_TEA}/api/commissionerChannelRelation/listBindAfterTeaRelation`, data);
}
