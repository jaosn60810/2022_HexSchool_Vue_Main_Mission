import { createApp } from 'vue';

// axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// vue-loading-overlay
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

// toast
import $httpMessageState from '@/methods/pushMessageState';

// filters
import { date, currency } from './methods/filters';

// CKEditor
import CKEditor from '@ckeditor/ckeditor5-vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 千分位逗點和日期轉換
app.config.globalProperties.$filters = {
  date,
  currency,
};

// 可以用 this.$httpMessageState 呼叫方法
app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(router);
app.use(VueAxios, axios);
app.use(CKEditor);

app.component('Loading', Loading);

app.mount('#app');
