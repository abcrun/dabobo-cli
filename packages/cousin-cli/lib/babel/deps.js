const { LANGUAGE, LIBRARY, BUILDINGTOOL } = require('../util/constant');

module.exports = (preset, registry) => {
  const { language, library, buildingTool } = preset;

  // umi don't need export dependencies
  if (buildingTool === BUILDINGTOOL.UMI) {
    return [];
  }

  // cousin-service includes these pkgs in deps
  const babels = [
    // '@babel/preset-env',
    // '@babel/plugin-transform-runtime',
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-object-rest-spread',
    // '@babel/plugin-proposal-decorators',
    // '@babel/plugin-syntax-dynamic-import',
  ];

  if (library === LIBRARY.VUE) {
    babels.push('babel-preset-vue:^2.0.2');
  } else if (library === LIBRARY.REACT) {
    babels.push('@babel/preset-react:^7.14.5');
  }

  if (language === LANGUAGE.TYPESCRIPT) {
    babels.push('@babel/preset-typescript:^7.15.0');
  }

  return babels;
};
