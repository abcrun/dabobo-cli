const path = require('path');
const chalk = require('chalk');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const cousin = require(path.resolve('./cousin.config.json'));
const port = cousin.port || 8000;
const proxy = require(path.resolve('./proxy.json'));

module.exports = (env) => {
  const config = require('../webpack.js')('development', env);
  const complier = webpack(config);
  const server = new WebpackDevServer(complier, {
    contentBase: path.resolve('./public'),
    inline: true,
    historyApiFallback: true,
    hot: true,
    open: true,
    compress: true, // gzip
    overlay: {
      errors: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy,
  });
  server.listen(port, 'localhost', (err) => {
    if (err) console.log(chalk.bold.red(err));
    else {
      console.log(
        chalk.bold.green('server is running at http://localhost:' + port + '\n')
      );
    }
  });
};
