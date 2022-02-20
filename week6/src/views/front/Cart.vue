<template>
  <div class="container">
    <Loading :active="isLoading"></Loading>

    <h1>This is 購物車頁面</h1>

    <!-- 購物車列表 start -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>

            <tbody>
              <template v-if="cart.carts">
                <tr v-for="item in cart.carts" :key="item.id">
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="removeCartItem(item.id)"
                      :disabled="loadingItem === item.id"
                    >
                      <i
                        class="fas fa-spinner fa-pulse"
                        v-if="loadingItem === item.id"
                      ></i>
                      移除購物車
                    </button>
                  </td>
                  <td>
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">
                      已套用優惠券
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      {{ item.qty }} / {{ item.product.unit }}
                    </div>
                  </td>
                  <td class="text-end">
                    <small
                      v-if="cart.final_total !== cart.total"
                      class="text-success"
                      >折扣價：</small
                    >
                    {{ item.final_total }}
                  </td>
                </tr>
              </template>
            </tbody>

            <tfoot>
              <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ cart.total }}</td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ cart.final_total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <!-- 購物車列表 end -->

      <!-- 表單 start -->
      <div class="my-5 row justify-content-center">
        <Form
          ref="form"
          class="col-md-6"
          v-slot="{ errors }"
          @submit="createOrder"
        >
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入 Email"
              rules="email|required"
              v-model="form.user.email"
            ></Field>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <Field
              id="name"
              name="姓名"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['姓名'] }"
              placeholder="請輸入姓名"
              rules="required"
              v-model="form.user.name"
            ></Field>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <Field
              id="tel"
              name="電話"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': errors['電話'] }"
              placeholder="請輸入電話"
              rules="required|numeric|min:8|max:10"
              v-model="form.user.tel"
            ></Field>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <Field
              id="address"
              name="地址"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors['地址'] }"
              placeholder="請輸入地址"
              rules="required"
              v-model="form.user.address"
            ></Field>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea
              name=""
              id="message"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-end">
            <button
              type="submit"
              class="btn btn-danger"
              :disabled="
                Object.keys(errors).length > 0 || cart.carts.length === 0
              "
            >
              送出訂單
            </button>
          </div>
        </Form>
      </div>
      <!-- 表單 end -->
    </div>
  </div>
</template>

<script>
import emitter from '@/libs/emitter';

export default {
  name: 'Cart',
  data() {
    return {
      loadingItem: '',
      isLoading: false,
      cart: {
        carts: [],
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  mounted() {
    this.getCart();
  },
  methods: {
    getCart() {
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/cart`;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.cart = res.data.data;

            // 發送 get-cart 事件，讓 FrontNavbar 知道
            emitter.emit('get-cart');
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          // 整頁 loading，關閉效果
          this.isLoading = false;
        });
    },
    removeCartItem(id) {
      // 需要 loading 效果的商品 id，開啟效果
      this.loadingItem = id;
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.$http
        .delete(api)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          this.getCart();
          // 需要 loading 效果的商品 id，關閉效果
          this.loadingItem = '';
          // 整頁 loading，關閉效果
          this.isLoading = false;
        });
    },
    createOrder() {
      // 整頁 loading，開啟效果
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/v2/api/${process.env.VUE_APP_PATH}/order`;
      this.$http
        .post(api, { data: this.form })
        .then((res) => {
          alert(res.data.message);

          // 如果成功送出表單，清空表單
          if (res.data.success) {
            this.$refs.form.resetForm();
          }
        })
        .catch((err) => {
          alert(err.data.message);
        })
        .finally(() => {
          // 清空購物車
          this.getCart();
          // 整頁 loading，關閉效果
          this.isLoading = false;
        });
    },
  },
};
</script>
