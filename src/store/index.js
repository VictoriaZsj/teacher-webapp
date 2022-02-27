import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import Cookies from "js-cookie";

Vue.use(Vuex);

const state = {
  permissionList: [],
  permissionName: "",
  username: "",
  permission: false,
  userInfoUpdat: false,
  activeLink: "/workbench",
  menu: {
    opened: !+Cookies.get("menuStatusNew"),
  },
  menuList: [],
  workbench: {
    loading: true,
    dataTypeOptions: [],
    authInfo: {}
  },
};

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

// 热重载
if (module.hot) {
  module.hot.accept(["./getters", "./actions", "./mutations"], () => {
    store.hotUpdate({
      getters: require("./getters"),
      actions: require("./actions"),
      mutations: require("./mutations"),
    });
  });
}

export default store;
