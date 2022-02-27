import axios from 'axios';

// 获取全国省市县三维数组
export function getProvinceCityCounty() {
  return axios.get(`/api/zmbiz-common/area/provinceCityCountyList`);
}
