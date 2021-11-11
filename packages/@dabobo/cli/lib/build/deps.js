const {
  LANGUAGE,
  LIBRARY,
  BUILDINGTOOL,
  CSSPREPROCESSOR,
} = require('../util/constant');

module.exports = (preset, registry) => {
  const { language, library, version, buildingTool, cssPreProcessor } = preset;
  const tools = ['webpack:^5.0.0', 'postcss-loader:^6.1.1', 'postcss:^8.0.1'];
  const babels = [
    // '@babel/preset-env',
    // '@babel/plugin-transform-runtime',
    // '@babel/plugin-transform-modules-commonjs', // for commonjs library
    // '@babel/plugin-proposal-class-properties', // This plugin is included in @babel/preset-env, in ES2022
    // '@babel/plugin-proposal-object-rest-spread', // This plugin is included in @babel/preset-env, in ES2018
    // '@babel/plugin-proposal-decorators',
    // '@babel/plugin-syntax-dynamic-import', // This plugin is included in @babel/preset-env, in ES2020
  ];

  if (buildingTool === BUILDINGTOOL.DABOBO) {
    tools.push('@dabobo/cli-service:^0.1.0');

    if (cssPreProcessor === CSSPREPROCESSOR.LESS) {
      tools.push('less-loader:^10.0.1', 'less:^4.0.0');
    } else if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      tools.push('sass-loader:^12.1.0', 'sass:^1.3.0');
    } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
      tools.push('stylus-loader:6.1.0', 'stylus:>=0.52.4');
    }

    if (library === LIBRARY.VUE) {
      if (version === 2) {
        tools.push(
          'vue-template-compiler:^2.6.14',
          'vue-loader:^15.9.8',
          'vue-loader-plugin:^1.3.0'
        );
      } else if (version === 3) {
        tools.push('@vue/compiler-sfc:^3.2.6', 'vue-loader:^16.0.0');
      }

      // babels.push('babel-preset-vue:^2.0.2'); // vue-loader instead of babel-preset-vue
    } else if (library === LIBRARY.REACT) {
      babels.push('@babel/preset-react:^7.14.5');
    }

    if (language === LANGUAGE.TYPESCRIPT) {
      babels.push('@babel/preset-typescript:^7.15.0');
    }
  }

  return [...tools, ...babels];
};
