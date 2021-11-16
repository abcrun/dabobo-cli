const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');

const { LIBRARY } = require('../constant');

const dabobo = require(path.resolve('./.daboborc.js'));
const envs = fs.readJsonSync(path.resolve('./.env')) || {};
const presetrc = fs.readJsonSync(path.resolve('./.presetrc'));

module.exports = (mode, env, commandEntry) => {
  const { cssPreProcessor, library } = presetrc;

  const {
    entry: boboEntry,
    output: boboOutput = {},
    cssModules = true,
    optimization: boboOptimization,
    externals,
    noParse,
    resolve: fnResolve,
    rules: fnRules,
    plugins: fnPlugins,
    devServer = {},
  } = dabobo(mode);

  // for entry
  const entry = commandEntry || boboEntry;
  const formatEntry = (entry instanceof Array ? entry : [entry]).map((url) => {
    return path.resolve(url);
  });
  if (library === LIBRARY.REACT) formatEntry.unshift('react-hot-loader/patch');

  // for output
  const output = {
    path: path.resolve('./dist'),
    publicPath: '/',
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/chunk/[name].[contenthash:8].js',
    ...boboOutput,
  };

  // for resolve
  const resolveConfig = {};
  const resolve =
    typeof fnResolve === 'function'
      ? fnResolve(resolveConfig, mode, env)
      : resolveConfig;

  const css = require('./css')(cssPreProcessor, cssModules, mode);
  const file = require('./js')(presetrc, mode);
  const assets = require('./assets')();

  // for module
  const rulesConfig = [...css.rules, ...file.rules, ...assets.rules];
  const module = {
    rules:
      typeof fnRules === 'function'
        ? fnRules(rulesConfig, mode, env)
        : rulesConfig,
  };
  if (noParse) module.noParse = noParse;

  // for plugins
  const pluginsConfig = [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `You application is running at: http://localhost:${
            devServer.port || 8080
          }`,
        ],
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        ENV: JSON.stringify(envs[env]),
      },
    }),
    ...css.plugins,
    ...file.plugins,
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      filename: 'index.html',
    }),
  ];
  const plugins =
    typeof fnPlugins === 'function'
      ? fnPlugins(pluginsConfig, mode, env)
      : pluginsConfig;

  // for optimization
  const optimization = boboOptimization || {
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

  // config file
  const config = {
    mode,
    target: 'web',
    entry: formatEntry,
    output,
    resolve,
    optimization,
    module,
    plugins,
    externals,
    stats: 'errors-only',
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
