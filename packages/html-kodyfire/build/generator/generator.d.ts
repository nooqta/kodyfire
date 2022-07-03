import { IGenerator, ITechnology } from 'kodyfire-core';
export declare class Generator implements IGenerator {
    technology: ITechnology;
    input: any;
    output: any;
    constructor(params: any, technology?: ITechnology);
    generate(content: any): any;
}
