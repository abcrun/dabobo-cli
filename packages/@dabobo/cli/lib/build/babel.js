const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { LANGUAGE, LIBRARY } = require('../util/constant');

module.exports = (root, preset) => {
  const { language, library } = preset;

  const babel = {
    presets: ['@babel/preset-env'],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
    ],
  };

  if (library === LIBRARY.VUE) {
    // need babel-preset-vue ??
  } else if (library === LIBRARY.REACT) {
    babel.presets.push('@babel/preset-react');
    babel.plugins.push('react-hot-loader/babel');
  }

  if (language === LANGUAGE.TYSCRIPT)
    babel.presets.push('@babel/preset-typescript');

  return fs
    .outputFile(
      resolve(root, 'babel.config.json'),
      JSON.stringify(babel, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created babel.config.json`);
    });
};
