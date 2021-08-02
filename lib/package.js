const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const pkg = require('../templates/package.json');

module.exports = (root, answer) => {
  const appName = path.basename(root);
  const { language } = answer;

  const entry = language === 1 ? 'index.ts' : 'index.js';
  pkg.name = appName;
  pkg.main = './src/' + entry;

  fs.outputFile(
    path.resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2) + os.EOL
  ).then(() => {
    console.log(`  created package.json`);
  });
};
