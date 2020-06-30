const inquirer = require('inquirer');
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
    name: 'typescript',
    message: 'Do you want to use typescript?',
    default: false,
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
  const { style, frame, commitlint, name } = params;
  const config = { name };

  if (style === 1) {
    devDeps.push(
      'eslint-config-standard',
      'eslint-plugin-standard',
      'eslint-plugin-promise',
      'eslint-plugin-import',
      'eslint-plugin-node'
    );
  } else if (style === 2) {
    devDeps.push(
      'eslint-config-airbnb',
      'eslint-plugin-jsx-ally',
      'eslint-plugin-import',
      'eslint-plugin-react',
      'eslint-plugin-hooks'
    );
  }

  if (frame === 1 && style !== 2) {
    devDeps.push(
      'eslint-plugin-jsx-ally',
      'eslint-plugin-import',
      'eslint-plugin-react',
      'eslint-plugin-hooks'
    );
    config.dependencies = {
      react: '@latest',
    };
  }

  if (commitlint) {
    devDeps.push('@commitlint/cli', '@commitlint/config-conventional');
  }

  const devDependencies = {};
  devDeps.forEach((dep) => {
    devDependencies[dep] = '@latest';
  });
  config.devDependencies = devDependencies;

  return config;
};

module.exports = () => {
  inquirer.prompt(questions).then((answers) => {
    console.log(getPkg(answers));
  });
};
