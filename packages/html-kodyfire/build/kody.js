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
        const validator = new _1.Validator();
        this.params = params;
        this.parser = new _1.Parser(validator);
        this.generator = new _1.Generator(params);
        this.technology = technology;
        this.events = new events_1.default();
    }
    generate(_content) {
        this.events.emit('generate', _content);
        this.generator.generate(_content);
    }
    parse(content) {
        this.events.emit('parse', content);
        return this.parser.parse(content);
    }
    read(source) {
        this.events.emit('read', source);
        return this.parser.reader(source);
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