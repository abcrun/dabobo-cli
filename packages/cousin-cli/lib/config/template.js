const fs = require('fs-extra');
const path = require('path');
const { LANGUAGE } = require('../util/constant');

module.exports = (root, answer) => {
  const { language } = answer;
  const files = [
    '.eslintignore',
    '.prettierrc',
    '.prettierignore',
    '.browserslistrc',
    'commitlint.config.js',
    '.ignore',
    './public/index.html',
  ];

  if (language === LANGUAGE.TYPESCRIPT)
    files.push('assets.d.ts', 'tsconfig.json');

  return files.map((file) => {
    const fileName = file === '.ignore' ? '.gitignore' : file;

    return fs
      .copy(
        path.resolve(__dirname, '../../templates', file),
        path.resolve(root, fileName)
      )
      .then((res) => {
        console.log(`  created ${file}`);
      });
  });
};
