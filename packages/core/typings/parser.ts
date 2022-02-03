import { IValidator } from "./validator";
/**
 * The IParser interface
 * @alpha
 */
export interface IParser {
    data: any;
    requiresExtract: boolean;
    requiresTansform: boolean;
    requiresLoad: boolean;
    validator: IValidator;
    reader(filename: string): any;
    parse(data:any): any;
}