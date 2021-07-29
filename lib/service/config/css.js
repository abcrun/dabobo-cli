const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (cssPreProcessor, css, env) => {
  const defaultName = '[name].[contenthash:8]';
  let rule, plugins;

  const loaders = [
    {
      loader:
        env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            require('postcss-import')(),
            require('postcss-preset-env')(),
          ],
        },
      },
    },
  ];

  if (cssPreProcessor === 0) {
    rule = {
      test: /\.(le|c)ss$/i,
      use: [
        ...loaders,
        {
          loader: 'less-loader',
          options: {},
        },
      ],
    };
  } else if (cssPreProcessor === 1) {
    return {
      test: /\.(sc|sa|c)ss$/i,
      use: [
        ...loaders,
        {
          loader: 'sass-loader',
          options: {},
        },
      ],
    };
  } else if (cssPreProcessor === 2) {
    return {
      test: /\.(styl|c)ss$/i,
      use: [
        ...loaders,
        {
          loader: 'stylus-loader',
          options: {},
        },
      ],
    };
  } else {
    return {
      test: /\.css$/i,
      use: [...loaders],
    };
  }

  if (env === 'development') {
    plugins = [
      new MiniCssExtractPlugin({
        filename: css.filename || defaultName + '.css',
        chunkFilename: css.chunkFilename || defaultName + '.css',
      }),
    ];
  }

  return {
    rule,
    plugins,
  };
};
