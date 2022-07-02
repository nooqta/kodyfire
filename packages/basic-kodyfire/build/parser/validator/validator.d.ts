import { IValidator } from 'kodyfire-core';
import Ajv, { ErrorObject } from 'ajv';
export declare class Validator implements IValidator {
    rules: any;
    schemaValidator: Ajv;
    errors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined;
    constructor(_schema?: {
        type: string;
        properties: {
            project: {
                type: string;
            };
            name: {
                type: string;
            };
            rootDir: {
                type: string;
            };
            concept: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        anis: {
                            type: string;
                        };
                        name: {
                            type: string;
                        };
                        template: {
                            type: string;
                            enum: string[];
                        };
                        outputDir: {
                            type: string;
                        };
                    };
                };
            };
        };
        required: string[];
    });
    validate(data: any): boolean;
}
