export default {
  template: '#userProductModal',
  props: ['tempProduct'],
  data() {
    return {
      productNum: 1,
      modal: '',
    };
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      // esc 沒辦法關掉 modal
      keyboard: false,
      // 點選旁邊沒辦法關掉 modal
      backdrop: 'static',
    });
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.tempProduct.id, this.productNum);
      this.hideModal();
    },
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
};
