const { LIBRARY, BUILDINGTOOL, CSSPREPROCESSOR } = require('../util/constant');

module.exports = (preset, registry) => {
  const { library, version, buildingTool, cssPreProcessor } = preset;
  const tools = ['postcss-loader:^6.1.1'];

  if (buildingTool === BUILDINGTOOL.VUE) {
    tools.push('@vue/cli-service:~4.5.0');

    // vue-service only for webpack4 - need related loaders
    if (cssPreProcessor === CSSPREPROCESSOR.LESS) {
      tools.push('less-loader:^5.0.0', 'less:^3.0.4');
    } else if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      tools.push('sass-loader:^8.0.2', 'sass:^1.26.5');
    } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
      tools.push('stylus-loader:3.0.2', 'stylus:0.54.7');
    }
  } else {
    if (buildingTool === BUILDINGTOOL.UMI) {
      tools.push('umi:^3.5.17');
    } else if (buildingTool === BUILDINGTOOL.REACT) {
      tools.push('react-scripts:^4.0.3');
    } else {
      tools.push('@dabobo/cli-service:^0.1.0');
    }

    if (cssPreProcessor === CSSPREPROCESSOR.LESS) {
      tools.push('less-loader:^10.0.1', 'less:^4.0.0');
    } else if (cssPreProcessor === CSSPREPROCESSOR.SASS) {
      tools.push(
        'sass-loader:^12.1.0',
        'sass:^1.3.0'
        // 'node-sass:^6.0.0',
        // 'fibers:>=3.1.0'
      );
    } else if (cssPreProcessor === CSSPREPROCESSOR.STYLUS) {
      tools.push('stylus-loader:6.1.0', 'stylus:>=0.52.4');
    }
  }

  if (library === LIBRARY.VUE) {
    // tools.push('vue-loader', 'vue-loader-plugin');

    if (version === 2) {
      tools.push('vue-template-compiler:^2.6.14');
    } else if (version === 3) {
      tools.push('@vue/compiler-sfc:^3.2.6');
    }
  }

  return tools;
};
