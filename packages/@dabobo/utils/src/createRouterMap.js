export default function createRouterMap(context, exclude) {
  const routes = [];
  const reg = exclude || /\/components?\//i;

  const map = context.keys().reduce((map, key) => {
    const path = key
      .substring(1)
      .replace(/\/\$/g, '/:')
      .replace(/\.[^/.]*$/, '');
    const isLayout = /__layout$/i.test(path);
    const module = context(key);

    const router = {
      path,
      uri: path.replace(/\//g, '_').replace(/^_+/g, '').replace(/_+/g, '_'),
      component: module.default || (() => module),
    };

    // __layout作为其所在path的组件
    const resolvePath = isLayout
      ? path.replace(/\/__layout$/i, '') || '/'
      : path;

    if (!reg.test(path)) {
      router.path = resolvePath;
      map[resolvePath] = router;
    }

    return map;
  }, {});

  Object.keys(map).forEach((key) => {
    const paths = key === '/' ? [''] : key.split('/');

    let step = 0;
    let path = '';
    let children = routes;

    while (step < paths.length) {
      path = path === '/' ? '/' + paths[step] : path + ('/' + paths[step]);

      const index = path + '/index';
      const hasIndex = map[index];
      const inMap = map[path];
      const inRoutes = children.find((route) => route.path === path);

      // 如果/home/__layout.xx和/home/index.xx同时存在
      // 我们访问/home时，自动redirect到/home/index
      // 同时/home的component必须是/home/__layout
      if (inMap) {
        let current;

        if (inRoutes) {
          current = inRoutes;
        } else {
          current = { ...inMap };
          current.children = [];
          children.push(current);
        }

        if (hasIndex) current.redirect = index;

        children = current.children;
      } else if (hasIndex) {
        // 如果只有/home/index.xx没有/home/__layout.xx
        // 此时map中并不存在map['/home'],但存在map['/home/index']
        // 此时如果访问/home时，自动索引指向这个index文件
        children.push({
          path,
          component: hasIndex.component,
        });
      }

      step++;
    }
  });

  return { routes, map };
}
