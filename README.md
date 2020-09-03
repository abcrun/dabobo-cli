### cousin-cli

A Front-End Engineering Scaffold For Lint and Building.

### Installation

`npm install -g cousin-cli` or `yarn global add cousin-cli`

### Usage

#### Initial 

Run `cousin <project-directory> [options]` and then answer some questions to inital a  project as you want.
You can run `cousin --help` to see more.

![tip](http://blog.woritd.com/cousin-cli/init.gif)

#### Building with commands

* `cousin dev` or run `npm start` - build and run development environment.
* `cousin build` or run `npm build` - build the final files for production
* `cousin report` or run `npm run report` - launch server for building report 

##### build with env

You can also add env with the building commands(such as `cousin dev -e local`), the file `.env` is used to config the environment object, such as:

```javascript
{
  "local": {
    "domain": "http://localhost"
  },
  "prod": {
    "domain": ""
  }
}
```

Run `cousin dev -e local`, and you will get the value `"http://localhost"` with the javascript expression `process.env.domain` in you JS file.

##### config files

* `.env` is for environment variables
* `.cousinrc.js` is for webpack to run and build the project, similar with webpack.config
* `proxy.js` is for the proxy config when developping
* `mock/index.js` is the mock file to config when developping
* `babel.config.json` is for babel
* `.eslintrc.json/.eslintignore` is for eslint
* `.prettierrc/.prettierignore` is for prettier
* `commlitlint.config.js` is for commmitlint
* `.browserslistrc` is for buiding environment 



### License

MIT
