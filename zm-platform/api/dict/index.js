import axios from 'axios';
const CAS_TEA = '/api/teacher-web'

export function querydDictService(data = {}) {
  return axios.post(`${CAS_TEA}/api/cascade/dict/service`, data);
}
