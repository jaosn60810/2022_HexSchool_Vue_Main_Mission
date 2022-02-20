<template>
  <div class="home">
    <FrontNavbar></FrontNavbar>
    <router-view></router-view>
  </div>
</template>

<script>
import FrontNavbar from '@/components/FrontNavbar.vue';

export default {
  name: 'Home',
  components: {
    FrontNavbar,
  },
  data() {
    return {};
  },
};
</script>
