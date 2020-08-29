const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

const pkg = require('../../templates/package.json');

module.exports = (appName, root, answers) => {
  const { language, frame } = answers;

  let entry = 'index.js';
  if (language === 1) {
    entry = frame ? 'index.tsx' : 'index.ts';
  } else {
    entry = frame ? 'index.jsx' : 'index.js';
  }
  pkg.name = appName;
  pkg.main = './src/' + entry;

  fs.outputFile(
    resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2) + os.EOL
  ).then(() => {
    console.log(`  created package.json`);
  });
};
