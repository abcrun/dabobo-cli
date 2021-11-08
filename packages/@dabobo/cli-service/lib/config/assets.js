module.exports = (options, mode) => {
  // webpack5 includes file-loader url-loader raw-loader default
  // const { name } = options;
  const rules = [
    {
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?.*)?$/i,
      type: 'asset',
    },
    {
      test: /\.(eot|otf|ttf|woff2?)(\?.*)?$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(mp3|mp4|webm|ogg|wav|aac)(\?.*)?$/i,
      type: 'asset/resource',
    },
    {
      test: /\.(pdf|txt|docx?|xlsx?|pptx?)(\?.*)?$/i,
      type: 'asset/resource',
    },
  ];
  const plugins = [];

  return {
    rules,
    plugins,
  };
};
