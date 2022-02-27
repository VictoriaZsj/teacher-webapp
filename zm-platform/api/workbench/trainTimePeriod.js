
import axios from 'axios';
const CAS_TEA = '/api/teacher-web'

// 约面数据
export function getInterviewLimitView(data = {}) {
  return axios.post(`${CAS_TEA}/api/dataView/interviewLimitView`, data);
}

// 约面数据
export function getTrainLimitView(data = {}) {
  return axios.post(`${CAS_TEA}/api/dataView/trainLimitView`, data);
}
