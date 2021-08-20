const { BUILDINGTOOL } = require('../../util/constant');

module.exports = (root, answer) => {
  const { buildingTool } = answer;
  if (buildingTool === BUILDINGTOOL.COUSIN) {
    return require('./cousinrc')(root, answer);
  }

  return true;
};
