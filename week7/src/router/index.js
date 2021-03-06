import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',

    component: () => import('../views/Login.vue'),
  },
  // 後台
  {
    path: '/admin',
    component: () => import('../views/Admin/DashBoard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/Admin/Products.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/Admin/Orders.vue'),
      },
      {
        path: 'coupons',
        component: () => import('../views/Admin/Coupons.vue'),
      },
      {
        path: 'article',
        component: () => import('../views/Admin/Article.vue'),
      },
    ],
  },
  // 重新導回登入頁面
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Login' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'active',
});

export default router;
