const { LANGUAGE, LIBRARY } = require('./util/constant');

const getLibrary = (preset) => {
  const { library, version } = preset;
  const libs = [];

  if (library === LIBRARY.VUE) {
    if (version === 2) {
      libs.push('vue@^2.0.0');
    } else if (version === 3) {
      libs.push('vue@^3.0.0');
    }
  } else if (library === LIBRARY.REACT) {
    libs.push('react-hot-loader');

    if (version === 16) {
      libs.push('react@^16.0.0', 'react-dom@^16.0.0');
    } else if (version === 17) {
      libs.push('react@^17.0.0', 'react-dom@^17.0.0');
    }
  }

  return libs;
};

module.exports = (preset, registry) => {
  const { language, library } = preset;

  const eslint = require('./eslint/deps')(preset, registry);
  const stylelint = require('./stylelint/deps')(preset, registry);
  const babel = require('./babel/deps')(preset, registry);
  const building = require('./build/deps')(preset, registry);

  const preCommit = ['husky', 'lint-staged'];
  const types =
    language === LANGUAGE.TYPESCRIPT
      ? [
          '@types/node',
          '@types/webpack-env', // typescript for webpack such as module.hot()
        ]
      : [];

  library === LANGUAGE.REACT &&
    language === LANGUAGE.TYPESCRIPT &&
    types.push('@types/react', '@types/react-dom');

  return {
    dependencies: getLibrary(preset),
    devDependencies: [
      ...types,
      ...preCommit,
      ...eslint,
      ...stylelint,
      ...babel,
      ...building,
    ],
  };
};
