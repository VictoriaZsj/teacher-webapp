// export const count = state => state.count;

// const limit = 5;

// export const recentHistory = state => {
//     const end = state.history.length;
//     const begin = end - limit < 0 ? 0 : end - limit;
//     return state.history
//         .slice(begin, end)
//         .toString()
//         .replace(/,/g, ', ');
// };
export default {
    permissionList: state => state.permissionList,
    permissionName: state => state.permissionName,
    username: state => state.username,
    activeLink: state => state.activeLink,
    permission: state => {
        if (!state.permissionName) {
            return true;
        }
        return state.permissionList.indexOf(state.permissionName)>-1;        
        // return state.permission;
    },
    menu: state => state.menu,
    menuList: state => state.menuList,
    authInfo: state => state.workbench.authInfo,
};