const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');

module.exports = (root, answers) => {
  const { language, frame } = answers;
  const babel = {
    presets: [['@babel/preset-env']],
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

  if (frame === 1) {
    babel.presets.push('@babel/preset-react');
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
