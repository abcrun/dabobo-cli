### cousin-cli

A Front-End Engineering Scaffold For Linting and Building.

### Installation

`npm install -g cousin-cli` or `yarn global add cousin-cli`

### Usage

#### Linting with options

Run `cousin --init` and then answer some questions to inital a  project as you want.

![tip](http://blog.woritd.com/cousin-cli/init.gif)

#### Buiding with commands

* `cousin dev` or run `npm start` - build and run development enviroment.
* `cousin build` or run `npm build` - build the final files for production

##### command with env

And you can also add env with the building commands(such as `cousin dev -e local`), the file `.env` is used to config the environment object, such as:

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

Run `cousin dev -e local`, and you will get the value "http://localhost" with the expression `process.env.domain` in you JS file.

##### config the building options

You can config the options in the file `.cousinrc.js`, similar with webpack.config.


### License

MIT
