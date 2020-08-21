const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // 为模块提供中间缓存,首次构建时间没有太大变化，但是第二次开始，构建时间大约可以节约 80%

const cousin = require(path.resolve('./.cousinrc.js'));
const envs = JSON.parse(fs.readFileSync(path.resolve('./.env')));
const init = JSON.parse(fs.readFileSync(path.resolve('./.init')));

module.exports = (mode, env) => {
  const { useCssModules, css, frame } = init;
  const {
    entry,
    output,
    externals = {},
    noParse = '',
    alias = {},
    styleResources,
    plugins: extraPlugins = [],
  } = cousin;
  const { assets, ...outputInfo } = output;

  const formatEntry = (entry instanceof Array ? entry : [entry]).map((url) => {
    return path.resolve(url);
  });
  if (frame === 1) formatEntry.unshift('react-hot-loader/patch');

  const config = {
    entry: formatEntry,
    output: outputInfo,
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
        },
      },
    },
    module: {},
    target: 'web',
    externals: externals,
  };

  // 初始化plugins
  const plugins = [new HardSourceWebpackPlugin()];
  const envDatas = env && envs[env];
  if (envDatas) {
    const defines = {};
    for (const key in envDatas) {
      defines['process.env.' + key] = JSON.stringify(envDatas[key]);
    }
    plugins.push(new webpack.DefinePlugin(defines));
  }

  // 处理module
  const include = [path.resolve('.')];
  const exclude = [path.resolve('./node_modules')];
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
  const rules = [
    {
      test: /\.[tj]sx?$/,
      loader: ['thread-loader', 'cache-loader', 'babel-loader'], // thread-loader替代happypack
      include,
      exclude,
    },
    {
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      loader: 'url-loader',
      options: {
        limit: 8192,
        outputPath: './assets',
        name: mode === 'development' ? '[name].[ext]' : assets,
      },
    },
  ];
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
  styleResources &&
    styleResources.patterns &&
    basicCssLoaders.push({
      loader: 'style-resources-loader',
      options: styleResources,
    });
  config.module.rules = rules;

  // 其他相关基础配置
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
     * new webpack.NoEmitOnErrorsPlugin() */
    plugins.push(new CleanWebpackPlugin(), new OptimizeCSSAssetsPlugin({}));
  }

  if (!/^\s*$/.test(noParse) || noParse.length > 0)
    config.module.noParse = noParse;

  plugins.push(
    new MiniCssExtractPlugin({
      filename:
        mode === 'development'
          ? '[name].css'
          : output.filename.replace('js', 'css'),
      chunkFilename:
        mode === 'development'
          ? '[name].css'
          : output.chunkFilename.replace('js', 'css'),
    })
  );

  config.plugins = plugins.concat(extraPlugins);

  return config;
};
