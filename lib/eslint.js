const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

module.exports = (root, answers) => {
  const { language, jsLinter, vue, react } = answers;
  const eslint = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [],
    rules: {
      'prettier/prettier': 'error',
    },
  };
  const extended = [];

  if (language === 0) {
    if (jsLinter === 0) {
      extended.push('eslint:recommended', 'plugin:prettier/recommended');
    } else if (jsLinter === 1) {
      extended.push('standard', 'prettier/standard');
    } else if (jsLinter === 2) {
      extended.push('airbnb', 'prettier/react', 'plugin:prettier/recommended');
    }
  } else if (language === 1) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = './tsconfig.json';

    if (jsLinter === 0) {
      extended.push(
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
      );
    } else if (jsLinter === 1) {
      extended.push(
        'standard-with-typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/standard',
        'plugin:prettier/recommended'
      );
    } else if (jsLinter === 2) {
      extended.push(
        'airbnb-typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
        'plugin:prettier/recommended'
      );
    }
  }

  if (vue) {
    // for vue
    if (vue === 0) {
      extended.unshift('plugin:vue/essential');
    } else if (vue === 1) {
      extended.unshift('plugin:vue/vue3-essential');
    }
  }

  if (react === 1) {
    // for react
    if (jsLinter !== 2) {
      extended.unshift('plugin:react/recommended');
      extended.push(
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
      );
    }
  }

  eslint.extends = extended;

  return fs
    .outputFile(
      resolve(root, '.eslintrc'),
      JSON.stringify(eslint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .eslintrc`);
    });
};
