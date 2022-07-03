import { IConcept, Source, ITechnology, TemplateSchema } from 'kodyfire-core';
export declare class Page implements IConcept {
    source?: Source;
    name: string;
    content: string;
    outputDir: string;
    template: TemplateSchema;
    defaultAction: string;
    technology: ITechnology;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(data: any): Promise<any>;
    getFilename(name: any): string;
    getTemplatesPath(): string;
}
