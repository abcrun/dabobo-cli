const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { CSSPREPROCESSOR } = require('../util/constant');

module.exports = (root, answers) => {
  const { cssPreProcessor } = answers;
  const stylelint = {
    extends: ['stylelint-config-standard'],
    plugins: [],
    rules: {
      'at-rule-no-unknown': [
        true,
        {
          ignoreAtRules: ['mixin', 'extend', 'content', 'include'],
        },
      ],
      'no-descending-specificity': null,
    },
  };

  if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
    stylelint.plugins.push('stylelint-scss');
  } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
    stylelint.extends.push('stylelint-plugin-stylus/standard');
  }

  stylelint.extends.push('stylelint-config-recess-order');

  return fs
    .outputFile(
      resolve(root, '.stylelintrc.json'),
      JSON.stringify(stylelint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .stylelintrc.json`);
    });
};
