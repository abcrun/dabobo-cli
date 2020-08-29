const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

const deps = require('../dependencies');
const pkg = require('../../templates/package.json');

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

module.exports = (appName, root, answers) => {
  const { language, frame } = answers;
  const { dependencies, devDependencies } = deps(answers);

  let entry = 'index.js';
  if (language === 1) {
    entry = frame ? 'index.tsx' : 'index.ts';
  } else {
    entry = frame ? 'index.jsx' : 'index.js';
  }
  pkg.name = appName;
  pkg.main = './src/' + entry;
  pkg.dependencies = setDeps(dependencies);
  pkg.devDependencies = setDeps(devDependencies);

  fs.outputFile(
    resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2) + os.EOL
  ).then(() => {
    console.log(`  created package.json`);
  });
};
