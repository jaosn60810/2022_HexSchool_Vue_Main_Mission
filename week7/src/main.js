import { createApp } from 'vue';

// axios
import axios from 'axios';
import VueAxios from 'vue-axios';

// vue-loading-overlay
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

// toast
import $httpMessageState from '@/methods/pushMessageState';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(router);
app.use(VueAxios, axios);

app.component('Loading', Loading);

app.mount('#app');
