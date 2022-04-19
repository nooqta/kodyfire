import { IValidator } from 'kodyfire-core';
import { schema } from './schema';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

export class Validator implements IValidator {
  rules: any;
  schemaValidator: Ajv;
  errors:
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined;
  constructor() {
    this.rules = schema;
    this.schemaValidator = new Ajv();
  }
  validate(data: any): boolean {
    const schema: JSONSchemaType<typeof data> = this.rules;

    // validate is a type guard for data - type is inferred from schema type
    const validate = this.schemaValidator.compile(schema);

    if (validate(data)) {
      // data is MyData here
      return true;
    } else {
      this.errors = validate.errors;
      return false;
    }
  }
}
