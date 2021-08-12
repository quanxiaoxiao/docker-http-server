const path = require('path');
const winston = require('winston');
const config = require('./config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(config.logger.pathname, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.resolve(config.logger.pathname, 'combined.log'),
    }),
  ],
});

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
