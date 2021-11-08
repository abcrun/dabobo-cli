module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['standard', 'prettier'],
  plugins: ['prettier', 'json'],
  rules: {
    'prettier/prettier': 'warn',
  },
};
