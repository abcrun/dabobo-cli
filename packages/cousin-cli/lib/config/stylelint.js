const fs = require('fs-extra');
const os = require('os');
const { resolve } = require('path');
const { CSSPREPROCESSOR } = require('../util/constant');

module.exports = (root, answers) => {
  const { cssPreProcessor } = answers;
  const stylelint = {
    extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
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
  }

  return fs
    .outputFile(
      resolve(root, '.stylelintrc.json'),
      JSON.stringify(stylelint, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .stylelintrc.json`);
    });
};
