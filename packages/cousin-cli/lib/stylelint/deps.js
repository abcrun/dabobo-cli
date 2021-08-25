const { CSSPREPROCESSOR } = require('../util/constant');
const { getPkg } = require('../util');

module.exports = (preset, registry) => {
  const { useStyleLint, cssPreProcessor } = preset;
  const lints = [];

  if (useStyleLint) {
    lints.push(
      ...getPkg('stylelint-config-standard', registry),
      'stylelint-order',
      'stylelint-config-recess-order'
    );

    if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      lints.push('stylelint-scss');
    } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
      lints.push('stylelint-plugin-stylus');
    }
  }

  return lints;
};
