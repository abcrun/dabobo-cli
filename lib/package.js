const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const deps = require('./dependencies');
const pkg = require('../templates/package.json');

const setDeps = (pkgs) => {
  const deps = {};
  pkgs.forEach((d) => {
    const arr = d.split(':');
    const key = arr[0];
    const value = arr[1] || 'latest';

    deps[key] = value;
  });

  return deps;
};

module.exports = (root, answer) => {
  const appName = path.basename(root);
  const { language } = answer;
  const { dependencies, devDependencies } = deps(answer);

  const entry = language === 1 ? 'main.ts' : 'main.js';
  pkg.name = appName;
  pkg.main = './src/' + entry;
  pkg.dependencies = setDeps(dependencies);
  pkg.devDependencies = setDeps(devDependencies);

  fs.outputFile(
    path.resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2) + os.EOL
  ).then(() => {
    console.log(`  created package.json`);
  });
};
