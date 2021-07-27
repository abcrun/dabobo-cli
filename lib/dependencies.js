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
    return k + ':' + result[k];
  });
  deps.unshift(name);

  return deps;
};

module.exports = (answers) => {
  const {
    language,
    jsLinter,
    vue,
    react,
    cssPreProcessor,
    useStyleLint,
  } = answers;

  let lints = [
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];
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
  const types = ['@types/node', '@types/webpack-env'];
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
  const build = ['husky', 'lint-staged'];
  const comp = [];
  if (language === 0) {
    if (jsLinter === 1) {
      const needs = getPkg('eslint-config-standard');
      lints = lints.concat(needs);
    } else if (jsLinter === 2) {
      const needs = getPkg('eslint-config-airbnb');
      lints = lints.concat(needs);
    } else {
      lints.push('eslint');
    }
  } else {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );
    babels.push('@babel/preset-typescript');

    if (jsLinter === 1) {
      const needs = getPkg('eslint-config-standard-with-typescript');
      lints = lints.concat(needs);
    } else if (jsLinter === 2) {
      // can't use peerDependencies, add dependencies manually
      lints.push(
        'eslint-config-airbnb-typescript:^12.3.1',
        'eslint-plugin-import:^2.22.0',
        'eslint-plugin-jsx-a11y:^6.3.1',
        'eslint-plugin-react:^7.20.3',
        'eslint-plugin-react-hooks:^4.0.8'
      );
    } else {
      lints.push('eslint');
    }
  }

  // if (cssPreProcessor === 1) {
  //   webpack.push('less-loader', 'less');
  // } else if (cssPreProcessor === 2) {
  //   webpack.push('sass-loader', 'sass');
  // }

  if (react) {
    lints.push(
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y'
    );
    babels.push('@babel/preset-react');
    types.push('@types/react', '@types/react-dom');
    comp.push('react-hot-loader');

    if (react === 0) {
      comp.push('react:^16.0.0', 'react-dom:^16.0.0');
    } else if (react === 1) {
      comp.push('react:^17.0.0', 'react-dom:^17.0.0');
    } else if (react === 1) {
      comp.push('react:^18.0.0', 'react-dom:^18.0.0');
    }
  }

  if (vue) {
    lints.push('eslint-plugin-vue');
    babels.push('@babel/preset-vue');

    if (vue === 0) {
      comp.push('vue:^2.0.0');
    } else if (vue === 1) {
      comp.push('vue:^3.0.0');
    }
  }

  if (useStyleLint) {
    lints.push('stylelint-config-standard', 'stylelint-config-recess-order');

    if (cssPreProcessor === 1) {
      lints.push('stylelint-scss');
    }
  }

  return {
    dependencies: comp,
    devDependencies: [
      ...lints,
      ...babels,
      ...types,
      // ...webpack,
      ...build,
    ],
  };
};
