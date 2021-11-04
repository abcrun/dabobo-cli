const { LANGUAGE, JSLINTER, LIBRARY } = require('../util/constant');

module.exports = (preset, registry) => {
  const { language, jsLinter, library } = preset;
  const lints = [
    'prettier:^2.3.2',
    'eslint-config-prettier:^8.3.0',
    'eslint-plugin-prettier:^3.4.1',
    '@commitlint/cli:^13.1.0',
    '@commitlint/config-conventional:^13.1.0',
  ];

  if (language === LANGUAGE.ES6) {
    if (jsLinter === JSLINTER.STANDARD) {
      lints.push(
        'eslint-config-standard:^16.0.3',
        'eslint-plugin-import:^2.22.1',
        'eslint-plugin-node:^11.1.0',
        'eslint-plugin-promise:^5.0.0',
        'eslint:^7.2.0'
      );
    } else if (jsLinter === JSLINTER.AIRBNB) {
      if (library === LIBRARY.REACT) {
        lints.push(
          'eslint-config-airbnb:18.2.1',
          'eslint-plugin-import:^2.22.1',
          'eslint-plugin-jsx-a11y:^6.4.1',
          'eslint-plugin-react:^7.21.5',
          'eslint-plugin-react-hooks:^4',
          'eslint:^7.2.0'
        );
      } else {
        lints.push(
          'eslint-config-airbnb-base:14.2.1',
          'eslint-plugin-import:^2.22.1',
          'eslint:^7.2.0'
        );
      }
    } else {
      lints.push('eslint:^7.32.0');
    }
  } else if (language === LANGUAGE.TYPESCRIPT) {
    lints.push(
      'typescript:^4.4.2',
      '@typescript-eslint/parser:^4.29.3',
      '@typescript-eslint/eslint-plugin:^4.29.3'
    );

    if (jsLinter === JSLINTER.STANDARD) {
      lints.push(
        'eslint-config-standard-with-typescript:^20.0.0',
        'eslint:>=7.12.1',
        'eslint-plugin-import:>=2.22.0',
        'eslint-plugin-node:>=11.1.0',
        'eslint-plugin-promise:>=4.2.1'
      );
    } else if (jsLinter === JSLINTER.AIRBNB) {
      lints.push(
        'eslint:^7.2.0',
        'eslint-config-airbnb-typescript:^12.3.1',
        'eslint-plugin-import:^2.22.0',
        'eslint-plugin-jsx-a11y:^6.3.1',
        'eslint-plugin-react:^7.20.3',
        'eslint-plugin-react-hooks:^4.0.8'
      );
    } else {
      lints.push('eslint:^7.32.0');
    }
  }

  if (library === LIBRARY.VUE) {
    lints.push('eslint-plugin-vue:^7.17.0');
  } else if (library === LIBRARY.REACT && jsLinter !== JSLINTER.AIRBNB) {
    lints.push(
      'eslint-plugin-react:^7.24.0',
      'eslint-plugin-react-hooks:^4.2.0',
      'eslint-plugin-jsx-a11y:^6.4.1'
    );
  }

  return lints;
};
