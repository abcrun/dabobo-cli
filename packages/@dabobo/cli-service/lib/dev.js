const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const apiMocker = require('mocker-api');
const proxy = require(path.resolve('./proxy/index.js'));

module.exports = (entry, options) => {
  const { env = 'local' } = options;
  const dabobo = require(path.resolve('./.daboborc.js'))('development', env);
  const { devServer = {} } = dabobo;

  const config = require('./config')('development', env, entry);
  const complier = webpack(config);
  const server = new WebpackDevServer(
    {
      historyApiFallback: true,
      port: 8080,
      compress: true, // gzip
      proxy,
      onBeforeSetupMiddleware: (devServer) => {
        apiMocker(devServer.app, path.resolve('./mock/index.js'));
      },
      static: {
        publicPath: '/',
      },
      ...devServer,
    },
    complier
  );

  server.start();
};
