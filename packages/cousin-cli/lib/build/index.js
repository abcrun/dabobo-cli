const { BUILDINGTOOL } = require('../util/constant');

module.exports = (root, answer) => {
  const { buildingTool } = answer;
  if (buildingTool === BUILDINGTOOL.COUSIN) {
    return require('./cousinrc')(root, answer);
  } else if (buildingTool === BUILDINGTOOL.VUE) {
    return require('./vueconfig')(root, answer);
  }

  return true;
};
