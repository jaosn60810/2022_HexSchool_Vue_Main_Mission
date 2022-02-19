import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/Index.vue'),
      },
      {
        path: '/products',
        component: () => import('../views/Products.vue'),
      },
      {
        path: '/cart',
        component: () => import('../views/Cart.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
