const { resolve } = require('path');

module.exports = (mode, env) => {
  /*
   * @arguments
   *   mode: [development|production]
   *   env - the deploy enviroment(which will load the related variable in `.env` file)
   * @return
   *  options(config like webpack)
   *  {
   *    entry,
   *    output,
   *    cssModules - for css-loader,
   *    optimization,
   *    noParse,
   *    resolve: (defaultResolve, mode, env) => webpack.resolve,
   *    rules: (defaultRules, mode, env) => webpack.module.rules,
   *    plugins: (defaultPlugins, mode, env) => webpack.plugins,
   *    externals
   *  }
   */

  return {
    entry: '<%= entry %>',
    output: {
      publicPath: '/',
    },
    cssModules: false,
    devServer: {
      port: 8000,
    },
    resolve: (defaultResolve, mode, env) => {
      return {
        ...defaultResolve,
        alias: {
          '@': resolve('./src'),
        },
      };
    },
  };
};
