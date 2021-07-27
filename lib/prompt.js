module.exports = [
  {
    type: 'list',
    name: 'language',
    message: 'Select a programming language you want to use',
    default: 0,
    choices: [
      { name: 'ES6+', value: 0 },
      { name: 'Typescript', value: 1 },
    ],
  },
  {
    type: 'list',
    name: 'jsLinter',
    message: 'Pick a linter/formatter config(Prettier is enabled by default)',
    default: 0,
    choices: [
      { name: 'ESLint:recommended', value: 0 },
      { name: 'Standard', value: 1 },
      { name: 'AirBnB', value: 2 },
    ],
  },
  {
    type: 'list',
    name: 'library',
    message: 'What functionality do you want to use',
    default: 0,
    choices: [
      { name: 'Vue', value: 0 },
      { name: 'React', value: 1 },
      { name: 'No Library/Framework', value: 2 },
    ],
  },
  {
    type: 'list',
    name: 'vue',
    message: 'Choose a version of Vue.js that you want to start with',
    default: 0,
    when: function (answers) {
      return answers.library === 0;
    },
    choices: [
      { name: '2.x', value: 0 },
      { name: '3.x', value: 1 },
    ],
  },
  {
    type: 'list',
    name: 'react',
    message: 'Choose a version of React.js that you want to start with',
    default: 0,
    when: function (answers) {
      return answers.library === 1;
    },
    choices: [
      { name: '16.x', value: 0 },
      { name: '17.x', value: 1 },
      { name: '18.x', value: 2 },
    ],
  },

  {
    type: 'list',
    name: 'cssPreProcessor',
    message:
      'Pick a CSS pre-processor(PostCSS, Autoprefix and CSS Modules are supported by default)',
    default: 0,
    choices: [
      { name: 'less', value: 0 },
      { name: 'sass', value: 1 },
      { name: 'stylus', value: 2 },
      { name: 'No pre-processor', value: 3 },
    ],
  },
  {
    type: 'confirm',
    name: 'useStyleLint',
    message: 'Do you want to enable stylelint?',
    default: true,
  },
];
