import fetch from '../../../src/utils/fetch';
import {getVilidAttrWithEmpty} from '../../../src/utils/assist';

export default function(params) {
  params = getVilidAttrWithEmpty(params);
  return fetch({
    url: '/api/report/commissionerFriendBindStatisticReport',
    method: 'get',
    params,
  }).then(result => {
    return result;
  }).catch(err => err)
}