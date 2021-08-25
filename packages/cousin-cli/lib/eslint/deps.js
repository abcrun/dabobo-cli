const { getPkg } = require('../util');
const {
  LANGUAGE,
  JSLINTER,
  LIBRARY,
  CSSPREPROCESSOR,
} = require('../util/constant');

module.exports = (preset, registry) => {
  const { language, jsLinter, library, useStyleLint, cssPreProcessor } = preset;
  const lints = [
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    '@commitlint/cli',
    '@commitlint/config-conventional',
  ];

  if (language === LANGUAGE.ES6) {
    if (jsLinter === JSLINTER.STANDARD) {
      const needs = getPkg('eslint-config-standard', registry);
      lints.push(...needs);
    } else if (jsLinter === JSLINTER.AIRBNB) {
      const needs = getPkg('eslint-config-airbnb', registry);
      lints.push(...needs);
    } else {
      lints.push('eslint');
    }
  } else if (language === LANGUAGE.TYPESCRIPT) {
    lints.push(
      'typescript',
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin'
    );

    if (jsLinter === JSLINTER.STANDARD) {
      const needs = getPkg('eslint-config-standard-with-typescript', registry);
      lints.push(...needs);
    } else if (jsLinter === JSLINTER.AIRBNB) {
      lints.push(
        'eslint',
        'eslint-config-airbnb-typescript@^12.3.1',
        'eslint-plugin-import@^2.22.0',
        'eslint-plugin-jsx-a11y@^6.3.1',
        'eslint-plugin-react@^7.20.3',
        'eslint-plugin-react-hooks@^4.0.8'
      );
    } else {
      lints.push('eslint');
    }
  }

  if (library === LIBRARY.VUE) {
    lints.push('eslint-plugin-vue');
  } else if (library === LIBRARY.REACT && jsLinter !== JSLINTER.AIRBNB) {
    lints.push(
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y'
    );
  }

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
