import { IConcept, ITechnology, Source, Technology, TemplateSchema } from 'kodyfire-core';
import { Engine } from './engine';
export declare class Model implements IConcept {
    name: string;
    defaultAction: string;
    source?: Source | undefined;
    template: TemplateSchema;
    outputDir: string;
    technology: Technology;
    engine: Engine;
    templatesPath?: string | undefined;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    getTemplatesPath(): string;
    generate(_data: any): Promise<void>;
    getFilename(name: any): string;
    getModelRelations(model: any): string;
    getFillable(model: any): string;
    getRelationArgs(rel: any): string;
    getHiddenArray(data: any): string;
}
