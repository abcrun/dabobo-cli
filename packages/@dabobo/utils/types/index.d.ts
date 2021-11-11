declare module 'core' {
  export function createRouterMap(context: typeof require.context) : Array<router>;

  type router = {
    path: string;
    component: any; 
    children: Array<router>
  }
}
