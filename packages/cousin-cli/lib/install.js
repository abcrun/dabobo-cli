const chalk = require('chalk');
const execa = require('execa');

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

function install(packageManager, registry) {
  const reg = registry ? [`--registry=${registry}`] : [];

  console.log();
  console.log(chalk.greenBright(`checking for dependencies...`));

  execa.sync(packageManager, ['--reporter', 'silent', ...reg], {
    stdio: 'inherit',
  });
}

module.exports = (root, answer, options) => {
  const registry = options.registry;

  const eslint = require('./eslint')(root, answer);
  const stylelint = require('./stylelint')(root, answer);
  const babel = require('./babel')(root, answer);
  const building = require('./build')(root, answer);
  const template = require('./config/template')(root, answer);
  const presetrc = require('./config/presetrc')(root, answer);
  const pkg = require('./config/package')(root, answer, registry);

  console.log();
  console.log(chalk.greenBright('Initializing the necessary files...'));
  Promise.all([
    ...template,
    presetrc,
    eslint,
    stylelint,
    babel,
    pkg,
    building,
  ]).then(() => {
    const packageManager = getPackageManager(options);
    install(packageManager, registry);
  });
};
