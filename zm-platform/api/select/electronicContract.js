import fetch from '../../../src/utils/fetch'

// 试用期管理: 电子合同预览接口
export function newTryOutControllerGetEcontractInfo(params) {
  return fetch({
    url: '/api/newTryOutController/getEcontractInfo',
    // url: '/api/newEntry/getTobeEcontract',
    method: 'get',
    params
  })
}

// 试用期管理：批量下载合同的接口
export function newTryOutControllerDownEcontract(params) {
  const url =
    '/api/teacher-web/api/newTryOutController/downEcontract' +
    encodeURI(window.toParams(params))
  window.open(url, '_blank')
}

// 转正管理管理: 电子合同预览接口
export function newRegularControllerGetEcontractInfo(params) {
  return fetch({
    url: '/api/newRegularController/getEcontractInfo',
    method: 'get',
    params
  })
}

// 转正管理管理：批量下载合同的接口
export function newRegularControllerDownEcontract(params) {
  const url =
    '/api/teacher-web/api/newRegularController/downEcontract' +
    encodeURI(window.toParams(params))
  window.open(url, '_blank')
}

// 查看失败明细
// GET请求  参数：teaId
export function getEcontractFailReason(params) {
  return fetch({
    url: '/api/newEntry/getEcontractFailReason',
    method: 'get',
    params
  })
}

// POST /api/newEntry/auditContract
// 入职管理 - 审核电子合同
export function auditContract(data) {
  return fetch({
    url: '/api/newEntry/auditContract',
    method: 'post',
    data
  })
}

// GET /api/newEntry/getTobeEcontract
// 入职管理 - 查看待签合同 teaId
export function getTobeEcontract(params) {
  return fetch({
    url: '/api/newEntry/getTobeEcontract',
    method: 'get',
    params
  })
}
