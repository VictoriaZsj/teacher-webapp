// es6 polyfill
import DateTool from './utils/date';
import locale from './locale';
import fetch from './utils/fetch.js';

// 导入element-ui 组件
import ElPagination from './ele-component/pagination/index.js';
import Message from './ele-component/message';
import Modal from './components/modal';
import ElDialog from './ele-component/dialog/index.js';
import ElAutocomplete from './ele-component/autocomplete/index.js';
import ElDropdown from './ele-component/dropdown/index.js';
import ElDropdownMenu from './ele-component/dropdown-menu/index.js';
import ElDropdownItem from './ele-component/dropdown-item/index.js';
import ElMenu from './ele-component/menu/index.js';
import ElSubmenu from './ele-component/submenu/index.js';
import ElMenuItem from './ele-component/menu-item/index.js';
import ElMenuItemGroup from './ele-component/menu-item-group/index.js';
import ElMenuNew from './ele-component/menu-1.4.13/index.js';
import ElSubmenuNew from './ele-component/submenu-1.4.13/index.js';
import ElMenuItemNew from './ele-component/menu-item-1.4.13/index.js';
import ElMenuItemGroupNew from './ele-component/menu-item-group-1.4.13/index.js';
import ElInput from './ele-component/input/index.js';
import ElInputNumber from './ele-component/input-number/index.js';
import ElRadio from './ele-component/radio/index.js';
import ElRadioGroup from './ele-component/radio-group/index.js';
import ElRadioButton from './ele-component/radio-button/index.js';
import ElCheckbox from './ele-component/checkbox/index.js';
import ElCheckboxGroup from './ele-component/checkbox-group/index.js';
import ElSwitch from './ele-component/switch/index.js';
import ElSelect from './ele-component/select/index.js';
import ElOption from './ele-component/option/index.js';
import ElOptionGroup from './ele-component/option-group/index.js';
import ElButton from './ele-component/button/index.js';
import ElButtonGroup from './ele-component/button-group/index.js';
import ElTable from './ele-component/table/index.js';
import ElTableColumn from './ele-component/table-column/index.js';
import ElDatePicker from './ele-component/date-picker/index.js';
import ElTimeSelect from './ele-component/time-select/index.js';
import ElTimePicker from './ele-component/time-picker/index.js';
import ElPopover from './ele-component/popover/index.js';
import ElTooltip from './ele-component/tooltip/index.js';
import MessageBox from './ele-component/message-box/index.js';
// import ElForm from './ele-component/form/index.js';
// import ElFormItem from './ele-component/form-item/index.js';
import ElTabs from './ele-component/tabs/index.js';
import ElTabPane from './ele-component/tab-pane/index.js';
import ElTree from './ele-component/tree/index.js';
import ElAlert from './ele-component/alert/index.js';
import Notification from './ele-component/notification/index.js';
import ElIcon from './ele-component/icon/index.js';
import ElRow from './ele-component/row/index.js';
import ElCol from './ele-component/col/index.js';
import ElBadge from './ele-component/badge/index.js';
import ElRate from './ele-component/rate/index.js';
import ElCollapse from './ele-component/collapse/index.js';
import ElCollapseItem from './ele-component/collapse-item/index.js';
import ElLoading from './ele-component/loading/index.js';
import ElCollapseTransition from './collapse-transition';
import ElTransferForm from './ele-component/transfer-form/index.js';
import ElTag from './ele-component/tag/index.js';

// 引入掌门uio
import LoadingBar from './zm-component/loading-bar/index.js';
import Spin from './zm-component/spin/index.js';
import Dashboard from './zm-component/dashboard/index.js';
import MainTab from './zm-component/main-tab/index.js';
import zmUpload from './zm-component/zm-upload/index.js';
import ZmUploader from './zm-component/zm-uploader';
import zmLoading from './zm-component/zm-loading/index.js';
import zmHover from './zm-component/zm-hover/index.js';
import zmDatepicker from './zm-component/zm-datepicker/index.js';
import zmFile from './zm-component/zm-file/index.js';
import timeRemark from 'time-remark';
import BMLoading from 'dami-loading';

const zm = {
  ElRate,
  ElTree,
  ElPagination,
  ElDialog,
  ElAutocomplete,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElSwitch,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElButton,
  ElButtonGroup,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  ElTimeSelect,
  ElTimePicker,
  ElPopover,
  ElTooltip,
  MessageBox,
  // ElForm,
  // ElFormItem,
  ElTabs,
  ElTabPane,
  ElAlert,
  ElIcon,
  ElRow,
  ElCol,
  ElBadge,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  // 引入掌门ui
  LoadingBar,
  Spin,
  Dashboard,
  MainTab,
  zmUpload,
  ZmUploader,
  zmLoading,
  zmHover,
  zmDatepicker,
  timeRemark,
  zmFile,
  ElMenuNew,
  ElSubmenuNew,
  ElMenuItemNew,
  ElMenuItemGroupNew,
  ElLoading,
  ElTransferForm,
  ElTag,
};

const install = function (Vue, opts = {}) {
  if (install.installed) return;

  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  Object.keys(zm).forEach((key) => {
    Vue.component(key, zm[key]);
  });
  // Vue.prototype.$Loading = LoadingBar;
  Vue.prototype.$Message = Message;
  Vue.prototype.$MessageBox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$Modal = Modal;
  /**
   * 保持elementui小写方法
   */
  Vue.prototype.$message = Message;
  Vue.prototype.$messageBox = MessageBox;
  Vue.prototype.$modal = Modal;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$Fetch = fetch;

  Vue.component('dami-datepicker', zmDatepicker);
  Vue.use(BMLoading);
  Vue.component('time-remark', timeRemark);
  Vue.use(ElLoading.directive);
  // 处理时间格式
  function fliterDate(value, format) {
    // 返回处理后的值
    if (!value) {
      return '';
    } else {
      let F = 'yyyy-MM-dd HH:mm:ss';
      if (!!format == true) {
        F = format;
      }
      return DateTool.format(value, F);
    }
  }
  Vue.filter('dateTransform', fliterDate);
  window.dateTransform = fliterDate;
  Vue.prototype.$DateTransform = fliterDate;
  Vue.prototype.$DateTool = DateTool;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

window.isEmpty = function (value) {
  return typeof value === 'undefined' || value === '' || value === null;
};
let format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
};
Date.prototype.format = format;

window.toParams = function (data) {
  var url = '';
  for (var item in data) {
    if (!window.isEmpty(data[item])) {
      url = url + '&' + item + '=' + data[item];
    }
  }
  url = url.replace('&', '?');
  return url;
};

export default Object.assign( zm, { install }); // eslint-disable-line no-undef
