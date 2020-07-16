const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cousin = require(path.resolve('./cousin.config.json'));
const pkg = require(path.resolve('./package.json'));

module.exports = (env) => {
  const { cssType: css } = cousin;
  const config = {
    entry: pkg.main,
    output: {},
    module: {},
    target: 'web',
  };
  const rules = [
    {
      test: /\.[tj]sx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      loader: 'url-loader',
      options: {
        limit: 8192,
      },
    },
  ];
  const plugins = [];
  const basicCssLoaders = {
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: true,
          modules: true,
          localIdentName: '[name]_[local]_[hash:base64:5]',
        },
      },
    ],
  };

  if (env === 'development') {
    config.devtool = 'inline-source-map';
    config.mode = 'development';
    config.devServer = {
      contentBase: path.resolve('./public'),
      inline: true,
      compress: true, // gzip
      historyApiFallback: true,
      hot: true,
      profile: true, // 捕获webpack构建性能信息，用于分析导致构建性能不佳的原因
      cache: false, // 是否启用缓存来提升构建性能
    };
    // 控制台信息
    config.stats = {
      assets: true,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: true,
    };
    if (css === 0) {
      rules.push({
        test: /\.css$/i,
        use: basicCssLoaders,
      });
    } else if (css === 1) {
      basicCssLoaders.use.push('less-loader');
      rules.push({
        test: /\.(c|le)ss$/i,
        use: basicCssLoaders,
      });
    } else if (css === 2) {
      basicCssLoaders.use.push('sass-loader');
      rules.push({
        test: /\.(c|sa|sc)ss$/i,
        use: basicCssLoaders,
      });
    } else if (css === 3) {
      basicCssLoaders.use.push({
        loader: 'postcss-loader',
        options: {
          plugins: (loader) => [
            require('postcss-import')({ root: loader.resourePath }),
            require('postcss-cssnext')(),
            require('autoprefixer')(),
          ],
        },
      });
      rules.push({
        test: /\.css$/i,
        use: basicCssLoaders,
      });
    }

    plugins.push(
      /**
       * --mode=development 自动启用 NamedChunksPlugin 和 NamedModulesPlugin
       * new webpack.NamedModulesPlugin()
       * new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") })
       */
      new webpack.HotModuleReplacementPlugin()
    );
  } else {
    config.mode = 'production';

    if (css === 0) {
      rules.push({
        test: /\.css$/i,
        use: ExtractTextPlugin.extract(basicCssLoaders),
      });
    } else if (css === 1) {
      basicCssLoaders.use.push('less-loader');
      rules.push({
        test: /\.(c|le)ss$/i,
        use: ExtractTextPlugin.extract(basicCssLoaders),
      });
    } else if (css === 2) {
      basicCssLoaders.use.push('sass-loader');
      rules.push({
        test: /\.(c|sa|sc)ss$/i,
        use: ExtractTextPlugin.extract(basicCssLoaders),
      });
    } else if (css === 3) {
      basicCssLoaders.use.push({
        loader: 'postcss-loader',
        options: {
          plugins: (loader) => [
            require('postcss-import')({ root: loader.resourePath }),
            require('postcss-cssnext')(),
            require('autoprefixer')(),
          ],
        },
      });
      rules.push({
        test: /\.css$/i,
        use: ExtractTextPlugin.extract(basicCssLoaders),
      });
    }
    /**
     * --mode=development 自动启用  FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
     * new UglifyJsPlugin(...)
     * new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
     * new webpack.optimize.ModuleConcatenationPlugin()
     * new webpack.NoEmitOnErrorsPlugin()
     */
    plugins.push(
      new CleanWebpackPlugin(),
      new ExtractTextPlugin({
        filename: '[name]_[contenthash:8].css',
      })
    );
  }

  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    })
  );

  config.module.rules = rules;
  config.plugins = plugins;

  return config;
};
