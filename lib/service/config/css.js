const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (cssPreProcessor, options, mode) => {
  const defaultName = '[name].[contenthash:8]';
  const {
    filename = defaultName,
    chunkFilename = defaultName,
    modules,
  } = options;
  const rules = [];
  const plugins = [];

  const loaders = [
    {
      loader:
        mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: { modules },
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
    // less
    rules.push(
      {
        test: /\.css$/i,
        use: loaders,
      },
      {
        test: /\.less$/i,
        use: [...loaders, 'less-loader'],
      }
    );
  } else if (cssPreProcessor === 1) {
    // sass
    rules.push(
      {
        test: /\.css$/,
        use: loaders,
      },
      {
        test: /\.scss$/i,
        use: [...loaders, 'sass-loader'],
      },
      {
        test: /\.sass$/i,
        use: [...loaders, 'sass-loader?indentedSyntax'],
      }
    );
  } else if (cssPreProcessor === 2) {
    // stylus
    rules.push(
      {
        test: /\.css$/,
        use: loaders,
      },
      {
        test: /\.styl$/i,
        use: [...loaders, 'stylus-loader'],
      }
    );
  } else {
    // no pre-processor
    rules.push({
      test: /\.css$/i,
      use: loaders,
    });
  }

  if (mode === 'development') {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
        chunkFilename: `${chunkFilename}.css`,
      })
    );
  }

  return {
    rules,
    plugins,
  };
};
