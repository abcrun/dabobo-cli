const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const babel = require('./babel');
const eslint = require('./eslint');
const cousinrc = require('./cousinrc');
const pkg = require('./package');

module.exports = (appName, root, answers) => {
  const files = [
    '.eslintignore',
    '.browserslistrc',
    '.prettierignore',
    '.prettierrc',
    'commitlint.config.js',
    '.env',
    'proxy.js',
    './mock/index.js',
    './public/index.html',
    './src/index.css',
  ];

  if (answers.language === 1) {
    files.push('assets.d.ts', 'tsconfig.json');
  }

  const interator = files.map((f) => {
    return fs
      .copy(
        path.resolve(__dirname, '../../templates', f),
        path.resolve(root, f)
      )
      .then((res) => {
        console.log(`  created ${f}`);
      });
  });
  interator.unshift(
    fs
      .outputFile(
        path.resolve(root, '.init'),
        JSON.stringify(answers, null, 2) + os.EOL
      )
      .then(() => {
        console.log(`  created .init`);
      })
  );
  interator.push(
    fs
      .copy(
        path.resolve(__dirname, '../../templates/.ignoregit'),
        path.resolve(root, './.gitignore')
      )
      .then(() => {
        console.log(`  created .gitignore`);
      }),
    eslint(root, answers),
    babel(root, answers),
    cousinrc(root, answers),
    pkg(appName, root, answers)
  );

  return Promise.all(interator);
};
