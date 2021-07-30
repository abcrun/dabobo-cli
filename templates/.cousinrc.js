const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = (mode) => {
  const isDev = mode === 'development';

  return {
    entry: '<%= entry %>',
    publicPath: '',
    library: 'Library',
    libraryTarget: 'umd',
    libraryExport: 'default',
    devServer: {
      port: 8000,
      open: true,
    },
    js: {
      filename: isDev ? '[name].js' : '[name].[hash:8].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name].[hash:8].js',
    },
    css: {
      modules: true,
      filename: isDev ? '[name].css' : '[name].[hash:8].css',
      chunkFilename: isDev ? '[name].chunk.css' : '[name].[hash:8].css',
    },
    assets: {
      name: '[name].[hash:8].[ext]', // files matches /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i
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
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve('./public/index.html'),
        filename: 'index.html',
      }),
    ],
  };
};
