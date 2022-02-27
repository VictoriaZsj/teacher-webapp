const path = require( "path" );

const config = Object.assign({
  dev : {
    agentDomain: "https://v2-test.zm1v1.com/",
    agentPeilianDomain: "https://app-h5-test.zhangmen.com//",
    subjectPath: "https://open-test.zmlearn.com/api/dict/service/cascade",
    aesKey: '1234567890ABCDEF',
    QINIU_BASE_URL: 'http://oym73spwn.bkt.clouddn.com'
  },
  fat : {
    agentDomain: "https://v2-test.zm1v1.com/",
    agentPeilianDomain: "https://app-h5-test.zhangmen.com//",
    subjectPath: "https://open-test.zmlearn.com/api/dict/service/cascade",
    aesKey: '1234567890ABCDEF',
    QINIU_BASE_URL: 'http://oym73spwn.bkt.clouddn.com'
  },
  uat :{
    agentDomain: "https://v2-test.zm1v1.com/",
    agentPeilianDomain: "https://app-h5-test.zhangmen.com//",
    subjectPath: "https://open.uat.zmops.cc/api/dict/service/cascade",
    aesKey: '1234567890ABCDEF',
    QINIU_BASE_URL: 'http://oym73spwn.bkt.clouddn.com'
  },
  prod : {
    agentDomain: 'https://www.zhangmen.com/',
    agentPeilianDomain: 'https://app-h5.zhangmen.com/',
    subjectPath: 'https://open-ng.zmlearn.com/api/dict/service/cascade',
    aesKey: '1234567890ABCDEF',
    QINIU_BASE_URL: 'http://teacher-recruit-static.zmlearn.com'
  }
}[ process.env.VUE_APP_RUN_ENV ] , {
  // 服务器接口host, 跨域请求时设置
  apiHost: {
    // 开发环境
    dev: '',
    // fat
    fat: '',
    // fat
    uat: '',
    // fat
    prod: '',
  }[process.env.VUE_APP_RUN_ENV],
  proxypath: process.env.VUE_APP_RUN_ENV !== "prod" ? "https://p-test.zmlearn.com" : "", 
  // 项目部署的子路径，如应用被部署在 https://p-test.zmlearn.com/my-app，则设置为 /my-app
  publicPath: {
    // 开发环境
    development: '/',

    // fat/uat/prod环境
    production: '/teacher',
  }[process.env.NODE_ENV],

  // 发布系统对应的应用ID，埋点使用
  appId: '10321',
  version : "1.0.0",
  // 权限系统项目配置信息
  auth: {
    // 权限系统编号，根据环境设置
    appCode: {
      dev: '655552d03a9c466f99ac3be3fecbe655',
      fat: '655552d03a9c466f99ac3be3fecbe655',
      uat: '9638dea252e04b5991d62dec34b3bbb4',
      prod: 'ffc0801039ec49429e419789739dca23',
    }[process.env.VUE_APP_RUN_ENV],

    // 用户类型，0或空代表OA用户，1代表销售用户
    systemType: 0,
  },
  theme: {
    colorPrimary: '#ef4c4f',
  },
  reportIfreame : process.env.VUE_APP_RUN_ENV === "prod" ? {
    personalReport : "DHPAGEK1574241395981" , // 全职
    personReport : "DHPAGEK1575359701926" , // 兼职
    dimissionReport : "DHPAGEK1605238856936"  // 离职
  } : {
    personalReport : "DHPAGEK1574324175951" ,
    personReport : "DHPAGEK1578451302363" ,
    dimissionReport : "DHPAGEK1605238856936"
  } ,
  build: {
    aesKey:"1234567890ABCDEF",
    agentDomain:"http://v2-test.zm1v1.com/",
    agentPeilianDomain:"https://app-h5-test.zhangmen.com//",
    subjectPath:"http://open-test.zmlearn.com/api/dict/service/cascade"
  },
  dev: {
      aesKey:"1234567890ABCDEF",
      proxypath: 'https://p-test.zmlearn.com',
      agentDomain: 'http://v2-test.zm1v1.com/',
      agentPeilianDomain: 'https://app-h5-test.zhangmen.com/',
      subjectPath:"http://open-test.zmlearn.com/api/dict/service/cascade"
    }
});

module.exports = config;