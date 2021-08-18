const execSync = require('child_process').execSync;

const getPkg = (name, registry, exclude) => {
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

  if (exclude) {
    delete result[exclude];
  }

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

const getLibrary = (answer) => {
  const { library, vue, react } = answer;
  const libs = [];

  if (library === 0) {
    if (vue === 0) {
      libs.push('vue@^2.0.0');
    } else if (vue === 1) {
      libs.push('vue@^3.0.0');
    }
  } else if (library === 1) {
    libs.push('react-hot-loader');

    if (react === 0) {
      libs.push('react@^16.0.0', 'react-dom@^16.0.0');
    } else if (react === 1) {
      libs.push('react@^17.0.0', 'react-dom@^17.0.0');
    } else if (react === 1) {
      libs.push('react@^18.0.0', 'react-dom@^18.0.0');
    }
  }

  return libs;
};

module.exports = (answer, registry) => {
  const { react, language } = answer;

  const preCommit = ['husky', 'lint-staged'];
  const types =
    language === 1
      ? [
          '@types/node',
          '@types/webpack-env', // typescript for webpack such as module.hot()
        ]
      : [];

  typeof react !== 'undefined' &&
    types.push('@types/react', '@types/react-dom');

  return {
    dependencies: getLibrary(answer),
    devDependencies: [
      // '@cousin/service',
      ...getLints(answer, registry),
      ...types,
      ...preCommit,
    ],
  };
};
