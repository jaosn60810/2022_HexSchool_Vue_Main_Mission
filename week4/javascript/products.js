import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// bootstrap 實體
let delProductModal = null;
let productModal = null;

//

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'jasonchen',
      products: [],
      tempProduct: { imagesUrl: [] },
      isEdit: false,
      pagination: {},
      nowPage: 1,
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
          window.location = 'index.html';
        });
    },
    getProducts() {
      // 清空 tempProduct
      this.tempProduct = { imagesUrl: [] };

      const url = `${this.apiUrl}/api/${this.path}/admin/products?page=${this.nowPage}`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          this.nowPage = res.data.pagination.current_page;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    changePage(page) {
      // 第一頁不能往前
      if (page <= 1) {
        page = 1;
      }

      // 最後一頁不能往後
      if (page >= this.pagination.total_pages) {
        page = this.pagination.total_pages;
      }

      this.nowPage = page;
      this.getProducts();
    },
    openModal(type, product) {
      // 使用深層拷貝避免改動 modal 的值時，改到外面清單的值
      this.tempProduct = JSON.parse(JSON.stringify(product));
      if (type === 'delete') {
        delProductModal.show();
      } else if (type === 'add') {
        // 清空 tempProduct
        this.tempProduct = { imagesUrl: [] };
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
  },
});

// 分頁元件
app.component('products-pagination', {
  template: '#productsPagination',
  props: ['pagination'],
});

// delete-product-modal
app.component('delete-product-modal', {
  template: '#delProductModal',
  props: ['tempProduct'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'jasonchen',
    };
  },
  mounted() {
    // 創建 bootstrap 實體
    // 刪除的 modal
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal', {
        // esc 沒辦法關掉 modal
        keyboard: false,
        // 點選旁邊沒辦法關掉 modal
        backdrop: 'static',
      })
    );
  },
  methods: {
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.hideModal();
          // 將刪除成功的訊息 emit 到外面
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // 把關閉 modal 拉出來做成 function，將功能拆分清楚
    hideModal() {
      delProductModal.hide();
    },
  },
});

// update-product-modal
app.component('update-product-modal', {
  template: '#productModal',
  props: ['tempProduct', 'isEdit'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      path: 'jasonchen',
    };
  },
  mounted() {
    // 創建 bootstrap 實體
    // 新增和編輯的 modal
    productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        // esc 沒辦法關掉 modal
        keyboard: false,
        // 點選旁邊沒辦法關掉 modal
        backdrop: 'static',
      }
    );
  },
  methods: {
    addProduct() {
      const url = `${this.apiUrl}/api/${this.path}/admin/product`;
      const addData = { data: this.tempProduct };
      axios
        .post(url, addData)
        .then((res) => {
          alert(res.data.message);
          this.hideModal();
          this.$emit('update');
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
          this.hideModal();
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    // 把關閉 modal 拉出來做成 function，將功能拆分清楚
    hideModal() {
      productModal.hide();
    },
  },
});

app.mount('#app');
