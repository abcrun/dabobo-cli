const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

module.exports = (options) => {
  let { language, library, version } = options;
  if (language === 'es6+') language = 'es';

  fs.ensureDirSync(path.resolve('./src'));

  const dest = path.resolve(
    __dirname,
    `src/${library}/${language}/v${version}`
  );
  const exist = fs.pathExistsSync(dest);
  const to = path.resolve('./src');

  if (exist) {
    const spinner = ora(
      chalk.bold('Start to create template for you.')
    ).start();

    fs.copySync(dest, to);
    spinner.succeed(chalk.bold(`Created the necessary templates`));
  } else {
    // something else
  }
};
