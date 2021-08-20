const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader-plugin');

module.exports = (library, options, mode) => {
  const fInclude = [path.resolve('.')];
  const fExclude = [path.resolve('./node_modules')];
  const { include = fInclude, exclude = fExclude } = options;

  const rules = [
    {
      test: /\.m?[tj]sx?$/,
      use: ['thread-loader', 'babel-loader'],
      include,
      exclude,
    },
  ];
  const plugins = [];

  if (mode === 'development') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (library === 0) {
    // vue
    rules.push({ test: /\.vue/i, use: ['vue-loader'] });
    plugins.push(new VueLoaderPlugin());
  }

  return {
    rules,
    plugins,
  };
};
