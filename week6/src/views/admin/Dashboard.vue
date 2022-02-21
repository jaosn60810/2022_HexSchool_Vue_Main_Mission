<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <router-view v-if="checkSuccess"></router-view>
  </div>
</template>

<script>
import AdminNavbar from '@/components/AdminNavbar.vue';
import emitter from '@/libs/emitter';

export default {
  name: 'Dashboard',
  data() {
    return {
      checkSuccess: false,
    };
  },
  components: {
    AdminNavbar,
  },
  mounted() {
    this.checkLogin();

    // 更換 navbar
    emitter.emit('change-navbar-component');
  },
  methods: {
    checkLogin() {
      // 取出 cookie
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      );

      // 如果有 cookie
      if (token) {
        // Axios 預設值
        this.$http.defaults.headers.common.Authorization = `${token}`;

        const api = `${process.env.VUE_APP_API}/v2/api/user/check`;
        this.$http
          .post(api)
          .then(() => {
            this.checkSuccess = true;
          })
          .catch((err) => {
            alert(err.data.message);

            // 退回登入頁面
            this.$router.push('/login');
          });
      } else {
        alert('您尚未登入。');

        // 退回登入頁面
        this.$router.push('/login');
      }
    },
  },
};
</script>
