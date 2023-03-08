import { IValidator } from 'kodyfire-core';
import Ajv, { ErrorObject } from 'ajv';
export declare class Validator implements IValidator {
    rules: any;
    schemaValidator: Ajv;
    errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    constructor();
    validate(data: any): boolean;
}
//# sourceMappingURL=validator.d.ts.map