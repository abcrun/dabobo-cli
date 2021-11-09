const path = require('path');
const webpack = require('webpack');
const { LIBRARY } = require('../constant');

module.exports = (preset, options, mode) => {
  const fInclude = [path.resolve('.')];
  const fExclude = [
    path.resolve('./node_modules'),
    path.resolve('./bower_components'),
  ];
  const { library, version } = preset;
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

  if (library === LIBRARY.VUE) {
    // vue
    rules.push({ test: /\.vue/i, use: ['vue-loader'] });

    const VueLoaderPlugin =
      version === 2
        ? require('vue-loader/lib/plugin')
        : require('vue-loader').VueLoaderPlugin;

    plugins.push(new VueLoaderPlugin());
  }

  return {
    rules,
    plugins,
  };
};
