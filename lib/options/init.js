const fs = require('fs');
const { resolve } = require('path');

const chalk = require('chalk');

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
    message: 'Select a coding language you want to use',
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
  '.prettierignore',
  '.prettierrc',
  'gitlab-ci.yml',
];

module.exports = () => {
  inquirer.prompt(questions).then((answers) => {
    console.log(
      chalk.green('Creating required files and have a good journey!')
    );

    require('../package')(answers);
    require('../eslint')(answers);
    require('../babel')(answers);

    const { commitlint } = answers;
    if (commitlint) files.push('commitlint.config.js');

    // npm publish can't publish .gitignore file
    fs.copyFile(
      resolve(__dirname, '../../templates/.ignoregit'),
      resolve('./', '.gitignore'),
      (err) => {
        if (err) console.error(chalk.red(JSON.stringify(err)));
        else console.log(chalk.cyan('    create .gitignore'));
      }
    );

    files.forEach((f) => {
      fs.copyFile(
        resolve(__dirname, '../../templates/' + f),
        resolve('./', f),
        (err) => {
          if (err) console.error(chalk.red(JSON.stringify(err)));
          else console.log(chalk.cyan('    create ' + f));
        }
      );
    });
  });
};
