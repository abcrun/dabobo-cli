const fs = require('fs');
const { resolve } = require('path');

const deps = require('./deps.json');
const pkg = require('../template/package.json');

module.exports = (params) => {
  const { name, language, lint, frame, commitlint } = params;

  const devDependencies = [
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'husky',
    'lint-staged',
  ];
  const dependencies = [];

  if (language === 0) {
    if (lint === 1) {
      devDependencies.push(
        'eslint-config-standard',
        'eslint-plugin-standard',
        'eslint-plugin-promise',
        'eslint-plugin-import',
        'eslint-plugin-node'
      );
    } else if (lint === 2) {
      devDependencies.push(
        'eslint-config-airbnb',
        'eslint-plugin-react',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react-hooks'
      );
      dependencies.push('react', 'react-dom');
    }
  } else if (language === 1) {
    devDependencies.push(
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );

    if (lint === 1) {
      devDependencies.push(
        'eslint-config-standard-with-typescript',
        'eslint-plugin-standard',
        'eslint-plugin-promise',
        'eslint-plugin-import',
        'eslint-plugin-node'
      );
    } else if (lint === 2) {
      devDependencies.push(
        'eslint-config-airbnb-typescript',
        'eslint-plugin-react',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react-hooks'
      );
      dependencies.push('react', 'react-dom');
    }
  }

  if (frame === 1 && lint !== 2) {
    devDependencies.push(
      'eslint-plugin-react',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react-hooks'
    );
    dependencies.push('react', 'react-dom');
  }

  if (commitlint) {
    devDependencies.push('@commitlint/cli', '@commitlint/config-conventional');
  } else {
    delete pkg.husky.hooks['commit-msg'];
  }

  devDependencies.forEach((name) => {
    pkg.devDependencies[name] = deps[name];
  });

  dependencies.forEach((name) => {
    pkg.dependencies[name] = deps[name];
  });

  pkg.name = name;

  fs.writeFile(
    resolve('./', 'package.json'),
    JSON.stringify(pkg, '', '\t'),
    (err) => {
      if (err) console.error(JSON.stringify(err));
      else console.info('    create package.json');
    }
  );
};
