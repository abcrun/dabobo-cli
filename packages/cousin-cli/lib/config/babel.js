const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { LANGUAGE, LIBRARY } = require('../util/constant');

module.exports = (root, answer) => {
  const { language, library } = answer;
  const babel = {
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
    ],
  };

  if (library === LIBRARY.VUE) {
    babel.presets = ['vue'];
  } else if (library === LIBRARY.REACT) {
    babel.presets = ['@babel/preset-env', '@babel/preset-react'];
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
