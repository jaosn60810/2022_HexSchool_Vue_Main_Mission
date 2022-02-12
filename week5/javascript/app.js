const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

// bootstrap 實體
let showProductModal = null;

const app = Vue.createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
    };
  },
  mounted() {
    this.getProducts();
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
    openModal(product) {
      this.tempProduct = { ...product };
      showProductModal.show();
    },
  },
});

app.component('show-product-modal', {
  template: '#userProductModal',
  props: ['tempProduct'],
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
});

app.mount('#app');
