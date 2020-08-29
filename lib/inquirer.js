const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'language',
    message: 'Please select a coding language you want to use',
    default: 0,
    choices: [
      { name: 'ES6+', value: 0 },
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
    name: 'useCssModules',
    message: 'Do you want to enable the css modules?',
    default: false,
  },
  {
    type: 'list',
    name: 'css',
    message: 'Which CSS preprocessor will be used?',
    default: 0,
    choices: [
      { name: 'CSS', value: 0 },
      { name: 'Less', value: 1 },
      { name: 'Sass', value: 2 },
    ],
  },
];

module.exports = () => {
  return inquirer.prompt(questions);
};
