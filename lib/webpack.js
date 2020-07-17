const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cousin = require(path.resolve('./cousin.config.json'));
const pkg = require(path.resolve('./package.json'));

module.exports = (env) => {
  const { cssType: css, useCssModules = false } = cousin;
  const config = {
    entry: pkg.main,
    output: {
      filename: '[name].js',
    },
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
  const basicCssLoaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: './',
        hmr: env === 'development',
      },
    },
    {
      loader: 'css-loader',
      options: {
        modules: useCssModules,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: (loader) => [
          require('postcss-import')({ root: loader.resourcePath }),
          require('postcss-cssnext')(),
        ],
      },
    },
  ];

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
    /**
     * --mode=development 自动启用  FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
     * new UglifyJsPlugin(...)
     * new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
     * new webpack.optimize.ModuleConcatenationPlugin()
     * new webpack.NoEmitOnErrorsPlugin()
     */
    plugins.push(new CleanWebpackPlugin());
  }

  if (css === 0) {
    rules.push({
      test: /\.css$/i,
      use: basicCssLoaders,
    });
  } else if (css === 1) {
    basicCssLoaders.push('less-loader');
    rules.push({
      test: /\.(c|le)ss$/i,
      use: basicCssLoaders,
    });
  } else if (css === 2) {
    basicCssLoaders.push('sass-loader');
    rules.push({
      test: /\.(c|sa|sc)ss$/i,
      use: basicCssLoaders,
    });
  }
  config.module.rules = rules;

  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  );
  config.plugins = plugins;

  return config;
};
