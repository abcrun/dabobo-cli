declare module 'utils' {
  export function createRouterMap(context: typeof require.context, exclude?: RegExp) : Array<router>;

  type router = {
    path: string;
    uri: string;
    component: any; 
    children: Array<router>
  }
}
