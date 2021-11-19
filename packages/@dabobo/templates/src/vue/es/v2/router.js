import Vue from 'vue';
import Router from 'vue-router';
import { createRouterMap } from '@dabobo/utils';

Vue.use(Router);

const routes = createRouterMap(
  require.context('./views', true, /\.vue/, 'lazy'),
  /\/404\.vue/
);

routes.push({
  path: '/*',
  component: () => import('./views/404.vue'),
});
routes.unshift({
  path: '/',
  redirect: '/home/index',
});

const router = new Router({
  mode: 'history',
  routes,
});

export default router;
