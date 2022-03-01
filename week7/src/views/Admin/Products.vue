<template>
  <div>
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ $filters.currency(item.origin_price) }}
          </td>
          <td class="text-right">
            {{ $filters.currency(item.price) }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="openModal(false, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelProductModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>

    <!-- ProductModal -->
    <ProductModal
      @add-product="addProduct"
      @edit-product="editProduct"
      :product="tempProduct"
      :isNew="isNew"
      ref="productModal"
    />
    <!-- DelModal -->
    <DelModal
      @del-item="delProduct"
      :item="tempProduct"
      ref="delModal"
    ></DelModal>
  </div>
</template>

<script>
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';
import ProductModal from '@/components/ProductModal.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
      // 記錄當下頁數，避免拿資料時，跳回第一頁
      currentPage: 1,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      this.currentPage = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.isLoading = true;
      this.$http
        .get(api)
        .then((result) => {
          this.products = result.data.products;
          this.pagination = result.data.pagination;
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openModal(isNew, item) {
      // 新增產品
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      }
      // 編輯產品
      else {
        this.tempProduct = { ...item };
        this.isNew = false;
      }
      const productComponent = this.$refs.productModal;
      productComponent.openModal();
    },
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.openModal();
    },
    addProduct(item) {
      this.isLoading = true;

      this.tempProduct = item;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
      this.$http
        .post(api, { data: this.tempProduct })
        .then((result) => {
          this.$httpMessageState(result, '新增產品');

          const productComponent = this.$refs.productModal;
          productComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '新增產品');
        })
        .finally(() => {
          this.isLoading = false;
          this.getProducts(this.currentPage);
        });
    },
    editProduct(item) {
      this.isLoading = true;

      this.tempProduct = item;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http
        .put(api, { data: this.tempProduct })
        .then((result) => {
          this.$httpMessageState(result, '編輯產品');

          const productComponent = this.$refs.productModal;
          productComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '編輯產品');
        })
        .finally(() => {
          this.isLoading = false;
          this.getProducts(this.currentPage);
        });
    },
    delProduct() {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http
        .delete(url)
        .then((result) => {
          this.$httpMessageState(result, '刪除產品');

          const delComponent = this.$refs.delModal;
          delComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '刪除產品');
        })
        .finally(() => {
          this.isLoading = false;
          this.getProducts(this.currentPage);
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
