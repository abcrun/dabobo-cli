const fs = require('fs');
const { resolve } = require('path');

const chalk = require('chalk');

module.exports = (params) => {
  const { language, frame } = params;
  const babel = {
    presets: [['@babel/env']],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
    ],
  };

  if (frame === 1) babel.presets.push('@babel/preset-react');
  if (language === 1) babel.presets.push('@babel/preset-typescript');

  fs.writeFile(
    resolve('./', 'babel.config.json'),
    JSON.stringify(babel, '', '  '),
    (err) => {
      if (err) console.error(chalk.red(JSON.stringify(err)));
      else console.info(chalk.cyan('    create babel.config.json'));
    }
  );
};
