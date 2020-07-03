const fs = require('fs');
const { resolve } = require('path');

const inquirer = require('inquirer');
const dirs = resolve('./').split('/');
const projectName = dirs[dirs.length - 1];

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Please input your project name',
    default: projectName,
  },
  {
    type: 'list',
    name: 'code',
    message: 'Select a coding style you want to use',
    default: 0,
    choices: [
      { name: 'ES6', value: 0 },
      { name: 'Typescript', value: 1 },
    ],
  },
  {
    type: 'list',
    name: 'style',
    message: 'Which style guide do yo want to follow?',
    default: 0,
    choices: [
      { name: 'ESLint:recommended + Prettier', value: 0 },
      { name: 'Standard + Prettier', value: 1 },
      { name: 'AirBnB + Prettier', value: 2 },
    ],
  },
  {
    type: 'list',
    name: 'frame',
    message: 'What functionality do you want to use?',
    default: 0,
    choices: [
      { name: 'No Framework', value: 0 },
      { name: 'React', value: 1 },
    ],
  },
  {
    type: 'confirm',
    name: 'commitlint',
    message: 'Use commitlint for commit messages?',
    default: true,
  },
];

const getPkg = (params) => {
  let devDeps = {
    eslint: '^7.2.0',
    prettier: '2.0.5',
    'eslint-config-prettier': '^6.11.0',
    'eslint-plugin-prettier': '^3.1.4',
    husky: '^4.2.5',
    'lint-stated': '^10.2.11',
  };
  const { style, frame, code, commitlint, name } = params;

  const config = require('../config/package.json');
  config.name = name;

  if (style === 1) {
    devDeps = {
      ...devDeps,
      'eslint-config-standard': '^14.1.1',
      'eslint-plugin-standard': '^4.0.1',
      'eslint-plugin-promise': '^4.2.1',
      'eslint-plugin-import': '^2.21.2',
      'eslint-plugin-node': '^11.1.0',
    };
  } else if (style === 2) {
    if (code === 1) devDeps.push('eslint-config-airbnb-typescript');
    else devDeps.push('eslint-config-airbnb');

    devDeps = {
      ...devDeps,
      'eslint-plugin-jsx-ally': '^6.3.0',
      'eslint-plugin-import': '^2.21.2',
      'eslint-plugin-react': '^7.20.0',
      'eslint-plugin-hooks': '^4',
    };
  }

  if (frame === 1) {
    config.dependencies = {
      react: '^16',
      'react-dom': '^16',
    };

    if (style !== 2) {
      devDeps = {
        ...devDeps,
        'eslint-plugin-jsx-ally': '^6.3.0',
        'eslint-plugin-import': '^2.21.2',
        'eslint-plugin-react': '^7.20.0',
        'eslint-plugin-hooks': '^4',
      };
    }
  }

  if (code === 1) {
    devDeps = {
      ...devDeps,
      '@typescript-eslint/parser': '^3.5.0',
      '@typescript-eslint/eslint-plugin': '^3.5.0',
    };
  }

  if (commitlint) {
    devDeps = {
      ...devDeps,
      '@commitlint/cli': '^9.0.1',
      '@commitlint/config-conventional': '^9.0.1',
    };
  } else {
    delete config.husky.hooks['commit-msg'];
  }

  config.devDependencies = devDeps;

  return config;
};

const getLint = (params) => {
  const { style, code, frame } = params;
  const config = {
    env: {
      es6: true,
      browser: true,
      node: true,
    },
  };
  const extended = [];
  const parserOptions = {
    sourceType: 'module',
    ecmaVersion: 'es6',
    ecmaFeatures: {},
  };

  if (style === 0) {
    code
      ? extended.push('plugin:@typescript-eslint/recommended')
      : extended.push('eslint:recommended');
  } else if (style === 1) {
    code
      ? extended.push('standard', 'plugin:@typescript-eslint/recommended')
      : extended.push('standard');
  } else if (style === 2) {
    code
      ? extended.push(
          'airbnb-typescript',
          'plugin:@typescript-eslint/recommended'
        )
      : extended.push('airbnb');
  }

  if (code) config.parser = '@typescript-eslint/parser';

  if (frame === 1) {
    extended.unshift('plugin:react/recommended');
  }

  if (frame === 1 || style === 2) {
    parserOptions.ecmaFeatures.jsx = true;
  }

  config.extends = extended;
  config.parserOptions = parserOptions;

  return config;
};

const files = [
  '.eslintignore',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  'gitlab-ci.yml',
];

module.exports = () => {
  inquirer.prompt(questions).then((answers) => {
    const { commitlint } = answers;
    const pkg = getPkg(answers);
    const lint = getLint(answers);

    if (commitlint) files.push('commitlint.config.js');

    fs.writeFile(
      resolve('./', 'package.json'),
      JSON.stringify(pkg, '', '\t'),
      (err) => {
        if (err) console.error(JSON.stringify(err));
        else console.info('    create package.json');
      }
    );

    fs.writeFile(
      resolve('./', '.eslintrc.js'),
      JSON.stringify(lint, '', '\t'),
      (err) => {
        if (err) console.error(JSON.stringify(err));
        else console.info('    create .eslintrc.js');
      }
    );

    files.forEach((f) => {
      fs.copyFile(
        resolve(__dirname, '../config/' + f),
        resolve('./', f),
        (err) => {
          if (err) console.error(JSON.stringify(err));
          else console.info('    create ' + f);
        }
      );
    });
  });
};
