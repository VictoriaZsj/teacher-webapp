import axios from 'axios';

const config = require('@config');
const BASE_URL =
  process.env.NODE_ENV === 'development' ? config.dev.proxypath : '';

const instance = axios.create({
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

export default function _fetch(options) {
  return new Promise((resolve, reject) => {
    if ([
        '/api/RecycleBin/release',
        '/api/record/getRefreshInfo',
        '/api/RecycleBin/addBlackList',
        '/api/RecycleBin/removeBlackList',
        '/api/PersonalInfo/certificateSubjects'
      ].indexOf(options.url) > -1 ) {
      options.url = '/api/teachers-mp' + options.url;
    } else if (options.url.includes('/api/zm-teacher-recruit-web')||options.url.includes('/api/zmbiz-clue-admin')) {
      options.url = options.url;
    } else if (options.url != '/api/auth/sys/initInfo') {
      options.url = '/api/teacher-web' + options.url;
    }

    instance(options)
      .then((response) => {
        const res = response.data;
        if (res.code == 11) {
          window.location.href = BASE_URL + '/login?redirectUrl=' + encodeURIComponent(location.href);
          return;
        } else if (res.code == 1) {
          reject(res.message);
          return;
        }
        resolve(res);
      }).catch((error) => {
        console.log(error); // for debug
        reject(error);
      });
  });
}
