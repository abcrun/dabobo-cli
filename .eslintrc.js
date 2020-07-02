module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'standard',
    'plugin:json/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
