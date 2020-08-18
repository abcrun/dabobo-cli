const webpack = require('webpack');

module.exports = (env) => {
  const config = require('../webpack.js')('production', env);

  webpack(config, (err, stats) => {
    if (err) console.log(err);
    else {
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      );
    }
  });
};
