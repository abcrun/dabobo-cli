const fs = require('fs-extra');
const path = require('path');
const { LANGUAGE, BUILDINGTOOL } = require('../util/constant');

module.exports = (root, answer) => {
  const { language, buildingTool } = answer;
  const files = [
    './public/index.html',
    './.husky/pre-commit',
    './.husky/commit-msg',
    '.eslintignore',
    '.prettierrc',
    '.prettierignore',
    '.browserslistrc',
    'commitlint.config.js',
    '.ignore',
  ];

  if (language === LANGUAGE.TYPESCRIPT)
    files.push('assets.d.ts', 'tsconfig.json');

  if (buildingTool === BUILDINGTOOL.DABOBO) {
    files.push('./proxy/index.js', './mock/index.js', '.env');
  }

  return files.map((file) => {
    const fileName = file === '.ignore' ? '.gitignore' : file;

    return fs
      .copy(
        path.resolve(__dirname, '../../templates', file),
        path.resolve(root, fileName)
      )
      .then((res) => {
        console.log(`  created ${fileName}`);
      });
  });
};
