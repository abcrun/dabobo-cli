const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { LANGUAGE } = require('../util/constant');

module.exports = (root, preset) => {
  const { language } = preset;
  const entry = language === LANGUAGE.TYPESCRIPT ? 'index.ts' : 'index.js';
  const vue = {
    pages: {
      index: {
        entry: 'src/' + entry,
        template: 'public/index.html',
      },
    },
  };

  return fs
    .outputFile(
      resolve(root, 'vue.config.js'),
      `module.exports = ${JSON.stringify(vue, null, 2)}` + os.EOL
    )
    .then(() => {
      console.log(`  created vue.config.js`);
    });
};
