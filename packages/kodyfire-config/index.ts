import * as defaultConfig from './config/default';
import { join, delimiter } from 'path';
class Config {
  config: any;
  initialConfig = defaultConfig;
  constructor() { 
    this.init();
  }
  private init() {
      process.env['NODE_CONFIG_DIR'] = `${join(__dirname, 'config')}${delimiter}${
          process.env['NODE_CONFIG_DIR'] ?? join(process.cwd(), '.kody')
        }`;
        this.config = require('config');
  }
  get(key = '') {
    if(!key) return this.config;
    return this.config.get(key);
  }
  has(key = '') {
    return this.config.has(key);
  }
  // assuming that aliases is key value mapping in the config, if provided alias exists under aliases get corresponding technology
    // else return alias
    getTechnology(alias: string) {
        const technologies = this.get('technologies');
        const aliases = this.get('aliases');
        if (aliases && aliases[alias]) {
            return aliases[alias];
        }
        if (technologies.includes(alias)) {
            return alias;
        }
        return null;
        }
}

export { Config };
