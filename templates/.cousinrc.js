const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { resolve } = require('path');
// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  port: 8000,
  entry: '<%= entry %>',
  output: {
    path: resolve('./dist'),
    publicPath: '',
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
    assets: '[name].[hash:8].[ext]', // files mathch /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i
    library: 'Library',
    libraryTarget: 'umd',
    libraryExport: '',
  },
  noParse: [],
  externals: {},
  alias: {},
  styleResources: {}, // style-resource-loader pattern
  miniCssExtract: {
    // min-css-extract-plugin for css config
    publicPath: './',
    filename: '[name].[hash:8].css',
    chunkFileName: '[name].[hash:8].css',
  },
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
