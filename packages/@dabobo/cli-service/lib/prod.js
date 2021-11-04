const webpack = require('webpack');

module.exports = (entry, env) => {
  const config = require('./config')('production', env, entry);

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
