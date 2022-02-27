import fetch from '@/utils/fetch';

function getHeaderTableList(data) {
  return fetch({
    url:'/api/headTable/getHeaderTableList',
    method: 'post',
    data,
  });
}

function getTeaHeaderTable(data) {
  return fetch({
    url: '/api/headTable/getTeaHeaderTable',
    method: 'post',
    data,
  })
}

function saveTeaHeaderTable(data) {
  return fetch({
    url: '/api/headTable/saveTeaHeaderTable',
    method: 'post',
    data,
  })
}

export {
  getHeaderTableList,
  getTeaHeaderTable,
  saveTeaHeaderTable,
}