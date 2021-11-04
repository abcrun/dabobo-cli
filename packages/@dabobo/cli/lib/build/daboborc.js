const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const { resolve } = require('path');
const { LANGUAGE } = require('../util/constant');

module.exports = (root, preset) => {
  const { language } = preset;
  const store = memFs.create();
  const memEditor = editor.create(store);

  const entry = language === LANGUAGE.TYPESCRIPT ? 'index.ts' : 'index.js';

  memEditor.copyTpl(
    resolve(__dirname, '../../templates/.daboborc.js'),
    resolve(root, './.daboborc.js'),
    { entry: 'src/' + entry }
  );

  return new Promise((resolve, reject) => {
    memEditor.commit(() => {
      console.log('  created .daboborc.js');
      resolve();
    });
  });
};
