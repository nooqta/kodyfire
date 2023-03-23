import * as defaultConfig from 'config';
export default ((initialConfiguration = {}) => {
    process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const config = require('config');

  // Mixin configs that have been passed in, and make those my defaults
  config.util.extendDeep(defaultConfig, initialConfiguration);
  console.log('config', config.util.toObject());
  return config;
})()