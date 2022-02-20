<template>
  <Loading :active="isLoading"></Loading>

  <h2>單一產品</h2>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <img :src="product.imageUrl" alt="" class="img-fluid" />
      </div>

      <div class="col-md-6">
        <h2>{{ product.title }}</h2>
        <p>{{ product.description }}</p>
        <p class="text-secondary" v-if="product.content">
          {{ product.content }}
        </p>

        <p class="h5" v-if="!product.price">{{ product.origin_price }} 元</p>
        <del class="h6" v-if="product.price"
          >原價 {{ product.origin_price }} 元</del
        >
        <p class="h5" v-if="product.price">
          現在只要 {{ product.price }} 元
          <small class="fs-7 ms-2 text-secondary">/ {{ product.unit }}</small>
        </p>

        <div class="col-md-9 d-md-flex">
          <input
            type="number"
            min="1"
            class="form-control text-center text-md-start"
            v-model.number="product.qty"
            inputmode="numeric"
          />
          <button
            class="btn btn-primary col-12 col-md-7 ms-md-2 p-3 mt-3 mt-md-0"
            type="button"
            @click="addToCart(product.id, product.qty)"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '@/libs/emitter';

export default {
  data() {
    return {
      product: {},
      isLoading: false,
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
          // 初始值為 1
          this.product.qty = 1;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addToCart(id, qty = 1) {
      if (qty < 1) {
        alert('請輸入數量');
        return;
      }

      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/cart`;
      const data = { product_id: id, qty };
      this.$http
        .post(api, { data })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            // 發送 get-cart 事件，讓 FrontNavbar 知道
            emitter.emit('get-cart');

            // 整頁 loading，關閉效果
            this.isLoading = false;
          } else {
            alert(res.data.message);
          }
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
