const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const cousin = require(path.resolve('./cousin.config.json'));
const pkg = require(path.resolve('./package.json'));

module.exports = (mode) => {
  const {
    entry = pkg.main,
    output,
    externals = {},
    noParse = '',
    alias = {},
    cssType: css,
    useCssModules = false,
    favicon = false,
  } = cousin;

  const config = {
    entry: entry,
    output: {
      filename: output.js,
      chunkFilename: output.chunkjs,
    },
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main'],
      alias: alias,
    },
    module: {},
    target: 'web',
    externals: externals,
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
        outputPath: './assets',
        name: mode === 'development' ? '[name].[ext]' : output.assets,
      },
    },
  ];
  const plugins = [];
  const basicCssLoaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: mode === 'development',
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
          require('postcss-preset-env')({ stage: 0 }),
        ],
      },
    },
  ];

  if (mode === 'development') {
    config.devtool = 'inline-source-map';
    config.mode = mode;
    config.output.pathinfo = true;
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
    config.output.publicPath = output.publicPath;
    config.optimization = {
      minimizer: [
        new OptimizeCSSAssetsPlugin({}),
        new UglifyJsPlugin({
          parallel: true,
          cache: false,
          sourceMap: false,
          uglifyOptions: {
            compress: {
              dead_code: true,
              drop_debugger: true,
              drop_console: true,
              loops: true,
            },
            warnings: false,
          },
        }),
      ],
    };
    /**
     * --mode=development 自动启用  FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
     * new UglifyJsPlugin(...)
     * new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
     * new webpack.optimize.ModuleConcatenationPlugin()
     * new webpack.NoEmitOnErrorsPlugin()
     */
    plugins.push(new CleanWebpackPlugin(), new OptimizeCSSAssetsPlugin({}));
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

  if (!/^\s*$/.test(noParse) || noParse.length > 0)
    config.module.noParse = noParse;

  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      favicon,
    }),
    new MiniCssExtractPlugin({
      filename: output.css,
      chunkFilename: output.chunkcss,
    })
  );
  config.plugins = plugins;

  return config;
};
