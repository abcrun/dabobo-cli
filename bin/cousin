#!/usr/bin/env node --harmony

'use strict';

const path = require('path');
process.env.NODE_PATH = path.resolve(__dirname, '../node_modules');

const program = require('commander');

program.version(require('../package').version);

program.option('-i, --init', 'initial a project', () => {
  require('../command/init')();
});

program.parse(process.argv);

// if (!program.args.length) {
//   program.help();
// }
