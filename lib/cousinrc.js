const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { resolve } = require('path');

module.exports = (root, answer) => {
  const { language, library } = answer;
  const store = memFs.create();
  const memEditor = editor.create(store);

  let entry = 'index.js';
  if (language === 1) {
    entry = library === 1 ? 'index.tsx' : 'index.ts';
  } else {
    entry = library === 1 ? 'index.jsx' : 'index.js';
  }
  memEditor.copyTpl(
    resolve(__dirname, '../templates/.cousinrc.js'),
    resolve(root, './.cousinrc.js'),
    { entry: 'src/' + entry }
  );

  return new Promise((resolve, reject) => {
    memEditor.commit(() => {
      console.log('  created .cousinrc.js');
      resolve();
    });
  });
};
