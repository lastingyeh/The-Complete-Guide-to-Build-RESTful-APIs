const { createLogger, format, transports } = require('winston');
const config = require('config');

// run as winston mongodb
require('winston-mongodb');

process.on('unhandledRejection', ex => {
  console.log('rejection', ex);

  throw ex;
});

// winston.add(
//   new winston.transports.MongoDB({
  
//   }),
// );

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true,
    }),
    new transports.File({ filename: 'logfile.log', level: 'info' }),
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
      ),
    }),
    new transports.MongoDB({
      db: config.get('dbURL'),
      level: 'info',
    })
  ],
  exitOnError: false,
});

module.exports = logger;
