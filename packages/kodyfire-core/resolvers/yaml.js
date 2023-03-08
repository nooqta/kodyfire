"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yaml = void 0;
const yaml = require('js-yaml');
const fs = require('fs');
class Yaml {
    static resolve(source) {
        const data = fs.readFileSync(source, 'utf8');
        return yaml.load(data.toString());
    }
}
exports.Yaml = Yaml;
//# sourceMappingURL=yaml.js.map