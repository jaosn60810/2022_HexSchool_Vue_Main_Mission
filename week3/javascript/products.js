import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let delProductModal = '';

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
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(type, product) {
      this.tempProduct = product;
      if (type === 'delete') {
        delProductModal.show();
      }
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

    // 創建 bootstrap 實體
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal')
    );
  },
});

app.mount('#app');
