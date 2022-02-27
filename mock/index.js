const Mock = require('mockjs');
const studentProxy = require('./student');

const proxy = {
  ...studentProxy,
  'GET /mock/boolean': true,
  'GET /mock/user': (req, res) => {
    return res.send(
      Mock.mock({
        'name|1': '@name',
        'age|1-88': 100,
      })
    );
  },
  'GET /mock/addr': [
    {
      value: 1,
      label: '河南',
      children: [
        {
          value: 11,
          label: '郑州',
        },
        {
          value: 12,
          label: '开封',
        },
      ],
    },
    {
      value: 2,
      label: '山东',
      children: [
        {
          value: 21,
          label: '菏泽',
        },
        {
          value: 22,
          label: '青岛',
        },
      ],
    },
  ],
  'GET /mock/select': [
    {
      value: 1,
      label: 'A',
    },
    {
      value: 2,
      label: 'B',
    },
  ],
  'GET /mock/user/list': [
    {
      id: 1,
      username: 'kenny',
      sex: 6,
    },
    {
      id: 2,
      username: 'kenny',
      sex: 6,
    },
  ],
  'POST /mock/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: { id: 1, username: 'kenny', sex: 6 },
      });
    } else {
      return res.send({ status: 'error', code: 403 });
    }
  },
};
module.exports = proxy;
