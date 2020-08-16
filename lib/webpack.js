const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // 为模块提供中间缓存,首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 80%
// const WorkboxPlugin = require('workbox-webpack-plugin');

const cousin = require(path.resolve('./cousin.config.json'));
const pkg = require(path.resolve('./package.json'));

module.exports = (mode) => {
  const {
    entry = pkg.main,
    output,
    globalCss,
    externals = {},
    noParse = '',
    alias = {},
    cssType: css,
    useCssModules = false,
    ignorePlugin = [],
    favicon = false,
  } = cousin;

  const config = {
    // entry: /[tj]sx/i.test(entry) ? ['webpack/hot/only-dev-server', 'react-hot-loader/patch', entry] : [entry],
    entry: [entry],
    output: {
      filename: output.js,
      chunkFilename: output.chunkjs,
    },
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: alias,
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            priority: 1,
            chunks: 'initial',
            name: 'vendor',
            test: /node_modules/,
            minChunks: 1,
          },
          common: {
            name: 'common',
            minChunks: 3,
          },
          react: {
            test: (module) => {
              return /react|redux|prop-types/.test(module.context);
            },
            chunks: 'initial',
            name: 'react',
            priority: 2,
          },
        },
      },
    },
    module: {},
    target: 'web',
    externals: externals,
  };

  const include = [path.resolve('.')];

  const rules = [
    {
      test: /\.[tj]sx?$/,
      loader: ['thread-loader', 'cache-loader', 'babel-loader'], // thread-loader替代happypack
      include,
      exclude: [path.resolve('./node_modules')],
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
        importLoaders: 1,
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
    config.devtool = 'cheap-module-eval-source-map';
    config.mode = mode;
    config.output.pathinfo = true;
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
      // new webpack.HotModuleReplacementPlugin(), // 实际上当设置devserver hot时会自动添加这段代码
      new HardSourceWebpackPlugin()
    );
  } else {
    config.mode = 'production';
    config.output.publicPath = output.publicPath;
    config.optimization.minimizer = [
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
    ];
    /**
     * --mode=development 自动启用  FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
     * new UglifyJsPlugin(...)
     * new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
     * new webpack.optimize.ModuleConcatenationPlugin()
     * new webpack.NoEmitOnErrorsPlugin()
     */
    plugins.push(
      new CleanWebpackPlugin(),
      new OptimizeCSSAssetsPlugin({})
      // new WorkboxPlugin.GenerateSW({
      //   clientsClaim: true, // 让浏览器立即servece worker被接管
      //   skipWaiting: true, // 更新sw文件后，立即插队到最前面
      // })
    );
  }

  if (css === 0) {
    rules.push({
      test: /\.css$/i,
      use: basicCssLoaders,
      include,
    });
  } else if (css === 1) {
    basicCssLoaders.push({
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    });
    rules.push({
      test: /\.(c|le)ss$/i,
      use: basicCssLoaders,
      include,
    });
  } else if (css === 2) {
    basicCssLoaders.push('sass-loader');
    rules.push({
      test: /\.(c|sa|sc)ss$/i,
      use: basicCssLoaders,
      include,
    });
  }

  globalCss &&
    basicCssLoaders.push({
      loader: 'style-resources-loader',
      options: {
        patterns: globalCss,
      },
    });

  config.module.rules = rules;

  if (!/^\s*$/.test(noParse) || noParse.length > 0)
    config.module.noParse = noParse;

  plugins.push(
    new MiniCssExtractPlugin({
      filename: output.css,
      chunkFilename: output.chunkcss,
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      favicon,
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: /runtime.*\.js/,
    })
  );

  ignorePlugin.forEach((p) => {
    if (Array.isArray(p)) {
      plugins.push(
        p.length === 2
          ? new webpack.IgnorePlugin(p[0], p[1])
          : new webpack.IgnorePlugin(p[0])
      );
    } else if (typeof p === 'string') {
      plugins.push(new webpack.IgnorePlugin(p));
    }
  });

  config.plugins = plugins;

  return config;
};
