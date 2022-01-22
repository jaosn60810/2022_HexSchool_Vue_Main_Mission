import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// bootstrap 實體
let delProductModal = null;
let productModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'jasonchen',
      products: [],
      tempProduct: { imagesUrl: [] },
      isEdit: false,
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
          // 清空 tempProduct
          this.tempProduct = { imagesUrl: [] };
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product`;
      const addData = { data: this.tempProduct };
      axios
        .post(url, addData)
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          // 清空 tempProduct
          this.tempProduct = { imagesUrl: [] };
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    editProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      const editData = { data: this.tempProduct };
      axios
        .put(url, editData)
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          // 清空 tempProduct
          this.tempProduct = { imagesUrl: [] };
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    openModal(type, product) {
      // 深層拷貝避免不明錯誤
      this.tempProduct = JSON.parse(JSON.stringify(product));
      if (type === 'delete') {
        delProductModal.show();
      } else if (type === 'add') {
        this.isEdit = false;
        productModal.show();
      } else if (type === 'edit') {
        this.isEdit = true;
        productModal.show();
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
    // 刪除的 modal
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal')
    );
    // 新增和編輯的 modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
  },
});

app.mount('#app');
