import fetch from '../../../src/utils/fetch';
import {getVilidAttrWithEmpty} from '../../../src/utils/assist';

export default function(params) {
  params = getVilidAttrWithEmpty(params);
  return fetch({
    url: '/api/report/commissionerFriendBindStatisticReportExport',
    responseType: 'arraybuffer',
    method: 'get',
    params,
  }).then(result => result).catch(err => err);
}