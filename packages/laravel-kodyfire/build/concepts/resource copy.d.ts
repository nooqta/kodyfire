import { IConcept, ITechnology, Source, Technology, TemplateSchema } from 'kodyfire-core';
import { Engine } from './engine';
export interface IBuilder {
    compile(template: string): any;
}
export interface IEngine {
    builder: IBuilder;
}
export declare class Resource implements IConcept {
    name: string;
    source?: Source | undefined;
    template: TemplateSchema;
    outputDir: string;
    technology: Technology;
    engine: Engine;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    templatesPath?: string | undefined;
    defaultAction: string;
    generate(_data: any): Promise<void>;
    getFilename(data: any): any;
    getExtension(templateName: string): string | undefined;
    underscorize(word: any): any;
    getTemplatesPath(): string;
}
