const logger = require('../startup/logging');

module.exports = async function(req, res, next) {
  await next();

  logger.info(req.baseUrl);
};
