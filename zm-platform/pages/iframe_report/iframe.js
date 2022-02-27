import appConfig from "@config/";

function initRouter() {
  //   1）全职个人报表
  // test环境:     https://portal-test.zmlearn.com/bi/#/data-home-template/DHPAGEK1574324175951
  // prod环境:   https://portal.zmlearn.com/bi/#/data-home-template/DHPAGEK1574241395981
  // 2）兼职个人报表
  // test环境:    https://portal-test.zmlearn.com/bi/#/data-home-template/DHPAGEK1578451302363
  // prod:         https://portal.zmlearn.com/bi/#/data-home-template/DHPAGEK1575359701926

  let data = [
    /**
     * BI 报表嵌入
     * route BI 页面地址
     * path 招师链接地址
     * */
    {
      route: `/bi/#/data-home-template/${appConfig.reportIfreame.personalReport}`,
      path: "/report_forms/personalReport",
      name: "招师报表 > 全职个人报表",
    },
    {
      route: `/bi/#/data-home-template/${appConfig.reportIfreame.personReport}`,
      path: "/report_forms/personReport",
      name: "招师报表 > 兼职个人报表",
    },
    {
      route: `/bi/#/data-home-template/${appConfig.reportIfreame.dimissionReport}`,
      path: "/report_forms/dimissionReport",
      name: "招师报表 > 离职明细报表",
    },
  ];
  return data.map((r) => {
    let route = {
      path: r.path,
      name: r.name,
      component: (c) => require.ensure([], () => c(require("./index.vue")), ""),
      meta: {
        path: r.route,
      },
    };
    return route;
  });
}
export default new initRouter();
