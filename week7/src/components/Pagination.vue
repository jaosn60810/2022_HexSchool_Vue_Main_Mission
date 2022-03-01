<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li :class="{ disabled: !pages.has_pre }" class="page-item">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="updatePage(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 頁碼 -->
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page"
        :class="{ active: pages.current_page === page }"
      >
        <span class="page-link" v-if="page === pages.current_page">{{
          page
        }}</span>
        <a
          class="page-link"
          v-else
          href="#"
          @click.prevent="updatePage(page)"
          >{{ page }}</a
        >
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: !pages.has_next }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="updatePage(pages.current_page + 1)"
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
  emits: ['emitPages'],
  methods: {
    updatePage(page) {
      this.$emit('emitPages', page);
    },
  },
};
</script>
