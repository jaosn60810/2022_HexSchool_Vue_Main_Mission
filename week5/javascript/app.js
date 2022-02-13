import showProductModal from './showProductModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: {},
      // 判斷是否在 loading 狀態
      loadingItem: '',
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
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;

      this.loadingItem = id;

      axios
        .get(url)
        .then((response) => {
          this.tempProduct = response.data.product;
          this.$refs.showProductModal.openModal();
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          this.loadingItem = '';
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

      this.loadingItem = productId;

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
          this.loadingItem = '';
        });
    },
    editProductNumInCart(cart) {
      this.loadingItem = cart.id;

      const url = `${apiUrl}/v2/api/${apiPath}/cart/${cart.id}`;
      const data = {
        product_id: cart.product_id,
        qty: cart.qty,
      };
      axios
        .put(url, { data })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          this.loadingItem = '';
          this.getCarts();
        });
    },
    removeFromCart(cartId) {
      let url = `${apiUrl}/v2/api/${apiPath}/cart/${cartId}`;

      if (cartId === 'all') {
        url = `${apiUrl}/v2/api/${apiPath}/carts`;
      }

      this.loadingItem = cartId;

      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          this.loadingItem = '';
          this.getCarts();
        });
    },
  },
});

app.component('show-product-modal', showProductModal);

app.mount('#app');
