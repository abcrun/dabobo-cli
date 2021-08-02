const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // 为模块提供中间缓存,首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 80%

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
  if (lib === 1) formatEntry.unshift('react-hot-loader/patch');

  // 处理plugins
  const plugins = [
    // new HardSourceWebpackPlugin(),
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
    const defines = {};
    for (const key in envDatas) {
      defines['process.env.' + key] = JSON.stringify(envDatas[key]);
    }
    plugins.push(new webpack.DefinePlugin(defines));
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
      new OptimizeCSSAssetsPlugin(),
      new UglifyJsPlugin({
        parallel: true,
        cache: false,
        sourceMap: false,
        uglifyOptions: {
          compress: {
            dead_code: true,
            drop_debugger: true,
            drop_console: true,
            loops: true,
          },
          warnings: false,
        },
      }),
    ];
  }

  if (!/^\s*$/.test(noParse) || noParse.length > 0)
    config.module.noParse = noParse;

  return config;
};
