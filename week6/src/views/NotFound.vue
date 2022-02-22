<template>
  <FrontNavbar></FrontNavbar>
  <div class="container">
    <h1>找不到頁面唷...</h1>
    <a
      href="https://c.tenor.com/_4YgA77ExHEAAAAC/rick-roll.gif"
      class="btn btn-primary"
      >回首頁</a
    >
  </div>
</template>

<script>
import FrontNavbar from '@/components/FrontNavbar.vue';

export default {
  name: 'NotFound',
  data() {
    return {};
  },
  components: {
    FrontNavbar,
  },
};
</script>

<style lang="scss" scoped>
a {
  /* Start the shake animation and make the animation last for 0.5 seconds */
  animation: shake 0.5s;

  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
