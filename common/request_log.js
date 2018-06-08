var logger = require('./logger');

var ignore = /^\/(html|css|js)/;

exports = module.exports = function (req, res, next) {
  // Assets do not out log.
  if (ignore.test(req.url)) {
    next();
    return;
  }
  var t = new Date();
  logger.info('\nStarted', t.toISOString(), req.method, req.url, req.ip);

  res.on('finish', function () {
    var duration = ((new Date()) - t);

    logger.info('Completed', res.statusCode, ('(' + duration + 'ms)').green);
  });

  next();
};
