<template>
  <div>
    <h1>This is 產品列表頁面</h1>

    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              style="
                height: 100px;
                background-size: cover;
                background-position: center;
              "
              :style="{ backgroundImage: `url(${item.imageUrl})` }"
            ></div>
          </td>
          <td>
            {{ item.title }}
          </td>
          <td>
            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
            <div v-else>
              <del class="h6">原價 {{ item.origin_price }} 元</del>
              <div class="h5">現在只要 {{ item.price }} 元</div>
            </div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="getProduct(item.id)"
                :disabled="loadingItem === item.id"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="loadingItem === item.id"
                ></i>
                查看更多
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="addToCart(item.id)"
                :disabled="loadingItem === item.id"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="loadingItem === item.id"
                ></i>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      pagination: {},
    };
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/products`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
  },
};
</script>
