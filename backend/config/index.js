const ambiente = process.env.NODE_ENV || 'development';

const configuraciónBase = {
  jwt: {},
  puerto: process.env.PORT,
  suprimirLogs: false,
 
};

let configuraciónDeAmbiente = {};

switch (ambiente) {
  case 'development':
    configuraciónDeAmbiente = require('./dev');
    break;
  default:
    configuraciónDeAmbiente = require('./dev');
}

module.exports = {
  ...configuraciónBase,
  ...configuraciónDeAmbiente
};
