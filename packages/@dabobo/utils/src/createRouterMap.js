function recurveRouter(children, router) {
  const { path } = router;
  const result = children.find((child) => path.indexOf(child.path) === 0);

  if (result) {
    result.children = result.children || [];
    recurveRouter(result.children, router);
  } else {
    if (/\*$/.test(path)) {
      children.push(router);
    } else {
      children.unshift(router);
    }
  }
}

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
      component: module.default || (() => module),
    };

    if (isIndex) {
      path = path.replace(/\/index.*$/, '') || '/';
      router.path = path;
    }

    if (isLayout) {
      path = path.replace(/\/__layout.*$/, '') || '/';
      router.path = path;
    }

    if (!reg.test(path)) {
      map[path] = router;
    }
  });

  Object.keys(map).forEach((key) => {
    recurveRouter(routers, map[key]);
  });

  return routers;
}
