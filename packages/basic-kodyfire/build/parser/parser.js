import { extract } from './extractor';
import { transform } from './transformer';
import { load } from './loader';
import { Yaml } from 'kodyfire-core';
const fs = require('fs');
export class Parser {
    constructor(validator) {
        this.validate = (data) => {
            return this.validator.validate(data);
        };
        this.extractor = () => {
            // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
            return extract();
        };
        this.transformer = () => {
            // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
            return transform();
        };
        this.loader = () => {
            return load();
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
            return Yaml.resolve(filepath);
        }
        throw new Error('Unsupported file extension');
    }
    write(filepath, data) {
        fs.writeFileSync(filepath, JSON.stringify(data, null, '\t'));
    }
}
//# sourceMappingURL=parser.js.map