const Mock = require('mockjs');

const data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'list|24': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1,
      name: '@cname',
      'age|10-24': 18,
      'sex|1': ['男', '女'],
      addr: '@county(true)',
    },
  ],
}).list;
let dataIndex = 24;

const proxy = {
  'GET /mock/student/list': async (req, res) => {
    const { pageNo, pageSize, age, name, sex, sortField, sortType } = req.query;
    let _data = [].concat(data);
    if (name) {
      _data = _data.filter(item => item.name.indexOf(name) !== -1);
    }
    if (sex) {
      _data = _data.filter(item => item.sex === sex);
    }
    if (age) {
      _data = _data.filter(item => item.age == age);
    }
    if (sortField === 'id' && sortType === 'desc') {
      _data = _data.reverse();
    }
    const result = {
      data: _data.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      total: data.length,
    };

    // 模拟网络延迟
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });

    return res.send({
      // http请求状态码
      code: 200,

      // 业务处理状态码
      msgCode: '200',

      // 业务处理信息
      msgContent: 'success',

      // 业务数据
      data: {
        ...result,
      },
    });
  },
  'POST /mock/student/delete': (req, res) => {
    const { ids } = req.body;

    if (ids && ids.length) {
      ids.forEach(id => {
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
          data.splice(index, 1);
        }
      });
    }

    return res.send({
      // http请求状态码
      code: 200,

      // 业务处理状态码
      msgCode: '200',

      // 业务处理信息
      msgContent: 'success',
    });
  },
  'POST /mock/student/new': (req, res) => {
    const { name, age, sex, addr } = req.body;
    const item = {
      id: ++dataIndex,
      name,
      age,
      sex,
      addr,
    };

    data.push(item);

    return res.send({
      // http请求状态码
      code: 200,

      // 业务处理状态码
      msgCode: '200',

      // 业务处理信息
      msgContent: 'success',

      data: item,
    });
  },
  'POST /mock/student/update': (req, res) => {
    const { id } = req.body;
    const student = data.find(item => item.id === parseInt(id, 10));

    if (student) {
      Object.assign(student, req.body);
    }

    return res.send({
      // http请求状态码
      code: 200,

      // 业务处理状态码
      msgCode: '200',

      data: student,

      // 业务处理信息
      msgContent: 'success',
    });
  },
  'GET /mock/student/detail': (req, res) => {
    const { id } = req.query;

    const student = data.find(item => item.id === parseInt(id, 10));

    return res.send({
      // http请求状态码
      code: 200,

      // 业务处理状态码
      msgCode: '200',

      // 业务处理信息
      msgContent: 'success',

      // 业务数据
      data: {
        ...student,
      },
    });
  },
};
module.exports = proxy;
