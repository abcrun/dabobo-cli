const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { resolve } = require('path');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (mode) => {
  const isDev = mode === 'development';

  return {
    port: 8000,
    entry: '<%= entry %>',
    publicPath: '',
    output: {
      js: {
        filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
        chunkFilename: isDev ? '[name].chunk.js' : '[name].[contenthash:8].js',
      },
      css: {
        filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: isDev
          ? '[name].chunk.css'
          : '[name].[contenthash:8].css',
      },
      assets: '[name].[contenthash:8].[ext]', // files matches /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i
      library: 'Library',
      libraryTarget: 'umd',
      libraryExport: '',
    },
    optimization: {
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
    },
    alias: {},
    noParse: [],
    externals: {},
    styleResources: {}, // style-resource-loader pattern
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('./public/index.html'),
        filename: 'index.html',
      }),
      new ScriptExtHtmlWebpackPlugin({
        inline: /runtime.*\.js/,
      }),
      // new WorkboxPlugin.GenerateSW({
      //   clientsClaim: true,
      //   skipWaiting: true,
      // }),
    ],
  };
};
