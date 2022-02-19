<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 上一頁按鈕 -->
      <li class="page-item" :class="{ disabled: pages.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="emitPages(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 頁碼 -->
      <li
        v-for="(item, index) in pages.total_pages"
        :key="item + index"
        class="page-item"
        :class="{ active: item === pages.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="emitPages(item)">
          {{ item }}
        </a>
      </li>

      <!-- 下一頁按鈕  -->
      <li class="page-item" :class="{ disabled: pages.has_pre }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="emitPages(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
};
</script>
