const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const cousin = require(path.resolve('./.cousinrc.js'))('development');
const apiMocker = require('mocker-api');
const proxy = require(path.resolve('./proxy/index.js'));

const { devServer = {} } = cousin;

module.exports = (entry, options) => {
  const { env = 'development', port, open = false } = options;
  port && (devServer.port = port);
  open && (devServer.open = true);

  const config = require('./config')('development', env, entry);
  const complier = webpack(config);
  const server = new WebpackDevServer(complier, {
    contentBase: path.resolve('./public'),
    // inline: true,
    historyApiFallback: true,
    hot: true,
    port: 8000,
    overlay: true,
    compress: true, // gzip
    watchOptions: {
      ignored: /node_modules/,
    },
    before: (app) => {
      apiMocker(app, path.resolve('./mock/index.js'));
    },
    proxy,
    ...devServer,
  });

  server.listen(devServer.port, 'localhost', (err) => {
    if (err) console.log(chalk.bold.red(err));
    else {
      console.log(
        chalk.bold.green(
          'server is running at http://localhost:' + devServer.port + '\n'
        )
      );
    }
  });
};
