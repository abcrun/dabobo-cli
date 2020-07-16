const path = require('path');
const chalk = require('chalk');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const cousin = require(path.resolve('./cousin.config.json'));
const port = cousin.port || 8000;

module.exports = (env) => {
  const config = require('../webpack.js')('development');
  const complier = webpack(config);
  const server = new WebpackDevServer(complier, {
    open: true,
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
