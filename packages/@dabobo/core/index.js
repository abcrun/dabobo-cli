function recurveRouter(children, router) {
  const { path } = router;
  const result = children.find((child) => path.indexOf(child.path) === 0);

  if (result) {
    result.children = result.children || [];
    recurveRouter(result.children, router);
  } else {
    children.push(router);
  }
}

export default function createRouterMap(context) {
  const map = {};
  const routers = [];

  context.keys().forEach((key) => {
    let path = key.substring(1).replace(/\.[^/.]*$/, '');
    const isLayout = /__layout$/i.test(path);
    const module = context(key);

    const router = {
      path,
      component: module.default || module,
    };

    if (isLayout) {
      path = path.replace(/\/__layout.*$/, '') || '/';
      router.path = path;
    }
    map[path] = router;
  });

  Object.keys(map).forEach((key) => {
    recurveRouter(routers, map[key]);
  });

  return routers;
}
