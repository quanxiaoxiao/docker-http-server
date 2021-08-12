const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  server: {
    port: isDev ? 4433 : 3000,
  },
  logger: {
    pathname: path.resolve(__dirname, '..', 'logger'),
  },
};
