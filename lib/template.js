const fs = require('fs-extra');
const path = require('path');

module.exports = (root, answer) => {
  const { language } = answer;
  const files = [
    '.eslintignore',
    '.prettierrc',
    '.prettierignore',
    '.browserslistrc',
    'commitlint.config.js',
    '.env',
    '.gitignore',
    './proxy/index.js',
    './mock/index.js',
    './public/index.html',
  ];

  if (language === 1) files.push('assets.d.ts', 'tsconfig.json');

  return files.map((file) =>
    fs
      .copy(
        path.resolve(__dirname, '../templates', file),
        path.resolve(root, file)
      )
      .then((res) => {
        console.log(`  created ${file}`);
      })
  );
};
