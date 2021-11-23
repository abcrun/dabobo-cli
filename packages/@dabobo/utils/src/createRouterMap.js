export default function createRouterMap(context, exclude) {
  const map = {};
  const routers = [];
  const reg = exclude || /\/components?\//i;

  context.keys().forEach((key) => {
    let path = key.substring(1).replace(/\.[^/.]*$/, '');
    const isIndex = /index$/i.test(path);
    const isLayout = /__layout$/i.test(path);
    const module = context(key);

    const router = {
      path,
      name: path.replace(/\//g, '_').replace(/^_+/g, '').replace(/_+/g, '_'),
      component: module.default || (() => module),
    };

    if (isIndex || isLayout) {
      const resolvePath = path.replace(/\/(?:index|__layout)$/i, '') || '/';
      const route = map[resolvePath];

      if (route) {
        if (isIndex) {
          // do nothing, use the default path
        } else if (isLayout) {
          // change the index path to `${path}/index`
          const indexPath = resolvePath + '/index';
          route.path = indexPath;
          map[indexPath] = route;

          // set the layout path
          path = resolvePath;
        }
      } else {
        path = resolvePath;
      }

      router.path = path;
    }

    if (!reg.test(path)) {
      map[path] = router;
    }
  });

  Object.keys(map).forEach((key) => {
    const paths = key === '/' ? [''] : key.split('/');

    let step = 0;
    let path = '';
    let children = routers;

    while (step < paths.length) {
      path = path === '/' ? '/' + paths[step] : path + ('/' + paths[step]);

      const inMap = map[path];
      const inRouters = children.find((router) => router.path === path);

      if (inRouters) {
        children = inRouters.children;
      } else if (inMap) {
        const copyInMap = { ...inMap };
        copyInMap.children = [];
        children.push(copyInMap);

        // If the path '/home' is not the layout, we want to visit '/home/index' same as '/home'
        const { path, name } = inMap;
        const isIndex = /index$/i;
        if (isIndex.test(name) && !isIndex.test(path)) {
          children.push({
            ...inMap,
            path: path + '/index',
          });
        }

        children = copyInMap.children;
      }

      step++;
    }
  });

  return routers;
}
