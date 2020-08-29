const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { resolve } = require('path');

module.exports = (root, answers) => {
  const store = memFs.create();
  const memEditor = editor.create(store);
  const { language, frame } = answers;

  let entry = 'index.js';
  if (language === 1) {
    entry = frame ? 'index.tsx' : 'index.ts';
  } else {
    entry = frame ? 'index.jsx' : 'index.js';
  }
  memEditor.copyTpl(
    resolve(__dirname, '../../templates/.cousinrc.js'),
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
