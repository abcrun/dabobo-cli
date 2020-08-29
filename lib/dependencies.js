const execSync = require('child_process').execSync;

const getPkg = (name) => {
  let result = execSync('npm view ' + name + ' peerDependencies')
    .toString()
    .trim();
  result = result.replace(/'/g, '"').replace(/([^{\s'"]+)\s*:/g, ($0, $1) => {
    return '"' + $1 + '":';
  });
  result = JSON.parse(result);

  const deps = Object.keys(result).map((k) => {
    return k + '@' + result[k];
  });
  deps.unshift(name);

  return deps;
};

module.exports = (answers) => {
  const { language, lint, frame, css } = answers;

  let lints = [
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];
  const babels = [
    '@babel/cli',
    '@babel/core',
    '@babel/runtime',
    'core-js',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-decorators',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-import',
  ];
  const types = ['@types/node', '@types/webpack-env'];
  const webpack = [
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
    'hard-source-webpack-plugin',
    'babel-loader',
    'cache-loader',
    'thread-loader',
    'css-loader',
    'url-loader',
    'file-loader',
    'style-resources-loader',
    'postcss-loader',
    'postcss-import',
    'postcss-preset-env',
    'clean-webpack-plugin',
    'html-webpack-plugin',
    'script-ext-html-webpack-plugin',
    'mini-css-extract-plugin',
    'uglifyjs-webpack-plugin',
    'optimize-css-assets-webpack-plugin',
    'webpack-bundle-analyzer',
    'mocker-api',
  ];
  const build = ['husky', 'lint-staged'];
  const comp = [];

  if (language === 0) {
    if (lint === 1) {
      const needs = getPkg('eslint-config-standard');
      lints = lints.concat(needs);
    } else if (lint === 2) {
      const needs = getPkg('eslint-config-airbnb');
      lints = lints.concat(needs);
    } else {
      lints.push('eslint');
    }
  } else {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      '@babel/preset-typescript'
    );

    if (lint === 1) {
      const needs = getPkg('eslint-config-standard-with-typescript');
      lints = lints.concat(needs);
    } else if (lint === 2) {
      // can't use peerDependencies, add dependencies manually
      lints.push(
        'eslint-config-airbnb-typescript',
        'eslint-plugin-import@^2.22.0',
        'eslint-plugin-jsx-a11y@^6.3.1',
        'eslint-plugin-react@^7.20.3',
        'eslint-plugin-react-hooks@^4.0.8'
      );
    } else {
      lints.push('eslint');
    }
  }

  if (css === 1) {
    webpack.push('less-loader', 'less');
  } else if (css === 2) {
    webpack.push('sass-loader', 'sass');
  }

  if (frame === 1) {
    babels.push('@babel/preset-react');
    webpack.push('react-hot-loader');
    types.push('@types/react', '@types/react-dom');
    comp.push('react', 'react-dom');
  }

  return [...lints, ...babels, ...types, ...webpack, ...build, ...comp];
};
