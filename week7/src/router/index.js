import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Login',

    component: () => import('../views/Login.vue'),
  },
  {
    path: '/admin',

    component: () => import('../views/Admin/DashBoard.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
