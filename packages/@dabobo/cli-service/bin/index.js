#!/usr/bin/env node
'use strict';

const program = require('commander');
const chalk = require('chalk');

const pkg = require('../package.json');

program.version(`cousin-service ${pkg.version}`);

program
  .command('dev [entry]')
  .description('for developping')
  .option('-e, --env <env>', 'set environment (default development)')
  .option('-o, --open', 'Open browser')
  .option('-p, --port <port>', 'Server port (default: 8080)')
  .action((entry, options) => {
    require('../lib/dev')(entry, options);
  });

program
  .command('build [entry]')
  .description('build production')
  .option('-e, --env <env>', 'set environment (default production)')
  .action((entry, options) => {
    require('../lib/prod')(entry, options.env);
  });

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log();
  console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
});

program.commands.forEach((c) => c.on('--help', () => console.log()));

program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `cousin-service <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
