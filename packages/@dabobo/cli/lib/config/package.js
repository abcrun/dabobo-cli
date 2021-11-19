const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const pkg = require('../../templates/package.json');
const { LANGUAGE, BUILDINGTOOL } = require('../util/constant');

module.exports = (root, answer, registry) => {
  const appName = path.basename(root);
  const { language, buildingTool } = answer;

  const entry = language === LANGUAGE.TYPESCRIPT ? 'index.ts' : 'index.js';
  pkg.name = appName;
  pkg.main = './src/' + entry;

  if (buildingTool === BUILDINGTOOL.DABOBO) {
    pkg.scripts.dev = 'dabobo-cli-service dev';
    pkg.scripts.build = 'dabobo-cli-service build';
  }

  const { dependencies, devDependencies } = require('../dependencies')(
    answer,
    registry
  );

  const dep = {};
  const devDep = {};

  dependencies.forEach((d) => {
    const [key, value] = d.split(':');
    dep[key] = value;
  });

  devDependencies.forEach((d) => {
    const [key, value] = d.split(':');
    devDep[key] = value;
  });

  pkg.dependencies = dep;
  pkg.devDependencies = devDep;

  fs.outputFile(
    path.resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2) + os.EOL
  ).then(() => {
    console.log(`  created package.json`);
  });
};
