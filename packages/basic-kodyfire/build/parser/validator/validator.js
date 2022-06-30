import { schema } from './schema';
import Ajv from 'ajv';
export class Validator {
    constructor() {
        this.rules = schema;
        this.schemaValidator = new Ajv();
    }
    validate(data) {
        const schema = this.rules;
        // validate is a type guard for data - type is inferred from schema type
        const validate = this.schemaValidator.compile(schema);
        if (validate(data)) {
            // data is MyData here
            return true;
        }
        else {
            this.errors = validate.errors;
            return false;
        }
    }
}
//# sourceMappingURL=validator.js.map