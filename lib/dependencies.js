const execSync = require('child_process').execSync;

const getPkg = (name, registry) => {
  let result = execSync(
    'npm view ' +
      name +
      ' peerDependencies' +
      (registry ? ' --registry=' + registry : '')
  )
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

const getLints = (answer, registry) => {
  const { language, jsLinter, library, useStyleLint, cssPreProcessor } = answer;
  const lints = [
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];

  if (language === 0) {
    if (jsLinter === 1) {
      const needs = getPkg('eslint-config-standard', registry);
      lints.push(...needs);
    } else if (jsLinter === 2) {
      const needs = getPkg('eslint-config-airbnb', registry);
      lints.push(...needs);
    } else {
      lints.push('eslint');
    }
  } else if (language === 1) {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );

    if (jsLinter === 1) {
      const needs = getPkg('eslint-config-standard-with-typescript', registry);
      lints.push(...needs);
    } else if (jsLinter === 2) {
      // can't use peerDependencies, add dependencies manually
      lints.push(
        'eslint-config-airbnb-typescript@^12.3.1',
        'eslint-plugin-import@^2.22.0',
        'eslint-plugin-jsx-a11y@^6.3.1',
        'eslint-plugin-react@^7.20.3',
        'eslint-plugin-react-hooks@^4.0.8'
      );
    } else {
      lints.push('eslint');
    }
  }

  if (library === 0) {
    lints.push('eslint-plugin-vue');
  } else if (library === 1 && jsLinter !== 2) {
    lints.push(
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y'
    );
  }

  if (useStyleLint) {
    lints.push(
      ...getPkg('stylelint-config-standard', registry),
      'stylelint-config-recess-order'
    );

    if (cssPreProcessor === 1) {
      lints.push('stylelint-scss');
    }
  }

  return lints;
};

const getBabels = (answer) => {
  const { language, library } = answer;
  const babels = [
    '@babel/cli',
    '@babel/runtime-corejs3',
    'core-js',
    '@babel/core',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-decorators',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-import',
  ];

  if (library === 0) {
    babels.push('babel-preset-vue');
  } else if (library === 1) {
    babels.push('@babel/preset-react');
  }

  if (language === 1) {
    babels.push('@babel/preset-typescript');
  }

  return babels;
};

const getLibs = (answer) => {
  const { vue, react } = answer;
  const libs = [];

  if (vue === 0) {
    libs.push('vue@^2.0.0');
  } else if (vue === 1) {
    libs.push('vue@^3.0.0');
  }

  typeof react !== 'undefined' && libs.push('react-hot-loader');
  if (react === 0) {
    libs.push('react@^16.0.0', 'react-dom@^16.0.0');
  } else if (react === 1) {
    libs.push('react@^17.0.0', 'react-dom@^17.0.0');
  } else if (react === 1) {
    libs.push('react@^18.0.0', 'react-dom@^18.0.0');
  }

  return libs;
};

module.exports = (answer, registry) => {
  const { react } = answer;

  const types = ['@types/node', '@types/webpack-env'];
  const build = ['husky', 'lint-staged'];
  // const webpack = [
  //   'cousin-cli',
  //   'webpack',
  //   'webpack-cli',
  //   // 'webpack-dev-server',
  //   // 'hard-source-webpack-plugin',
  //   'eslint-loader',
  //   'babel-loader',
  //   'cache-loader',
  //   'thread-loader',
  //   'css-loader',
  //   'url-loader',
  //   'file-loader',
  //   'style-resources-loader',
  //   'postcss-loader',
  //   // 'postcss-import',
  //   // 'postcss-preset-env',
  //   // 'clean-webpack-plugin',
  //   'html-webpack-plugin',
  //   'script-ext-html-webpack-plugin',
  //   // 'mini-css-extract-plugin',
  //   // 'uglifyjs-webpack-plugin',
  //   // 'optimize-css-assets-webpack-plugin',
  //   // 'webpack-bundle-analyzer',
  //   // 'mocker-api',
  // ];

  // if (cssPreProcessor === 1) {
  //   webpack.push('less-loader', 'less');
  // } else if (cssPreProcessor === 2) {
  //   webpack.push('sass-loader', 'sass');
  // }
  //

  typeof react !== 'undefined' &&
    types.push('@types/react', '@types/react-dom');

  return {
    dependencies: getLibs(answer),
    devDependencies: [
      ...getLints(answer, registry),
      ...getBabels(answer),
      ...types,
      // ...webpack,
      ...build,
    ],
  };
};
