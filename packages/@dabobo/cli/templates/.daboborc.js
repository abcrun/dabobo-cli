const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    devServer: {
      port: 8080,
    },
    resolve: (defaultResolve, mode, env) => {
      return {
        ...defaultResolve,
        alias: {
          '@': resolve(__dirname, './src'),
        },
      };
    },
    plugins: (defaultPlugins, mode, env) => {
      const plugins = [
        ...defaultPlugins,
        new HtmlWebpackPlugin({
          template: resolve('./public/index.html'),
          filename: 'index.html',
        }),
      ];

      if (mode === 'production') {
        plugins.push(
          new CopyPlugin({
            patterns: [
              {
                from: resolve(__dirname, './public'),
                to: resolve(__dirname, './dist'),
                globOptions: {
                  ignore: ['.*', resolve(__dirname, './public/index.html')],
                },
              },
            ],
          })
        );
      }

      return plugins;
    },
  };
};
