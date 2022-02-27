import VueRouter from "vue-router";
import store from "../../src/store";
import routes from "./routes";
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
// 路由参数
const router = new VueRouter({
  // mode: 'history',
  routes,
});
// 路由跳转管理
router.beforeEach((to, from, next) => {
  next();
});

router.afterEach((route) => {
  store.dispatch("RouteTo", {
    routeName: route.name,
    permissionName: route.meta.permissionName || "",
    cName: route.meta.cName ? route.meta.cName[0] : "",
    reports: route.meta.reports ? route.meta.reports : "interactive",
  });
  store.dispatch("UpdatePermission").then(() => {
    let activeLink;
    if (route.path.indexOf("dashboard") >= 0) {
      activeLink = (route.matched[1] || []).path;
    } else {
      activeLink = (route.matched[0] || []).path;
    }
    store.commit("UPDATE_ACTIVELINK", activeLink);
  });
});

export default router;
