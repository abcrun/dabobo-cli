const { BUILDINGTOOL } = require('../util/constant');

module.exports = (root, answer) => {
  const { buildingTool } = answer;
  if (buildingTool === BUILDINGTOOL.DABOBO) {
    return require('./daboborc')(root, answer);
  } else if (buildingTool === BUILDINGTOOL.VUE) {
    return require('./vueconfig')(root, answer);
  }

  return true;
};
