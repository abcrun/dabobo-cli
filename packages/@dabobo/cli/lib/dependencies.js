const { LANGUAGE, LIBRARY } = require('./util/constant');

const getLibrary = (preset) => {
  const { library, version, useBoboRouter } = preset;
  const libs = [];

  if (library === LIBRARY.VUE) {
    if (version === 2) {
      libs.push('vue:^2.0.0');
    } else if (version === 3) {
      libs.push('vue:^3.0.0');
    }
  } else if (library === LIBRARY.REACT) {
    libs.push('react-hot-loader:^4.13.0');

    if (version === 16) {
      libs.push('react:^16.0.0', 'react-dom:^16.0.0');
    } else if (version === 17) {
      libs.push('react:^17.0.0', 'react-dom:^17.0.0');
    }
  }

  if (useBoboRouter) {
    if (library === LIBRARY.VUE) {
      if (version === 2) {
        libs.push('vue-router: ^3.5.3');
      } else if (version === 3) {
        libs.push('vue-router: ^4.0.12');
      }
    } else if (library === LIBRARY.VUE) {
      libs.push('react-router: ^5.2.1');
    }

    libs.push('@dabobo/utils:^0.1.3');
  }

  return libs;
};

module.exports = (preset, registry) => {
  const { language, library, version } = preset;

  const eslint = require('./eslint/deps')(preset, registry);
  const stylelint = require('./stylelint/deps')(preset, registry);
  const building = require('./build/deps')(preset, registry);

  const preCommit = ['husky', 'lint-staged'];
  const types =
    language === LANGUAGE.TYPESCRIPT
      ? [
          '@types/node:^16.7.2',
          '@types/webpack-env:^1.16.2', // typescript for webpack such as module.hot()
        ]
      : [];

  if (library === LANGUAGE.REACT && language === LANGUAGE.TYPESCRIPT) {
    if (version === 16) {
      types.push('@types/react:^16.0.0', '@types/react-dom:^16.0.0');
    } else if (version === 17) {
      types.push('@types/react:^17.0.0', '@types/react-dom:^17.0.0');
    }
  }

  return {
    dependencies: getLibrary(preset),
    devDependencies: [
      ...building,
      ...types,
      ...preCommit,
      ...eslint,
      ...stylelint,
    ],
  };
};
