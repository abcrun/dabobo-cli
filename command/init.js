const inquirer = require('inquirer');
const fs = require('fs');
const { resolve } = require('path');
const dirs = resolve('./').split('/');
const projectName = dirs[dirs.length - 1];

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Please input your project name',
    default: projectName,
  },
  {
    type: 'list',
    name: 'code',
    message: 'Select a coding style you want to use',
    default: 0,
    choices: [
      { name: 'ES6', value: 0 },
      { name: 'Typescript', value: 1 },
    ],
  },
  {
    type: 'list',
    name: 'style',
    message: 'Which style guide do yo want to follow?',
    default: 0,
    choices: [
      { name: 'ESLint:recommended + Prettier', value: 0 },
      { name: 'Standard + Prettier', value: 1 },
      { name: 'AirBnB + Prettier', value: 2 },
    ],
  },
  {
    type: 'list',
    name: 'frame',
    message: 'What functionality do you want to use?',
    default: 0,
    choices: [
      { name: 'No Framework', value: 0 },
      { name: 'React', value: 1 },
    ],
  },
  {
    type: 'confirm',
    name: 'commitlint',
    message: 'Use commitlint for commit messages?',
    default: true,
  },
];

const getPkg = (params) => {
  const devDeps = [
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'husky',
    'lint-stated',
  ];
  const { style, frame, code, commitlint, name } = params;

  const config = require('../config/package.json');
  config.name = name;

  if (style === 1) {
    devDeps.push(
      'eslint-config-standard',
      'eslint-plugin-standard',
      'eslint-plugin-promise',
      'eslint-plugin-import',
      'eslint-plugin-node'
    );
  } else if (style === 2) {
    if (code === 1) devDeps.push('eslint-config-airbnb-typescript');
    else devDeps.push('eslint-config-airbnb');

    devDeps.push(
      'eslint-plugin-jsx-ally',
      'eslint-plugin-import',
      'eslint-plugin-react',
      'eslint-plugin-hooks'
    );
  }

  if (frame === 1) {
    config.dependencies = {
      react: '@latest',
    };

    style !== 2 &&
      devDeps.push(
        'eslint-plugin-jsx-ally',
        'eslint-plugin-import',
        'eslint-plugin-react',
        'eslint-plugin-hooks'
      );
  }

  if (code === 1) {
    devDeps.push(
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );
  }

  if (commitlint) {
    devDeps.push('@commitlint/cli', '@commitlint/config-conventional');
  } else {
    delete config.husky.hooks['commit-msg'];
  }

  const devDependencies = {};
  devDeps.forEach((dep) => {
    devDependencies[dep] = '@latest';
  });
  config.devDependencies = devDependencies;

  return config;
};

const getLint = (params) => {
  const { style, code, frame } = params;
  const config = {
    env: {
      es6: true,
      browser: true,
      node: true,
    },
  };
  const extended = [];
  const parserOptions = {
    sourceType: 'module',
    ecmaVersion: 'es6',
    ecmaFeatures: {},
  };

  if (style === 0) {
    code
      ? extended.push('plugin:@typescript-eslint/recommended')
      : extended.push('eslint:recommended');
  } else if (style === 1) {
    code
      ? extended.push('standard', 'plugin:@typescript-eslint/recommended')
      : extended.push('standard');
  } else if (style === 2) {
    code
      ? extended.push(
          'airbnb-typescript',
          'plugin:@typescript-eslint/recommended'
        )
      : extended.push('airbnb');
  }

  if (code) config.parser = '@typescript-eslint/parser';

  if (frame === 1) {
    extended.unshift('plugin:react/recommended');
  }

  if (frame === 1 || style === 2) {
    parserOptions.ecmaFeatures.jsx = true;
  }

  config.extends = extended;
  config.parserOptions = parserOptions;

  return config;
};

module.exports = () => {
  inquirer.prompt(questions).then((answers) => {
    const pkg = getPkg(answers);
    fs.writeFile(resolve('./', 'package1.json'), JSON.stringify(pkg), () => {});

    console.log(getLint(answers));
  });
};
