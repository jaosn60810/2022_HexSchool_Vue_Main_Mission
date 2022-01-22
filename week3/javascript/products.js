import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'jasonchen',
      products: [],
      tempProduct: {},
    };
  },
  methods: {
    checkLogin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          // 失敗則重新導回登入頁面
          window.location = 'login.html';
        });
    },
    getProducts() {
      const url = `${this.apiUrl}/api/${this.path}/admin/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteProduct(product) {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${product.id}`;
      axios
        .delete(url)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    // 取得 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    // 每次請求都會帶 token
    axios.defaults.headers.common['Authorization'] = token;
    // 確認是否登入
    this.checkLogin();
  },
});

app.mount('#app');
