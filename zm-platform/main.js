import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "./app.vue";
import store from "../src/store";
import appConfig from "@config/";
import JSSDK from "@zm-fe/zm-jssdk";
// 接入前端监控
import sentryPlugin from "zm-sentry-plugin-vue";
import sentryConfig from "@config/sentry.config";
import ui from "../src/index";
// import locale from '../src/locale/lang/en-US';
import locale from "../src/locale/lang/zh-CN";
// import FORM from './pages/component/form';

// common_function
import common_fn from "../src/common_fn";
import BMLoading from "dami-loading";
import checkAppVersion from "@zm-biz/check-app-version";
import router from './router';
/**
 * upload说明：由于之前项目都是copy elementUi的代码
 * 现考虑后期维护问题
 * 此上传采用elementUi2.4.11版本的upload
 *
 *  */
import { Upload, Cascader, Tabs, MessageBox, Form, FormItem, } from "element-ui";
import "../node_modules/element-ui/packages/theme-chalk/src/upload.scss";
import "../node_modules/element-ui/packages/theme-chalk/src/cascader.scss";
import "../node_modules/element-ui/packages/theme-chalk/src/tabs.scss";

Vue.use(Upload);
Vue.use(Cascader);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(FormItem);

sentryPlugin.install(
  {
    projectName: "teacher-webapp",
    uploadSourceMap: false,
    token: "953a5e243bf011e9addb0242c0a81006",
    url: "https://log-sentry-internal.zmlearn.com",
    urlPrefix: "",
  },
  sentryConfig
);
// 接入性能监控

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ui, {
  locale,
});
Vue.use(BMLoading, {
  color: "light",
});
Vue.use(common_fn, {});

// Vue.config.productionTip = false;
// 开启debug模式
Vue.config.debug = true;

// 接入性能监控
// if(process.env.NODE_ENV==='production'){
//     axiosReport({
//       domain: 'https://ps.zmlearn.com/api/v1/report/web',
//       add:{
//         appId:window.location.host.includes('www')?'yRPrmBK1562846010498':'SkBmtw21562838748852'
//       }
//   });
// }

// 埋点配置
// const env = process.env.NODE_ENV == 'production' ? 'prod' : process.env.NODE_ENV == 'uat' ? 'uat' : 'fat'
JSSDK.setConfig({
  // sdk内部会根据environment来拼接url，规则：fat => _test, uat => _uat, prod => ''
  environment: process.env.NODE_ENV,

  // debug模式, 可选值:error / debug。调试阶段，可以在console查看打印信息
  logLevel: "error",

  // 如果你使用了router并且是history模式
  // 如果你使用了vue-router的hash模式，也是设置history
  history: true,
});
Vue.prototype.$sdk = JSSDK;
Vue.prototype.$confirm = MessageBox.confirm;

checkAppVersion({
  // 项目部署的子路径，比如http://p-test.zmlearn.com/flow，就传'/flow'，没有可不传
  publicPath: appConfig.publicPath,

  // ElementUI，建议传，内部使用ElementUI.MessageBox.confirm进行提示，不传则会使用window.confirm提示
  // elementUI: ElementUI,

  // 提示信息，支持传入html，可不传，有默认提示信息
  message: "",

  // 版本有更新时的处理方法，可不传，传了的话，如有版本更新则会执行updateHeadler，而不再使用默认弹窗提示
  // updateHandler() => {},

  // 检测轮循时间， 可不传，默认5分钟
  during: 5 * 60 * 1000,
});



new Vue({
  // eslint-disable-line
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
