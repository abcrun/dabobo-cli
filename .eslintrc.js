module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
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
