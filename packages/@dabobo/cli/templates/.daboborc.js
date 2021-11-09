const { resolve } = require('path');

module.exports = (mode) => {
  /*
   * @return options(config like webpack)
   *
   * {
   *   entry,
   *   output,
   *   library,
   *   libraryTarget,
   *   libraryExport,
   *   cssModules - for css-loader,
   *   optimization,
   *   alias,
   *   noParse - for webpack module,
   *   externals,
   *   plugins - addition plugin for webpack
   * }
   */

  return {
    entry: '<%= entry %>',
    output: {
      publicPath: '/',
    },
    cssModules: true,
    devServer: {
      port: 8000,
    },
    alias: {
      '@': resolve(__dirname, './src'),
    },
  };
};
