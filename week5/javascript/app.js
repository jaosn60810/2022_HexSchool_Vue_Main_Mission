import showProductModal from './showProductModal.js';

// VeeValiadation
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 定義規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 加入多國語系外部資源
loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
);

// Activate the locale
configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: {
        carts: [],
      },
      // 判斷是否在 loading 狀態
      loadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
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
    createOrder() {
      const url = `${apiUrl}/v2/api/${apiPath}/order`;
      const order = this.form;

      axios
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          // 清空表單
          this.$refs.form.resetForm();
          this.getCarts();
        });
    },
  },
});

app.component('show-product-modal', showProductModal);

app.mount('#app');
