const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { LIBRARY } = require('../constant');

const cousin = require(path.resolve('./.cousinrc.js'));
const envs = fs.readJsonSync(path.resolve('./.env'));
const presetrc = fs.readJsonSync(path.resolve('./.presetrc'));

module.exports = (mode, env, commandEntry) => {
  const { cssPreProcessor, library: lib } = presetrc;
  const {
    entry: cousinEntry,
    publicPath = '',
    js: jsOptions = {},
    css: cssOptions = {},
    assets: assetsOptions = {},
    library = 'libraryName',
    libraryTarget = 'umd',
    libraryExport = 'default',
    externals = {},
    noParse = '',
    alias = {},
    optimization = {},
    plugins: extraPlugins = [],
  } = cousin(mode);

  const defaultName = '[name].[hash:8]';
  const { filename = defaultName, chunkFilename = defaultName } = jsOptions;

  const css = require('./css')(cssPreProcessor, cssOptions, mode);
  const file = require('./file')(lib, jsOptions, mode);
  const assets = require('./assets')(assetsOptions, mode);
  const entry = commandEntry || cousinEntry;

  // 处理entry
  const formatEntry = (entry instanceof Array ? entry : [entry]).map((url) => {
    return path.resolve(url);
  });
  if (lib === LIBRARY.REACT) formatEntry.unshift('react-hot-loader/patch');

  // 处理plugins
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      filename: 'index.html',
    }),
    ...css.plugins,
    ...file.plugins,
    ...extraPlugins,
  ];

  const envDatas = env && envs[env];
  if (envDatas) {
    plugins.push(new webpack.DefinePlugin({ ENV: JSON.stringify(envDatas) }));
  }

  const config = {
    entry: formatEntry,
    output: {
      path: path.resolve('./dist'),
      filename: filename + '.js',
      chunkFilename: chunkFilename + '.js',
      library,
      libraryTarget,
      libraryExport,
    },
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      alias: alias,
    },
    optimization,
    module: {
      rules: [...css.rules, ...file.rules, ...assets.rules],
    },
    plugins,
    target: 'web',
    externals: externals,
  };

  // 其他相关基础配置
  if (mode === 'development') {
    config.devtool = 'cheap-module-source-map';
    config.mode = 'development';
    config.output.pathinfo = true;
    // 控制台信息
    config.stats = {
      assets: true,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: true,
    };
  } else {
    config.mode = 'production';
    config.output.publicPath = publicPath;
    config.plugins.unshift(new CleanWebpackPlugin());
    config.optimization.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ];
  }

  if (!/^\s*$/.test(noParse) || noParse.length > 0)
    config.module.noParse = noParse;

  return config;
};
