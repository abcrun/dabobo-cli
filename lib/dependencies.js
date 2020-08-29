module.exports = (answers) => {
  const { language, lint, frame, css } = answers;

  const lints = [
    'eslint',
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
  ];
  const build = ['husky', 'lint-staged'];
  const comp = [];

  if (language === 0) {
    if (lint === 1) {
      lints.push('eslint-config-standard');
    } else if (lint === 2) {
      lints.push('eslint-config-airbnb');
    }
  } else {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
      '@babel/preset-typescript'
    );

    if (lint === 1) {
      lints.push('eslint-config-standard-with-typescript');
    } else if (lint === 2) {
      lints.push('eslint-config-airbnb-typescript');
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
