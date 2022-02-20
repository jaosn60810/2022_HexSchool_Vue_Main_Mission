<template>
  <h2>單一產品</h2>
  <div class="container">
    {{ product }}
    <img :src="product.imageUrl" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
    };
  },
  methods: {
    getProduct() {
      //取出動態路由參數
      const { id } = this.$route.params;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/product/${id}`;

      this.$http(api)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.getProduct();
  },
};
</script>
