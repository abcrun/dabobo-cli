#!/usr/bin/env node --harmony

'use strict';

const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const leven = require('leven');
const fs = require('fs-extra');

const pkg = require('../package.json');

// check node version
function checkNodeVersion(latest) {
  if (!semver.satisfies(process.version, latest)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version} - An old unsupported version of tools.\n` +
          `Please update to Node ${latest} or higher for a better, fully supported experience.`
      )
    );
    process.exit(1);
  }

  const EOL_NODE_MAJORS = ['8.x', '9.x', '11.x', '13.x'];
  for (const major of EOL_NODE_MAJORS) {
    if (semver.satisfies(process.version, major)) {
      console.log(
        chalk.red(
          `You are using Node ${process.version}.\n` +
            `Node.js ${major} has already reached end-of-life and will not be supported in future major releases.\n` +
            `It's strongly recommended to use an active LTS version instead.`
        )
      );
      process.exit(1);
    }
  }
}

// check cousin-cli latest version
async function checkCousinVersion() {
  console.log(chalk.greenBright('Checking for the latest version ...'));

  const latest = require('child_process')
    .execSync('npm view cousin-cli version')
    .toString()
    .trim();

  if (latest) {
    if (semver.lt(pkg.version, latest)) {
      console.log(
        chalk.yellow(
          `You are running at cousin-cli@${pkg.version}, and the latest version is v-${latest}. It is better to upgrade to the latest version.`
        )
      );
    } else {
      console.log(
        chalk.yellow(`You are running at cousin-cli@${pkg.version}.`)
      );
    }
  }

  console.log();
}

checkNodeVersion(pkg.engines.node);
checkCousinVersion();

program
  .version(`cousin-cli ${pkg.version}`)
  .usage('cousin <command> [options] [args]');

program
  .command('create [project-diretory]')
  .description('create a new project')
  .option(
    '-r, --registry <url>',
    'use specified registry when installing dependencies'
  )
  .option(
    '--use-yarn',
    'use yarn as the package manager (the default package manager)'
  )
  .option('--use-npm', 'use npm as the package manager')
  .option('--use-pnpm', 'use pnpm as the package manager')
  .action((name, options) => {
    require('../lib/create')(name, options);
  });

program
  .command('install')
  .description(
    'install a project with an existing preset (default "./.presetrc")'
  )
  .option('-f, --file <file>', 'use a specified preset file for install')
  .option(
    '-r, --registry <url>',
    'use specified registry when installing dependencies'
  )
  .option(
    '--use-yarn',
    'use yarn as the package manager (the default package manager)'
  )
  .option('--use-npm', 'use npm as the package manager')
  .option('--use-pnpm', 'use pnpm as the package manager')
  .action((options) => {
    const { file } = options;
    const root = path.resolve();
    const projectName = path.basename(root);
    const f = path.resolve(file || './.presetrc');

    fs.pathExists(f).then((exists) => {
      if (exists) {
        fs.readJson(f).then((preset) => {
          if (!require('../lib/util').isConflict(root, projectName)) {
            require('../lib/install')(root, preset, options);
          }
        });
      } else {
        console.log(chalk.red(`Can't find the preset file: ${f}`));
      }
    });
  });

program
  .command('init <remote-url>')
  .description('generate a project from a remote template')
  .action((url) => {
    console.log(url);

    // require('./lib/init')(url)
  });

program
  .command('dev [entry]')
  .description('for developping')
  .option('-e, --env <env>', 'set environment (default development)')
  .option('-o, --open', 'Open browser')
  .option('-p, --port <port>', 'Server port (default: 8080)')
  .action((entry, options) => {
    console.log(entry, options);

    // require('./lib/service/dev')(entry, options)
  });

program
  .command('build [entry]')
  .description('build production')
  .option('-e, --env <env>', 'set environment (default production)')
  .action((entry, options) => {
    console.log(entry, options);

    // require('./lib/service/build')(entry, options)
  });

program
  .command('report')
  .description('run to view the build report')
  .action(() => {
    // require('./lib/service/report')();
  });

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log();
  console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  suggestCommands(cmd);
  console.log();
});

program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `cousin <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach((c) => c.on('--help', () => console.log()));

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach((cmd) => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}
