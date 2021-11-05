const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const dabobo = require(path.resolve('./.daboborc.js'))('development');
const apiMocker = require('mocker-api');
const proxy = require(path.resolve('./proxy/index.js'));

const { devServer = {} } = dabobo;

module.exports = (entry, options) => {
  const { env = 'development', port, open = false } = options;
  port && (devServer.port = port);
  open && (devServer.open = true);

  const config = require('./config')('development', env, entry);
  const complier = webpack(config);
  const server = new WebpackDevServer(
    {
      historyApiFallback: true,
      open: true,
      hot: true,
      port: port || 8000,
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
