const fs = require('fs-extra');
const path = require('path');

module.exports = (root) => {
  return fs
    .copy(
      path.resolve(__dirname, '../../templates/postcss.config.js'),
      path.resolve(root, 'postcss.config.js')
    )
    .then((res) => {
      console.log(`  created postcss.config.js`);
    });
};
