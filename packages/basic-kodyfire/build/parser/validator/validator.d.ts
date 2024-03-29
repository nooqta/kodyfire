import { IValidator } from 'kodyfire-core';
import Ajv, { ErrorObject } from 'ajv';
export declare class Validator implements IValidator {
    rules: any;
    schemaValidator: Ajv;
    errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    constructor(_schema?: any);
    validate(data: any): boolean;
}
