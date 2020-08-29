#!/usr/bin/env node --harmony

'use strict';

const path = require('path');
const commander = require('commander');
const chalk = require('chalk');

const semver = require('semver');
const https = require('https');
const execSync = require('child_process').execSync;
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');
const spawn = require('cross-spawn');

const inquirer = require('./inquirer');
const init = require('./lib/fs');
const dependencies = require('./lib/dependencies');

const packageJson = require('./package.json');

const getLatestVersion = () => {
  return new Promise((resolve, reject) => {
    https
      .get('https://registry.npmjs.org/package/cousin-cli/dist-tags', (res) => {
        if (res.statusCode === 200) {
          let body = '';
          res.on('data', (data) => (body += data));
          res.on('end', () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject(res);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  }).catch(() => {
    try {
      return execSync('npm view cousin-cli version').toString().trim();
    } catch (e) {
      return null;
    }
  });
};

const isConflict = (root, name) => {
  const files = [
    '.init',
    '.eslintignore',
    '.prettierignore',
    '.prettierrc',
    '.env',
    '.browserslistrc',
    'proxy.js',
    'mocker.js',
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

module.exports = () => {
  let projectName;
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((name) => {
      projectName = name;
    })
    .option('--use-npm')
    .option('--use-pnp')
    .parse(process.argv);

  // Check Node Version
  if (!semver.satisfies(process.version, '>=10')) {
    console.log(
      chalk.yellow(
        `You are using Node ${process.version} - An old unsupported version of tools.\n\n` +
          `Please update to Node 10 or higher for a better, fully supported experience.\n`
      )
    );
    process.exit(1);
  }

  // Check cousin-cli's latest version
  console.log(chalk.greenBright('Checking for the latest version ...'));
  getLatestVersion().then((latest) => {
    if (latest && semver.lt(packageJson.version, latest)) {
      console.log();
      console.error(
        chalk.yellow(
          `You are running \`cousin-cli\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
            'We no longer support global installation of cousin-cli.'
        )
      );
      console.log();
      console.log(
        'Please remove any global installs with one of the following commands:\n' +
          '- npm uninstall -g cousin-cli\n' +
          '- yarn global remove cousin-cli'
      );
      console.log();
      process.exit(1);
    } else {
      console.log(`v${latest}`);
      console.log();
      createProject();
    }
  });

  const createProject = () => {
    // resolve projectName, such as: projectName: 'a/b/c', the appName is 'c'
    const root = path.resolve(projectName);
    const appName = path.basename(root);

    // Check projectName
    if (typeof appName === 'undefined') {
      console.error('Please specify the project directory:');
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
      );
      console.log();
      console.log('For example:');
      console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('my-project')}`
      );
      process.exit(1);
    } else {
      const validationResult = validateProjectName(appName);
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

    // create dir - it is projectName for full path, and not appName
    fs.ensureDirSync(projectName);

    // checkConflict
    if (isConflict(root, projectName)) {
      process.exit(1);
    }

    // init project
    inquirer().then((answers) => {
      init(root, answers).then(() => {
        const deps = dependencies(answers);
        const args = ['install-peerdeps', '--loglevel', 'error'].concat(deps);
        spawn('npm', args, { stdio: 'inherit' });
      });
    });
  };
};
