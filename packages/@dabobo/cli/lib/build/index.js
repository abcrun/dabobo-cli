const { BUILDINGTOOL } = require('../util/constant');

module.exports = (root, answer) => {
  const { buildingTool } = answer;
  if (buildingTool === BUILDINGTOOL.DABOBO) {
    return [
      require('./daboborc')(root, answer),
      require('./babel')(root, answer),
      require('./postcss')(root),
    ];
  }

  return [true];
};
