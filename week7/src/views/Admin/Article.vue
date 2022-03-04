<template>
  <div>
    <Loading :active="isLoading" :z-index="1060"></Loading>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal(true)">
        建立新的頁面
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th style="width: 200px">標題</th>
          <th style="width: 200px">作者</th>
          <th>描述</th>
          <th style="width: 100px">建立時間</th>
          <th style="width: 100px">是否公開</th>
          <th style="width: 120px">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ $filters.date(article.create_at) }}</td>
          <td>
            <span v-if="article.isPublic">已上架</span>
            <span v-else>未上架</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="getArticle(article.id)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelArticleModal(article)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pages="pagination" @emit-pages="getArticles"></Pagination>

    <ArticleModal
      ref="articleModal"
      :article="tempArticle"
      :is-new="isNew"
      @add-article="addArticle"
      @edit-article="editArticle"
    ></ArticleModal>

    <DelModal :item="tempArticle" ref="delModal" @del-item="delArticle" />
  </div>
</template>

<script>
import ArticleModal from '@/components/ArticleModal.vue';
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  data() {
    return {
      articles: [],
      isLoading: false,
      isNew: false,
      tempArticle: {},
      pagination: {},
      currentPage: 1,
    };
  },
  components: {
    ArticleModal,
    DelModal,
    Pagination,
  },
  methods: {
    getArticles(page = 1) {
      this.isLoading = true;

      this.currentPage = page;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/articles?page=${page}`;
      this.$http
        .get(api)
        .then((result) => {
          if (result.data.success) {
            this.articles = result.data.articles;
            this.pagination = result.data.pagination;
          }
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getArticle(id) {
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${id}`;
      this.$http
        .get(api)
        .then((result) => {
          if (result.data.success) {
            this.openModal(false, result.data.article);
          }
        })
        .catch((error) => {
          // axios 的錯誤狀態，可參考：https://github.com/axios/axios#handling-errors

          this.$httpMessageState(error.response, '錯誤訊息');
          this.$httpMessageState(error.request, '錯誤訊息');
          this.$httpMessageState(error.message, '錯誤訊息');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openModal(isNew, item) {
      this.isNew = isNew;

      // 新增貼文
      if (isNew) {
        this.tempArticle = {
          isPublic: false,
          create_at: new Date().getTime() / 1000,
          tag: [],
        };
      }
      // 編輯貼文
      else {
        this.tempArticle = { ...item };
      }

      const updateComponent = this.$refs.articleModal;
      updateComponent.openModal();
    },
    addArticle(item) {
      this.isLoading = true;

      this.tempArticle = item;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`;
      this.$http
        .post(api, { data: this.tempArticle })
        .then((result) => {
          this.$httpMessageState(result, '新增貼文');

          const articleComponent = this.$refs.articleModal;
          articleComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.getArticles(this.currentPage);

          this.isLoading = false;
        });
    },
    editArticle(item) {
      this.isLoading = true;

      this.tempArticle = item;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
      this.$http
        .put(api, { data: this.tempArticle })
        .then((result) => {
          this.$httpMessageState(result, '更新貼文');

          const articleComponent = this.$refs.articleModal;
          articleComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '錯誤訊息');
        })
        .finally(() => {
          this.getArticles(this.currentPage);

          this.isLoading = false;
        });
    },
    updateArticle(item) {
      this.tempArticle = item;
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article`;
      let httpMethod = 'post';
      let status = '新增貼文';
      this.isLoading = true;
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
        httpMethod = 'put';
        status = '更新貼文';
      }
      const articleComponent = this.$refs.articleModal;
      this.$http[httpMethod](api, { data: this.tempArticle })
        .then((response) => {
          this.isLoading = false;
          this.$httpMessageState(response, status);
          articleComponent.hideModal();
          this.getArticles(this.currentPage);
        })
        .catch((error) => {
          this.isLoading = false;
          this.$httpMessageState(error.response, '錯誤訊息');
        });
    },
    openDelArticleModal(item) {
      this.tempArticle = { ...item };

      const delComponent = this.$refs.delModal;
      delComponent.openModal();
    },
    delArticle() {
      this.isLoading = true;

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/article/${this.tempArticle.id}`;
      this.$http
        .delete(url)
        .then((response) => {
          this.$httpMessageState(response, '刪除貼文');

          const delComponent = this.$refs.delModal;
          delComponent.hideModal();
        })
        .catch((error) => {
          this.$httpMessageState(error.response, '刪除貼文');
        })
        .finally(() => {
          this.getArticles(this.currentPage);

          this.isLoading = false;
        });
    },
  },
  created() {
    this.getArticles();
  },
};
</script>
