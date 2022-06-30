"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const extractor_1 = require("./extractor");
const transformer_1 = require("./transformer");
const loader_1 = require("./loader");
const kodyfire_core_1 = require("kodyfire-core");
const fs = require('fs');
class Parser {
    constructor(validator) {
        this.validate = (data) => {
            return this.validator.validate(data);
        };
        this.extractor = () => {
            // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
            return (0, extractor_1.extract)();
        };
        this.transformer = () => {
            // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
            return (0, transformer_1.transform)();
        };
        this.loader = () => {
            return (0, loader_1.load)();
        };
        this.validator = validator;
        this.requiresExtract = false;
        this.requiresTansform = false;
        this.requiresLoad = false;
    }
    reader(source) {
        return this.readfile(source);
    }
    parse(data) {
        if (!this.validate(data)) {
            return false;
        }
        this.data = data;
        return data;
    }
    readfile(filepath) {
        const fileContent = fs.readFileSync(filepath);
        const extension = filepath.split('.').pop();
        if (extension === 'json') {
            return JSON.parse(fileContent);
        }
        else if (extension === 'yml') {
            return kodyfire_core_1.Yaml.resolve(filepath);
        }
        throw new Error('Unsupported file extension');
    }
    write(filepath, data) {
        fs.writeFileSync(filepath, JSON.stringify(data, null, '\t'));
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map