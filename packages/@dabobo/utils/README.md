### Install

`yarn add @dabobo/utils` 或者 `npm i @dabobo/utils`

### Useage

```javascript
/* declare module 'utils' { */
/*   export function createRouterMap(context: typeof require.context, exclude?: RegExp) = /\/components?\// : Array<router>; */

/*   type router = { */
/*     path: string; */
/*     uri: string; */
/*     component: any; */ 
/*     children: Array<router> */
/*   } */
/* } */

import { createRouterMap } from '@dabobo/utils';

const routes = createRouterMap(
  require.context('./src/views', true, /\.vue/, 'lazy'),
  /\/404\.vue/
);
```
