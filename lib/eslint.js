const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

function getExtends(answer) {
  const { language, jsLinter, library, vue } = answer;
  const extended = [];

  if (language === 0) {
    if (jsLinter === 0) {
      extended.push('eslint:recommended');
    } else if (jsLinter === 1) {
      extended.push('standard');
    } else if (jsLinter === 2) {
      extended.push('airbnb');
    }
  } else if (language === 1) {
    if (jsLinter === 0) {
      extended.push('plugin:@typescript-eslint/recommended');
    } else if (jsLinter === 1) {
      extended.push('standard-with-typescript');
    } else if (jsLinter === 2) {
      extended.push('airbnb-typescript');
    }
  }

  if (library === 0) {
    extended.push(
      vue === 1 ? 'plugin:vue/vue3-recommended' : 'plugin:vue/recommended'
    );
  } else if (library === 1) {
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
