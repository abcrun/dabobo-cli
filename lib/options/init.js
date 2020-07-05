const fs = require('fs');
const { resolve } = require('path');

const inquirer = require('inquirer');
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
    name: 'language',
    message: 'Select a coding style you want to use',
    default: 0,
    choices: [
      { name: 'ES6', value: 0 },
      { name: 'Typescript', value: 1 },
    ],
  },
  {
    type: 'list',
    name: 'lint',
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

const files = [
  '.eslintignore',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  'gitlab-ci.yml',
];

module.exports = () => {
  inquirer.prompt(questions).then((answers) => {
    require('../package')(answers);
    require('../eslint')(answers);

    const { commitlint } = answers;
    if (commitlint) files.push('commitlint.config.js');

    files.forEach((f) => {
      fs.copyFile(
        resolve(__dirname, '../template/' + f),
        resolve('./', f),
        (err) => {
          if (err) console.error(JSON.stringify(err));
          else console.info('    create ' + f);
        }
      );
    });
  });
};
