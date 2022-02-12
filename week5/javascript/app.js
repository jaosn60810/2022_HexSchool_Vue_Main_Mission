const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

// bootstrap 實體
let showProductModal = null;

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: {},
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
          this.getCarts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    removeFromCart(productId) {
      let url = `${apiUrl}/v2/api/${apiPath}/cart/${productId}`;

      if (productId === 'all') {
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
      showProductModal.show();
    },
  },
});

app.component('show-product-modal', {
  template: '#userProductModal',
  props: ['tempProduct'],
  data() {
    return {
      productNum: 1,
    };
  },
  mounted() {
    showProductModal = new bootstrap.Modal(
      document.getElementById('productModal', {
        // esc 沒辦法關掉 modal
        keyboard: false,
        // 點選旁邊沒辦法關掉 modal
        backdrop: 'static',
      })
    );
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.tempProduct.id, this.productNum);
      showProductModal.hide();
    },
  },
});

app.mount('#app');
