// use express-async-errors replace asyncMiddleware
require('express-async-errors');

module.exports = function(config) {
  // check env variable
  if (!config.get('jwtPrivateKey') || !config.get('dbURL')) {
    throw new Error('Fatal Error for jwtPrivateKey not defined');
  }
};
