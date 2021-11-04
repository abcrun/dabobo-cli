const { CSSPREPROCESSOR } = require('../util/constant');

module.exports = (preset, registry) => {
  const { useStyleLint, cssPreProcessor } = preset;
  const lints = [];

  if (useStyleLint) {
    lints.push(
      'stylelint-config-standard:^22.0.0',
      'stylelint:^13.13.0',
      'stylelint-order:^4.1.0',
      'stylelint-config-recess-order:^2.5.0'
    );

    if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      lints.push('stylelint-scss:^3.20.1');
    } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
      lints.push('stylelint-plugin-stylus:^0.11.0');
    }
  }

  return lints;
};
