import Fetch from '../utils/fetch.js';
import JSSDK from '@zm-fe/zm-jssdk';
import appConfig from "@config"

export default {
  ToggleMenu: ({ commit }) => {
    commit('TOGGLE_MENU');
  },
  // 路由跳转
  RouteTo: ({ commit }, routeData) => {
    commit('UPDATE_PERMISSIONNAME', routeData.permissionName);
    if(routeData.routeName) commit(
      'UPDATE_MENUCNAME',
      routeData.cName || routeData.routeName.split('-')[1]
    );
    commit('UPDATE_REPORTS', routeData.reports);
  },
  UpdatePermission: async ({ commit, state }) => {
    let permission = false;
    let permissionList;
    let appCode = appConfig.auth.appCode;
    if (state.userInfoUpdate) {
      permissionList = state.permissionList;
    } else {
      const result = await Fetch({
        url: '/api/auth/sys/initInfo',
        method: 'get',
        params: {
          appCode,
          systemType: 1
        }
      });
      const data = result.data;
      const code = result.code;
      if (code == 0) {
        // permissionList = []
        // let pushPermission = list => {
        //   list.forEach(item => {
        //     permissionList.push(item.permission);
        //     if (item.subMenu && item.subMenu.length > 0) {
        //       pushPermission(item.subMenu)
        //     }
        //   });
        // }
        try {
          const interAuthInfo = await Fetch({
            url: '/api/dataView/statistics/interview/getInterviewAuthList',
            method: 'get',
          })
          commit('UPDATE_WORKBENCH_AUTH', interAuthInfo.data);
        }catch(e){
          console.log('error==============>:',e);
        }
        permissionList = data.permission
        // pushPermission(data.menu);
        commit('UPDATE_PERMISSIONLIST', permissionList);
        commit('UPDATE_USERNAME', data.me.personName);
        commit('UPDATE_MENU_LIST', data.menu);
        commit('UPDATE_USERINFOUPDATE', true);
        // 获取到用户信息（即调用接口：/api/auth/sys/initInfo）后，设置埋点默认值，这里注意要保证只执行一次
        // 设置userId，PV，UV埋点会用到
        window.localStorage.setItem('ZM_USERID', data.me.userId);
        // 在这里设置默认值会触发一次PV事件发送，后面就会在每次页面切换的时候自动发送PV，之所以在这里设置是要第一次PV统计就带上用户信息
        JSSDK.setDefaults({
          // 发布系统对应的应用ID
          appId: appConfig.appId,

          // 本地应用包package.json文件里的版本名称
          appVersion: appConfig.version,
        });
      }
    }
    if (!state.permissionName) {
      permission = true;
    } else {
      state.permissionName.split(' ').forEach(function(val) {
        if (permissionList.indexOf(val) > -1) {
          permission = true;
        }
      });
    }
    commit('UPDATE_PERMISSION', permission);
    return permission;
  }
};
