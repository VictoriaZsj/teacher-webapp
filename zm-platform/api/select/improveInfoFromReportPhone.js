import fetch from '../../../src/utils/fetch';

export default function (queryPhoneKey) {
  if (!queryPhoneKey) {
    return Promise.reject('缺少参数phoneKey');
  } else {
    return fetch({
      url: '/api/dataView/commissioner/getImproveInfoFromReportPhone',
      method: 'get',
      params: { queryPhoneKey }
    }).then(result => {
      return result;
    }).catch(err => err);
  }
}