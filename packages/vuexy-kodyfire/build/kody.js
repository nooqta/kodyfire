"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kody = void 0;
const events_1 = __importDefault(require("events"));
const kodyfire_core_1 = require("kodyfire-core");
const _1 = require(".");
class Kody extends kodyfire_core_1.BaseKody {
    constructor(params) {
        super();
        this.params = params;
        const validator = new _1.Validator();
        this.parser = new _1.Parser(validator);
        this.generator = new _1.Generator(params);
        this.technology = this.generator.technology;
        this.events = new events_1.default();
    }
    generate(_content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.generator.generate(_content);
        });
    }
    parse(content) {
        return this.parser.parse(content);
    }
    read(source) {
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