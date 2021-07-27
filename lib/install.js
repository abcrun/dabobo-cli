const chalk = require('chalk');

function getPackageManager(options) {
  const { useYarn, useNpm, usePnpm } = options;
  const mutiManager = useYarn + useNpm + usePnpm > 1;

  if (mutiManager) {
    console.log(chalk.red('You can only config one package manager!'));
    process.exit(1);
  }

  const packageManager = useYarn
    ? 'yarn'
    : useNpm
    ? 'npm'
    : usePnpm
    ? 'pnpm'
    : 'yarn';

  return packageManager;
}

function addDependencies(packageManager) {
  console.log();
  console.log(
    chalk.greenBright(`${packageManager}: Start to install the dependencies...`)
  );
}

module.exports = (root, answer, options) => {
  const template = require('./template')(root, answer);
  const presetrc = require('./presetrc')(root, answer);
  const eslint = require('./eslint')(root, answer);
  const stylelint = require('./stylelint')(root, answer);
  const babel = require('./babel')(root, answer);
  const pkg = require('./package')(root, answer);

  console.log();
  console.log(chalk.greenBright('Initializing the necessary files...'));
  Promise.all([...template, presetrc, eslint, stylelint, babel, pkg]).then(
    () => {
      const packageManager = getPackageManager(options);
      addDependencies(packageManager);
    }
  );
};
