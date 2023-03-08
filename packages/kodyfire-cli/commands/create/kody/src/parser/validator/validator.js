"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const schema_1 = require("./schema");
const ajv_1 = __importDefault(require("ajv"));
class Validator {
    constructor() {
        this.rules = schema_1.schema;
        this.schemaValidator = new ajv_1.default();
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
            console.log(validate.errors);
            return false;
        }
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map