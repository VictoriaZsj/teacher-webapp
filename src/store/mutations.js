import Cookies from "js-cookie";
export default {
  // 更新权限列表
  UPDATE_PERMISSIONLIST: (state, permissionList) => {
    state.permissionList = permissionList;
  },
  // 更新是否有权限
  UPDATE_PERMISSION: (state, permission) => {
    state.permission = permission;
  },
  // 更新权限名字
  UPDATE_PERMISSIONNAME: (state, permissionName) => {
    state.permissionName = permissionName;
  },
  // 更新activeLink
  UPDATE_ACTIVELINK: (state, activeLink) => {
    state.activeLink = activeLink;
  },
  // 更改userInfo更新状态
  UPDATE_USERINFOUPDATE: (state, userInfoUpdate) => {
    state.userInfoUpdate = userInfoUpdate;
  },
  // 更新路由的cName
  UPDATE_MENUCNAME: (state, cName) => {
    state.menu.cName = cName;
  },
  // 更新路由的reports
  UPDATE_REPORTS: (state, reports) => {
    state.menu.reports = reports;
  },
  // 更新用户名
  UPDATE_USERNAME: (state, userName) => {
    state.username = userName;
  },
  // 记录menu的收缩和展开
  TOGGLE_MENU: (state) => {
    if (state.menu.opened) {
      Cookies.set("menuStatusNew", 1);
    } else {
      Cookies.set("menuStatusNew", 0);
    }
    state.menu.opened = !state.menu.opened;
  },
  UPDATE_MENU_LIST: (state, menuList) => {
    state.menuList = menuList;
  },
  UPDATE_WORKBENCH_AUTH: (state, authInfo) => {
    let { roleCode, orgDtoList } = authInfo;
    orgDtoList = orgDtoList || [];
    let workbench = state.workbench;
    let orgArr = orgDtoList.map((item) => {
      return {
        value: item.orgCode,
        label: item.orgName,
      };
    });
    workbench.authInfo = authInfo;
    workbench.loading = false;
    if (roleCode === 1) { //管理员
      workbench.dataTypeOptions = [
        {
          value: "0",
          label: "全部",
        },
        ...orgArr,
      ];
    }else if(roleCode === 2){ //招师主管
      workbench.dataTypeOptions = [
        {
          value: "0",
          label: "全部",
        },
        {
          value: "1",
          label: "个人数据",
        },
        ...orgArr,
      ];
    }else{
      workbench.dataTypeOptions = [];
    }
  },
  // 路由跳转
  // ROUTE_TO: (state, routeData) => {
  //     // console.log("routeData",routeData);
  //     state.menu.cName = routeData.cName || routeData.routeName.split("-")[1];
  //     state.permissionName = routeData.permissionName;
  //     // state.permission = state.permissionList.indexOf(state.permissionName)>-1;
  // },
};
