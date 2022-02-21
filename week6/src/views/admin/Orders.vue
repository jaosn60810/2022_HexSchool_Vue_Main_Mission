<template>
  <div>
    這裡是 後台 訂單列表
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">時間</th>
          <th>付款</th>
          <th width="120">總金額</th>
          <th width="120">訂購人</th>
          <th width="100">數量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{ new Date(item.create_at * 1000).toLocaleDateString() }}</td>
          <td>{{ item.is_paid }}</td>
          <td>
            {{ item.total }}
          </td>
          <td>
            {{ item.user.name }}
          </td>
          <td>
            {{ item.num }}
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      pagination: {},
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getOrders(page = 1) {
      // API
      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http
        .get(api)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
