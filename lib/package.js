const fs = require('fs');
const { resolve } = require('path');

const chalk = require('chalk');

const deps = require('./deps.json');
const pkg = require('../templates/package.json');

module.exports = (params) => {
  const { name, language, lint, frame, css, commitlint } = params;

  const devDependencies = [
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'husky',
    'lint-staged',
    '@babel/cli',
    '@babel/core',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    // 'webpack',
    // 'webpack-cli',
    'babel-loader',
    'css-loader',
    // 'style-loader',
    'url-loader',
    'file-loader',
    'postcss-loader',
    // 'postcss-import',
    // 'postcss-preset-env',
    // 'clean-webpack-plugin',
    // 'html-webpack-plugin',
    // 'mini-css-extract-plugin',
    // 'uglifyjs-webpack-plugin',
    // 'optimize-css-assets-webpack-plugin',
  ];
  const dependencies = ['@babel/runtime', 'core-js', '@types/node'];

  if (language === 0) {
    pkg.main = !frame ? './src/index.js' : './src/index.jsx';

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
      dependencies.push('react', 'react-dom', '@types/react');
    }
  } else if (language === 1) {
    pkg.main = !frame ? './src/index.ts' : './src/index.tsx';

    devDependencies.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      '@babel/preset-typescript'
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
      dependencies.push('react', 'react-dom', '@types/react');
    }
  }

  if (css === 1) {
    devDependencies.push('less-loader');
  } else if (css === 2) {
    devDependencies.push('sass-loader');
  }

  if (frame === 1) {
    devDependencies.push('@babel/preset-react');

    if (lint !== 2) {
      devDependencies.push(
        'eslint-plugin-react',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react-hooks'
      );
      dependencies.push('react', 'react-dom', '@types/react');
    }
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
    JSON.stringify(pkg, '', '  '),
    (err) => {
      if (err) console.error(chalk.red(JSON.stringify(err)));
      else console.info(chalk.cyan('    create package.json'));
    }
  );
};
