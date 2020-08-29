const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

module.exports = (root, answers) => {
  const { language, lint, frame } = answers;
  const eslint = {
    root: true,
    parser: 'Esprima',
    env: {
      es6: true,
      browser: true,
      node: true,
    },
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [],
    rules: {
      'prettier/prettier': 'warn',
    },
  };
  const settings = {
    react: {
      version: 'detect',
    },
  };
  const extended = [];

  if (language === 0) {
    delete eslint.parser;

    if (lint === 0) {
      extended.push('eslint:recommended', 'plugin:prettier/recommended');
    } else if (lint === 1) {
      extended.push(
        'standard',
        'prettier',
        'prettier/standard',
        'plugin:prettier/recommended'
      );
    } else if (lint === 2) {
      extended.push(
        'airbnb',
        'prettier',
        'prettier/react',
        'plugin:prettier/recommended'
      );

      eslint.settings = settings;
    }
  } else if (language === 1) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = './tsconfig.json';

    if (lint === 0) {
      extended.push(
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
      );
    } else if (lint === 1) {
      extended.push(
        'standard-with-typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/standard',
        'plugin:prettier/recommended'
      );
    } else if (lint === 2) {
      extended.push(
        'airbnb-typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react',
        'plugin:prettier/recommended'
      );
      eslint.settings = settings;
    }
  }

  if (frame === 1 && lint !== 2) {
    extended.unshift('plugin:react/recommended');
    extended.push(
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings'
    );
    eslint.settings = settings;
  }

  eslint.extends = extended;

  return fs
    .outputFile(
      resolve(root, '.eslintrc.json'),
      JSON.stringify(eslint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .eslintrc.json`);
    });
};
