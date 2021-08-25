const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const execSync = require('child_process').execSync;

exports.isConflict = function (root, name, extraFiles = []) {
  // only check nessary files
  const files = [
    ...extraFiles,
    '.eslintrc',
    '.eslintignore',
    '.prettierrc',
    '.prettierignore',
    '.stylelintrc.json',
    'commitlint.config.js',
    'babel.config.json',
    '.cousinrc.js',
    '.env',
    '.browserslistrc',
  ];
  const conflicts = fs.readdirSync(root).filter((file) => files.includes(file));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(`${file}/`)}`);
        } else {
          console.log(`  ${file}`);
        }
      } catch (e) {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      'Either try using a new directory name, or remove the files listed above.'
    );

    return true;
  }

  return false;
};

exports.getPkg = (name, registry, exclude) => {
  let result = execSync(
    'npm view ' +
      name +
      ' peerDependencies' +
      (registry ? ' --registry=' + registry : '')
  )
    .toString()
    .trim();

  result = result.replace(/'/g, '"').replace(/([^{\s'"]+)\s*:/g, ($0, $1) => {
    return '"' + $1 + '":';
  });
  result = JSON.parse(result);

  if (exclude) {
    delete result[exclude];
  }

  const deps = Object.keys(result).map((k) => {
    return k + '@' + result[k];
  });
  deps.unshift(name);

  return deps;
};
