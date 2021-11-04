exports.dev = function () {
  require('./lib/dev').apply(this, arguments);
};

exports.build = function () {
  require('./lib/prod').apply(this, arguments);
};
