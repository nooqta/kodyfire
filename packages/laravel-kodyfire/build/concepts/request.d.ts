import { IConcept, ITechnology, Source, Technology, TemplateSchema } from 'kodyfire-core';
import { Engine } from './engine';
export declare class Request implements IConcept {
    model: any;
    name: string;
    defaultAction: string;
    source?: Source | undefined;
    template: TemplateSchema;
    outputDir: string;
    technology: Technology;
    engine: Engine;
    models: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    setModel(_data: any): void;
    generate(_data: any): Promise<void>;
    getFilename(name: any): string;
    getValidation(prefix?: any, _relatedModel?: any): string;
    underscorize(word: any): any;
    getRequestValidation(_model: any, _relationships: any, _prefix?: any): string;
    getRelationValidation(): string;
    isEmail(name: any): string;
}
