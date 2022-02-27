import fetch from '../../../src/utils/fetch'

export default function getTeacherHistoryRecord(params) {
  return fetch({
    url: '/api/teacherInfo/getTeacherHistoryRecord',
    method: 'get',
    params
  })
}
