import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const url = `${this.apiUrl}/admin/signin`;
      axios
        .post(url, this.user)
        .then((res) => {
          // 將回傳的 res 裡的 token 和 expired 拿出
          const { token, expired } = res.data;
          //  將 token 寫入 cookie
          document.cookie = `hexToken=${token}; 
          expires=${new Date(expired)};`;

          // 切換頁面
          window.location = 'index.html';
        })
        .catch((err) => alert(err.data.message));
    },
  },
});

app.mount('#app');
