<template>
  <Navbar />
  <div class="container-fluid mt-3 position-relative">
    <ToastMessages></ToastMessages>
    <router-view v-if="status" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    Navbar,
    ToastMessages,
  },
  data() {
    return {
      status: false,
    };
  },
  created() {
    // 取出 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    // 設定每次請求帶上 cookie
    this.$http.defaults.headers.common.Authorization = `${token}`;

    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http
      .post(api)
      .then((result) => {
        this.$httpMessageState(result, '登入');
        this.status = true;
      })
      .catch((error) => {
        this.$router.push('/');
        this.$httpMessageState(error.response, '錯誤訊息');
      });
  },
};
</script>
