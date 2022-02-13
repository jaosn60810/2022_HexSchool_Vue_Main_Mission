import showProductModal from './showProductModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: {},
      isDisabled: false,
    };
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}/v2/api/${apiPath}/products`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    getCarts() {
      const url = `${apiUrl}/v2/api/${apiPath}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addToCart(productId, productNum = 1) {
      const url = `${apiUrl}/v2/api/${apiPath}/cart`;
      const data = {
        product_id: productId,
        qty: productNum,
      };
      axios
        .post(url, { data })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          this.getCarts();
        });
    },
    editProductNumInCart(cartId, productId, productNum) {
      // 鎖住輸入欄
      this.isDisabled = true;

      const url = `${apiUrl}/v2/api/${apiPath}/cart/${cartId}`;
      const data = {
        product_id: productId,
        qty: productNum,
      };
      axios
        .put(url, { data })
        .then((res) => {
          alert(res.data.message);
          this.getCarts();

          this.isDisabled = false;
        })
        .catch((err) => {
          alert(err.data.message);
          this.getCarts();

          this.isDisabled = false;
        });
    },
    removeFromCart(cartId) {
      let url = `${apiUrl}/v2/api/${apiPath}/cart/${cartId}`;

      if (cartId === 'all') {
        url = `${apiUrl}/v2/api/${apiPath}/carts`;
      }

      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(product) {
      this.tempProduct = { ...product };
      this.$refs.showProductModal.openModal();
    },
  },
});

app.component('show-product-modal', showProductModal);

app.mount('#app');
