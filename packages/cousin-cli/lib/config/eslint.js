const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { LANGUAGE, JSLINTER, LIBRARY } = require('../util/constant');

function getExtends(answer) {
  const { language, jsLinter, library, version } = answer;
  const extended = [];

  if (language === LANGUAGE.ES6) {
    if (jsLinter === JSLINTER.RECOMMENDED) {
      extended.push('eslint:recommended');
    } else if (jsLinter === JSLINTER.STANDARD) {
      extended.push('standard');
    } else if (jsLinter === JSLINTER.AIRBNB) {
      extended.push('airbnb');
    }
  } else if (language === LANGUAGE.TYPESCRIPT) {
    if (jsLinter === JSLINTER.RECOMMENDED) {
      extended.push('plugin:@typescript-eslint/recommended');
    } else if (jsLinter === JSLINTER.STANDARD) {
      extended.push('standard-with-typescript');
    } else if (jsLinter === JSLINTER.AIRBNB) {
      extended.push('airbnb-typescript');
    }
  }

  if (library === LIBRARY.VUE) {
    extended.push(
      version === 3 ? 'plugin:vue/vue3-recommended' : 'plugin:vue/recommended'
    );
  } else if (library === LIBRARY.REACT) {
    extended.push('plugin:react/recommended');
  }

  extended.push('prettier');

  return extended;
}

module.exports = (root, answer) => {
  const { language } = answer;
  const eslint = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [],
    plugins: ['prettier'],
    globals: {
      Env: 'readonly',
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  };

  if (language === 1) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = './tsconfig.json';
  }

  eslint.extends = getExtends(answer);

  return fs
    .outputFile(
      resolve(root, '.eslintrc'),
      JSON.stringify(eslint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .eslintrc`);
    });
};
