const mongoose = require('mongoose');

const logger = require('../startup/logging');

module.exports = function(config) {
  mongoose.Promise = global.Promise;

  mongoose.set('useCreateIndex', true);

  mongoose
    .connect(
      config.get('dbURL'),
      { useNewUrlParser: true },
    )
    .then(() => logger.info('Connected to MongoDB...'));
  // handle by uncaught exception.
  // .catch(err => console.error('Could not connect to MongoDB...'));
};
