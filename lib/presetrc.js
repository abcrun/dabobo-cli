const fs = require('fs-extra');
const path = require('path');
const os = require('os');

module.exports = (root, answer) => {
  return fs
    .outputFile(
      path.resolve(root, '.presetrc'),
      JSON.stringify(answer, null, 2) + os.EOL
    )
    .then(() => {
      console.log(`  created .presetrc`);
    });
};
