const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

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

  if (library === 0) {
    babel.presets = ['@vue/cli-plugin-babel/preset'];
  } else if (library === 1) {
    babel.presets = ['@babel/preset-env', '@babel/preset-react'];
    babel.plugins.push('react-hot-loader/babel');
  }

  if (language === 1) babel.presets.push('@babel/preset-typescript');

  return fs
    .outputFile(
      resolve(root, 'babel.config.json'),
      JSON.stringify(babel, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created babel.config.json`);
    });
};
