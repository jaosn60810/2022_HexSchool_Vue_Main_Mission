<template>
  <nav
    class="navbar navbar-expand-lg navbar-light"
    style="background-color: #e3f2fd"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">一定是大拇指</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">回到前台</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products"
              >後台產品列表</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/orders"
              >後台訂單</router-link
            >
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link" @click.prevent="signOut">登出</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    signOut() {
      // 清空 cookie 裡的 token
      document.cookie = 'hexToken=;expires=;';
      alert('token 已清除');

      // 退回登入頁面
      this.$router.push('/login');
    },
  },
};
</script>
