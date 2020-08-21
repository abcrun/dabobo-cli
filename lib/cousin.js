const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { resolve } = require('path');
const chalk = require('chalk');

module.exports = (entry, answers) => {
  const store = memFs.create();
  const memEditor = editor.create(store);

  memEditor.copyTpl(
    resolve(__dirname, '../templates/.cousinrc.js'),
    resolve('./.cousinrc.js'),
    { entry }
  );

  memEditor.commit(() => {
    console.log(chalk.cyan('    create .cousinrc.js'));
  });
};
