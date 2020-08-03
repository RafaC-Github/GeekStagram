const winston = require('winston');
const config = require('../config');



module.exports = new winston.Logger({
  transports: [
    
    new winston.transports.Console({
      level: config.suprimirLogs ? 'error' : 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: object => {
        return JSON.stringify(object);
      }
    })
  ]
});
