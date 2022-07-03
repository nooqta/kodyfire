"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kody = void 0;
const events_1 = __importDefault(require("events"));
const kodyfire_core_1 = require("kodyfire-core");
const _1 = require(".");
class Kody extends kodyfire_core_1.BaseKody {
    constructor(params, _schema = _1.schema, technology = new _1.Technology(params)) {
        super();
        this.params = params;
        this.technology = technology;
        this.generator = new _1.Generator(params, technology);
        const validator = new _1.Validator();
        this.parser = new _1.Parser(validator);
        this.events = new events_1.default();
    }
    generate(_content) {
        this.generator.generate(_content);
    }
    parse(content) {
        return this.parser.parse(content);
    }
    read(source) {
        return this.parser.reader(source);
    }
    write(source, content) {
        return this.parser.write(source, content);
    }
    get errors() {
        return this.parser.validator.errors;
    }
    get data() {
        return this.parser.data;
    }
    whereami() {
        return __dirname;
    }
    whoami() {
        return __filename;
    }
}
exports.Kody = Kody;
//# sourceMappingURL=kody.js.map