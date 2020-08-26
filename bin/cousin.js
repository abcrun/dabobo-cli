#!/usr/bin/env node --harmony

'use strict';

const { resolve } = require('path');
const commander = require('commander');
const chalk = require('chalk');

process.env.NODE_PATH = resolve(__dirname, '../node_modules');

const init = () => {
  const packageJson = require('./package.json');
  let projectName;

  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((name) => {
      projectName = name;
    })
    .option('--init', 'initial a project')
    .option('--use-npm')
    .option('--use-pnp')
    .on('--help', () => {
      console.log(
        `    Only ${chalk.green('<project-directory>')} is required.`
      );
    })
    .parse(process.argv);

  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-project')}`);
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }
};

module.exports = {
  init,
};
