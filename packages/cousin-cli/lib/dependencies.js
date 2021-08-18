const execSync = require('child_process').execSync;
const {
  LANGUAGE,
  JSLINTER,
  LIBRARY,
  CSSPREPROCESSOR,
} = require('./util/constant');

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

  if (language === LANGUAGE.ES6) {
    if (jsLinter === JSLINTER.STANDARD) {
      const needs = getPkg('eslint-config-standard', registry);
      lints.push(...needs);
    } else if (jsLinter === JSLINTER.AIRBNB) {
      const needs = getPkg('eslint-config-airbnb', registry);
      lints.push(...needs);
    } else {
      lints.push('eslint');
    }
  } else if (language === LANGUAGE.TYPESCRIPT) {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );

    if (jsLinter === JSLINTER.STANDARD) {
      const needs = getPkg('eslint-config-standard-with-typescript', registry);
      lints.push(...needs);
    } else if (jsLinter === JSLINTER.AIRBNB) {
      // can't use peerDependencies, add dependencies manually
      lints.push(
        'eslint',
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

  if (library === LIBRARY.VUE) {
    lints.push('eslint-plugin-vue');
  } else if (library === LIBRARY.REACT && jsLinter !== JSLINTER.AIRBNB) {
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

    if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      lints.push('stylelint-scss');
    }
  }

  return lints;
};

const getLibrary = (answer) => {
  const { library, version } = answer;
  const libs = [];

  if (library === LIBRARY.VUE) {
    if (version === 2) {
      libs.push('vue@^2.0.0');
    } else if (version === 3) {
      libs.push('vue@^3.0.0');
    }
  } else if (library === LIBRARY.REACT) {
    libs.push('react-hot-loader');

    if (version === 16) {
      libs.push('react@^16.0.0', 'react-dom@^16.0.0');
    } else if (version === 17) {
      libs.push('react@^17.0.0', 'react-dom@^17.0.0');
    }
  }

  return libs;
};

module.exports = (answer, registry) => {
  const { version, language } = answer;

  const preCommit = ['husky', 'lint-staged'];
  const types =
    language === LANGUAGE.TYPESCRIPT
      ? [
          '@types/node',
          '@types/webpack-env', // typescript for webpack such as module.hot()
        ]
      : [];

  typeof version !== 'undefined' &&
    types.push('@types/react', '@types/react-dom');

  return {
    dependencies: getLibrary(answer),
    devDependencies: [...getLints(answer, registry), ...types, ...preCommit],
  };
};
