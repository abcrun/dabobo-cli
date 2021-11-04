#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const leven = require('leven');
const fs = require('fs-extra');
const execa = require('execa');
const ora = require('ora');

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

async function checkDaboboVersion(registry) {
  const spinner = ora(chalk.bold('Checking for the latest version...')).start();
  const command = ['view', '@dabobo/cli', 'version'];

  if (registry) command.push('--registry', registry);

  const { stdout } = await execa('npm', command);

  const latest = stdout.trim();

  if (latest) {
    if (semver.lt(pkg.version, latest)) {
      spinner.warn(
        chalk.bold(`Current Version: v${pkg.version}`) +
          chalk.yellow(
            `(The latest version is v${latest}. It is better to upgrade to the latest version.)`
          )
      );
    } else {
      spinner.succeed(chalk.bold(`Current Version: v${pkg.version}`));
    }
  }
}

checkNodeVersion(pkg.engines.node);

program
  .version(`@dabobo/cli ${pkg.version}`)
  .usage('dabobo <command> [options] [args]');

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
  .action(async (name, options) => {
    await checkDaboboVersion(options.registry);

    console.log();
    require('../lib/create')(name, options);
  });

program
  .command('install')
  .description(
    'install a project with an existing preset (default "./.presetrc")'
  )
  .option('-p, --preset <file>', 'use a specified preset file for install')
  .option(
    '-r, --registry <url>',
    'use specified registry when installing dependencies'
  )
  .option(
    '--use-yarn',
    'use yarn as the package manager (the default package manager)'
  )
  .option('--use-npm', 'use npm as the package manager')
  .action((options) => {
    const { preset } = options;
    const root = path.resolve();
    const projectName = path.basename(root);
    const f = path.resolve(preset || './.presetrc');

    fs.pathExists(f).then((exists) => {
      if (exists) {
        // need to check schema
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
  .command('dev')
  .description('alias of "npm run dev" in the current project')
  .allowUnknownOption()
  .action((entry, options) => {
    execa('npm', ['run', 'dev', process.argv.slice(3)]);
  });

program
  .command('build')
  .description('alias of "npm run build" in the current project')
  .allowUnknownOption()
  .action((entry, options) => {
    execa('npm', ['run', 'build', process.argv.slice(3)]);
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
