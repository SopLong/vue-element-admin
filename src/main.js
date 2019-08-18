// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Request from './request/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueQuillEditor from 'vue-quill-editor';

// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import FullCalendar from 'vue-fullcalendar';

import moment from 'moment';// 导入文件

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

Vue.prototype.$moment = moment;// 赋值使用
Vue.use(FullCalendar);

Vue.use(VueQuillEditor, {
  placeholder: '请输入内容'
});

Vue.config.productionTip = false;
Vue.prototype.$request = Request;
Vue.prototype.$bus = new Vue();
Vue.use(ElementUI, { size: 'small' });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
