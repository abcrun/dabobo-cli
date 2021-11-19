import { createRouter, createWebHistory } from 'vue-router';
import { createRouterMap } from '@dabobo/utils';

const routes = createRouterMap(
  require.context('./views', true, /\.vue/, 'lazy'),
  /\/404\.vue/
);

routes.push({
  path: '/:pathMatch(.*)*',
  component: import('./views/404.vue'),
});
routes.unshift({
  path: '/',
  redirect: '/home/index',
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
