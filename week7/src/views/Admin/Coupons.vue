<template>
  <div>
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button
        class="btn btn-primary"
        type="button"
        @click="openCouponModal(true)"
      >
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false, item)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="openDelCouponModal(item)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getCoupons"></Pagination>

    <CouponModal
      :coupon="tempCoupon"
      :is-new="isNew"
      ref="couponModal"
      @add-coupon="addCoupon"
      @edit-coupon="editCoupon"
    />

    <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon" />
  </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    CouponModal,
    DelModal,
    Pagination,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {},
      isLoading: false,
      isNew: false,
      pagination: {},
      currentPage: 1,
    };
  },
  methods: {
    openCouponModal(isNew, item) {
      this.isNew = isNew;

      // 新增優惠券
      if (this.isNew) {
        // 新增優惠卷預設值
        this.tempCoupon = {
          title: '',
          is_enabled: 0,
          percent: 100,
          code: '',
          due_date: new Date().getTime() / 1000,
        };
      }
      // 編輯優惠券
      else {
        this.tempCoupon = { ...item };
      }

      const updateComponent = this.$refs.couponModal;
      updateComponent.openModal();
    },

    openDelCouponModal(item) {
      this.tempCoupon = { ...item };

      const delComponent = this.$refs.delModal;
      delComponent.openModal();
    },
    getCoupons(page = 1) {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.$http
        .get(url, this.tempProduct)
        .then((result) => {
          this.coupons = result.data.coupons;
          this.pagination = result.data.pagination;
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    addCoupon(tempCoupon) {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon`;
      const data = tempCoupon;
      this.$http
        .post(url, { data })
        .then((result) => {
          this.$httpMessageState(result, '新增優惠券');

          this.$refs.couponModal.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;

          this.getCoupons();
        });
    },
    editCoupon(tempCoupon) {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      const data = tempCoupon;
      this.$http
        .put(url, { data })
        .then((result) => {
          this.$httpMessageState(result, '編輯優惠券');

          this.$refs.couponModal.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;

          this.getCoupons();
        });
    },
    delCoupon() {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http
        .delete(url)
        .then((result) => {
          this.$httpMessageState(result, '刪除優惠券');

          const delComponent = this.$refs.delModal;
          delComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '刪除優惠券');
        })
        .finally(() => {
          this.isLoading = false;

          this.getCoupons();
        });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
