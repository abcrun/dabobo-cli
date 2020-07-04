const fs = require('fs');
const { resolve } = require('path');

module.exports = (params) => {
  const { language, lint, frame } = params;
  const eslint = {
    root: true,
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
    rules: {
      'prettier/prettier': 'warn',
    },
  };
  const settings = {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  };
  const extended = [];

  if (language === 0) {
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
    }
  } else if (language === 1) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = '';

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
        'prettier/standard',
        'plugin:prettier/recommended'
      );
    } else if (lint === 2) {
      extended.push(
        'airbnb-typescript',
        'prettier',
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

  fs.writeFile(
    resolve('./', '.eslintrc.js'),
    'module.exports = \t' + JSON.stringify(eslint, '', '\t'),
    (err) => {
      if (err) console.error(JSON.stringify(err));
      else console.info('    create .eslintrc.js');
    }
  );
};
