const configOptions = require('./config-options');

class ServiceConfig {
  getServicesConfig(service) {
    return configOptions[service] || {};
  }
}

module.exports = ServiceConfig;
