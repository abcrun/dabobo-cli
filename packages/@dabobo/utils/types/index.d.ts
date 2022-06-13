declare module 'utils' {
  export function createRouterMap(context: typeof require.context, exclude?: RegExp) : routerMap;

  type routerMap = {
    routes: Array<router>;
    map: {
      path: string;
      uri: string;
      component: object;
    }
  }

  type router = {
    path: string;
    uri: string;
    component: any; 
    children: Array<router>
  }
}
