import EventEmitter from 'events';
import { BaseKody, } from 'kodyfire-core';
import { Generator, Parser, Validator } from '.';
export class Kody extends BaseKody {
    constructor(params) {
        super();
        const validator = new Validator();
        this.params = params;
        this.parser = new Parser(validator);
        this.generator = new Generator(params);
        this.technology = this.generator.technology;
        this.events = new EventEmitter();
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
//# sourceMappingURL=kody.js.map