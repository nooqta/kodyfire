"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const defaultConfig = __importStar(require("./config/default"));
const path_1 = require("path");
class Config {
    constructor() {
        this.initialConfig = defaultConfig;
        this.init();
    }
    init() {
        var _a;
        process.env['NODE_CONFIG_DIR'] = `${(0, path_1.join)(__dirname, 'config')}${path_1.delimiter}${(_a = process.env['NODE_CONFIG_DIR']) !== null && _a !== void 0 ? _a : (0, path_1.join)(process.cwd(), '.kody')}`;
        this.config = require('config');
    }
    get(key = '') {
        if (!key)
            return this.config;
        return this.config.get(key);
    }
    has(key = '') {
        return this.config.has(key);
    }
    // assuming that aliases is key value mapping in the config, if provided alias exists under aliases get corresponding technology
    // else return alias
    getTechnology(alias) {
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
exports.Config = Config;
//# sourceMappingURL=index.js.map