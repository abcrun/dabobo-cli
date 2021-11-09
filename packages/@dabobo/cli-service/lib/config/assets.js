module.exports = () => {
  // webpack5 includes file-loader url-loader raw-loader default
  const generator = {
    filename: 'assets/resource/[contenthash:4][ext]',
  };

  const rules = [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
      type: 'asset',
      generator: {
        filename: () => {
          return 'assets/images/[contenthash:4][ext]';
        },
      },
    },
    {
      test: /\.(eot|otf|ttf|woff2?)(\?.*)?$/i,
      type: 'asset/resource',
      generator,
    },
    {
      test: /\.(mp3|mp4|webm|ogg|wav|aac)(\?.*)?$/i,
      type: 'asset/resource',
      generator,
    },
    {
      test: /\.(pdf|txt|docx?|xlsx?|pptx?)(\?.*)?$/i,
      type: 'asset/resource',
      generator,
    },
  ];
  const plugins = [];

  return {
    rules,
    plugins,
  };
};
