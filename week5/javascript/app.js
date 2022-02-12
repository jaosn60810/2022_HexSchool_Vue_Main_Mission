const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'jasonchen';

const app = Vue.createApp({
  data() {
    return {
      products: [],
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
  },
});

app.mount('#app');
