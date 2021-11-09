const chalk = require('chalk');
const execa = require('execa');
// const ora = require('ora');

const command = {
  yarn: [],
  npm: ['install', '--report'],
};

function getPackageManager(options) {
  const { useYarn, useNpm } = options;
  const mutiManager = useYarn + useNpm > 1;

  if (mutiManager) {
    console.log(chalk.red('You can only config one package manager!'));
    process.exit(1);
  }

  const packageManager = useYarn ? 'yarn' : useNpm ? 'npm' : 'yarn';

  return packageManager;
}

async function install(packageManager, registry) {
  console.log();

  const cmd = command[packageManager];
  if (registry) cmd.push('--registry', registry);

  execa.sync(packageManager, cmd, { stdio: 'inherit' });
}

module.exports = (root, answer, options) => {
  const registry = options.registry;

  const eslint = require('./eslint')(root, answer);
  const stylelint = require('./stylelint')(root, answer);
  const template = require('./config/template')(root, answer);
  const presetrc = require('./config/presetrc')(root, answer);
  const pkg = require('./config/package')(root, answer, registry);
  const building = require('./build')(root, answer);

  console.log();
  console.log(chalk.bold('Initializing the necessary files...'));
  Promise.all([
    ...template,
    presetrc,
    eslint,
    stylelint,
    pkg,
    ...building,
  ]).then(() => {
    const packageManager = getPackageManager(options);
    install(packageManager, registry);
  });
};
