const { resolve } = require('path');

module.exports = (mode) => {
  const isDev = mode === 'development';

  return {
    entry: '<%= entry %>',
    publicPath: '/',
    library: 'Library',
    libraryTarget: 'umd',
    libraryExport: 'default',
    devServer: {
      port: 8000,
      open: true,
    },
    js: {
      filename: isDev ? '[name]' : '[name].[hash:8]',
      chunkFilename: isDev ? '[name].chunk' : '[nam].[hash:8]',
    },
    css: {
      modules: false,
      filename: isDev ? '[name]' : '[name].[hash:8]',
      chunkFilename: isDev ? '[name].chunk' : '[name].[hash:8]',
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
    plugins: [],
  };
};
