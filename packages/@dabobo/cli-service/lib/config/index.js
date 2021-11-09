const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { LIBRARY } = require('../constant');

const dabobo = require(path.resolve('./.daboborc.js'));
const envs = fs.readJsonSync(path.resolve('./.env')) || {};
const presetrc = fs.readJsonSync(path.resolve('./.presetrc'));

module.exports = (mode, env, commandEntry) => {
  const { cssPreProcessor, library } = presetrc;

  let {
    entry: boboEntry,
    output = {},
    cssModules = true,
    optimization,
    plugins = [],
    externals,
    noParse,
    alias,
  } = dabobo(mode);

  // for entry
  const entry = commandEntry || boboEntry;
  const formatEntry = (entry instanceof Array ? entry : [entry]).map((url) => {
    return path.resolve(url);
  });
  if (library === LIBRARY.REACT) formatEntry.unshift('react-hot-loader/patch');

  // for output
  output = {
    path: path.resolve('./dist'),
    publicPath: '/',
    filename: 'assets/[name].[contenthash:4].js',
    chunkFilename: 'assets/[name].[contenthash:4].chunk.js',
    ...output,
  };

  // for plugins
  const css = require('./css')(cssPreProcessor, cssModules, mode);
  const file = require('./js')(presetrc, mode);
  const assets = require('./assets')();
  const module = {
    rules: [...css.rules, ...file.rules, ...assets.rules],
  };

  plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        ENV: JSON.stringify(envs[env]),
      },
    }),
    ...css.plugins,
    ...file.plugins,
    ...plugins,
  ];

  if (noParse) module.noParse = noParse;

  // config file
  alias = alias || { '@': path.resolve(__dirname, './src') };
  optimization = optimization || {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          priority: 1,
          chunks: 'initial',
          name: 'vendor',
          test: /node_modules/,
          minChunks: 1,
        },
        common: {
          name: 'common',
          minChunks: 2,
        },
      },
    },
  };
  const config = {
    mode,
    target: 'web',
    entry: formatEntry,
    output,
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      alias,
    },
    optimization,
    module: {
      rules: [...css.rules, ...file.rules, ...assets.rules],
    },
    plugins,
    externals,
  };

  // 其他相关基础配置
  if (mode === 'development') {
    config.devtool = 'eval-source-map';
    config.output.pathinfo = true;
  } else {
    config.plugins.unshift(new CleanWebpackPlugin());
    config.optimization.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ];
  }

  return config;
};
