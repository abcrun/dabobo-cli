const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

function getExtends(answer) {
  const { language, jsLinter } = answer;
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

  extended.push('prettier');

  return extended;
}

function getPlugins(answer) {
  const { library, vue } = answer;
  const plugins = [];

  if (library === 0) {
    plugins.push(vue === 1 ? 'vue/vue3-essential' : 'vue/essential');
  } else {
    plugins.push('react');
  }

  plugins.push('prettier');

  return plugins;
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
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [],
    plugins: [],
    rules: {
      'prettier/prettier': 'warn',
    },
  };

  if (language === 1) {
    eslint.parser = '@typescript-eslint/parser';
    eslint.parserOptions.project = './tsconfig.json';
  }

  eslint.extends = getExtends(answer);
  eslint.plugins = getPlugins(answer);

  return fs
    .outputFile(
      resolve(root, '.eslintrc'),
      JSON.stringify(eslint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .eslintrc`);
    });
};
