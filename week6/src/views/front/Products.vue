<template>
  <div class="container">
    <Loading :active="isLoading" :z-index="1060"></Loading>

    <h1>This is 產品列表頁面</h1>

    <div class="container">
      <div class="row row-cols-1 row-cols-lg-4 g-3">
        <div class="col" v-for="product in products" :key="product.id">
          <div class="card h-100">
            <img
              :src="product.imageUrl"
              class="card-img-top"
              alt="product.title"
            />
            <div class="card-body">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">
                {{ product.description }}
              </p>
            </div>
            <div class="card-footer d-flex justify-content-around">
              <router-link
                :to="`/product/${product.id}`"
                class="btn btn-outline-primary"
                >產品頁面
              </router-link>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="addToCart(product.id)"
                :disabled="loadingItem === product.id"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="loadingItem === product.id"
                ></i>
                加到購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

    <!-- 分頁元件 -->
    <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>

    <!-- 查看更多 modal -->
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
import emitter from '@/libs/emitter';

export default {
  name: 'Products',
  data() {
    return {
      product: {},
      products: [],
      pagination: {},
      loadingItem: '',
      isLoading: false,
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
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;

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
    getProduct(id) {
      // 需要 loading 效果的商品 id，開啟效果
      this.loadingItem = id;
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/product/${id}`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product;
            this.showModal();

            // 需要 loading 效果的商品 id，關閉效果
            this.loadingItem = '';
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
    showModal() {
      this.$refs.userProductModal.showModal();
    },
    hideModal() {
      this.$refs.userProductModal.hideModal();
    },
    addToCart(id, qty = 1) {
      // 需要 loading 效果的商品 id，開啟效果
      this.loadingItem = id;
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/cart`;
      const data = { product_id: id, qty };
      this.$http
        .post(api, { data })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.hideModal();

            // 發送 get-cart 事件，讓 FrontNavbar 知道
            emitter.emit('get-cart');

            // 需要 loading 效果的商品 id，關閉效果
            this.loadingItem = '';
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
};
</script>
