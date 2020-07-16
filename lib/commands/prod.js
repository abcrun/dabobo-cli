const webpack = require('webpack');

module.exports = () => {
  const config = require('../webpack.js')('production');

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
