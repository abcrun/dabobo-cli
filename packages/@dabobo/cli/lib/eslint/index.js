const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { LANGUAGE, JSLINTER, LIBRARY } = require('../util/constant');

function getExtends(preset) {
  const { language, jsLinter, library, version } = preset;
  const extended = [];

  if (language === LANGUAGE.ES6) {
    if (jsLinter === JSLINTER.RECOMMENDED) {
      extended.push('eslint:recommended');
    } else if (jsLinter === JSLINTER.STANDARD) {
      extended.push('standard');
    } else if (jsLinter === JSLINTER.AIRBNB) {
      if (language === LIBRARY.REACT) {
        extended.push('airbnb');
      } else {
        extended.push('airbnb-base');
      }
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

module.exports = (root, preset) => {
  const { language } = preset;
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
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
    },
  };

  if (language === LANGUAGE.TYPESCRIPT) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = './tsconfig.json';
  }

  eslint.extends = getExtends(preset);

  return fs
    .outputFile(
      resolve(root, '.eslintrc'),
      JSON.stringify(eslint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .eslintrc`);
    });
};
