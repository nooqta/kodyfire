"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yaml = void 0;
const { load } = require('js-yaml');
const { readFileSync } = require('fs');
class Yaml {
    static resolve(source) {
        const data = readFileSync(source, 'utf8');
        return load(data.toString());
    }
}
exports.Yaml = Yaml;
//# sourceMappingURL=yaml.js.map