const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = () => {
  const config = require('../webpack.js')('production');
  config.plugins.push(new BundleAnalyzerPlugin());

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
