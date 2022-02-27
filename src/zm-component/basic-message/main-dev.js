import Vue from 'vue';
import BMLoading from 'dami-loading';
import timeRemark from 'time-remark';
import init from './init.vue';
import {
  Button,
  Select,
  Option,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Row,
  Table,
  TableColumn,
  Col,
  Radio,
  Dialog
} from 'element-ui';

Vue.use(BMLoading,{
  color:"dark"
})
Vue.component("time-remark",timeRemark)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.component(Message.name, Message)
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$Message = Message;
Vue.prototype.$MessageBox = MessageBox;
new Vue({
  el: '#app',
  template: '<init/>',
  components: {
    init
  }
})
