module.exports = (options, mode) => {
  const { name } = options;
  const rules = [
    {
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      loader: 'url-loader',
      options: {
        esModule: false,
        limit: 8192,
        name: mode === 'development' ? '[name]-dev.[ext]' : name,
      },
    },
  ];
  const plugins = [];

  return {
    rules,
    plugins,
  };
};
