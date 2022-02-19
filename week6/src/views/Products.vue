<template>
  <div class="container">
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
    <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>

    <UserProductModal
      ref="userProductModal"
      :product="product"
      @add-to-cart="addToCart"
    ></UserProductModal>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
import UserProductModal from '@/components/UserProductModal.vue';

export default {
  data() {
    return {
      product: {},
      products: [],
      pagination: {},
    };
  },
  components: {
    Pagination,
    UserProductModal,
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/products?page=${page}`;
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
    getProduct(id) {
      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/product/${id}`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product;
            this.showModal();
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
    showModal() {
      this.$refs.userProductModal.showModal();
    },
    hideModal() {
      this.$refs.userProductModal.hideModal();
    },
    addToCart(id, qty = 1) {
      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/cart`;
      const data = { product_id: id, qty };
      this.$http
        .post(api, { data })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.hideModal();
          }
        })
        .catch((err) => {
          console.dir(err);
        });
    },
  },
};
</script>
