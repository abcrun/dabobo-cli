const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const inquirer = require('inquirer');

function checkProjectName(projectName) {
  const validationResult = validateProjectName(projectName);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${projectName}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
}

module.exports = (name, options) => {
  const root = path.resolve(name || '.');
  const projectName = path.basename(root);

  checkProjectName(projectName);

  // create dir
  if (name) {
    fs.ensureDirSync(projectName);
    process.chdir(root);
  }

  // check conflict
  if (require('./util').isConflict(root, projectName, ['.presetrc'])) {
    process.exit(1);
  }

  // prompt for config
  inquirer.prompt(require('./prompt')).then((answer) => {
    require('./install')(root, answer, options);
  });
};
