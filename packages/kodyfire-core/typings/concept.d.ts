import { Technology } from '..';
export declare enum Source {
    Template = 0
}
export interface TemplateSchema {
    path: string;
    options: string[];
}
export interface IConcept {
    name: string;
    templatesPath?: string;
    defaultAction: string;
    source?: Source;
    template: TemplateSchema;
    outputDir?: string;
    technology: Technology;
    generate(data: any): any;
}
//# sourceMappingURL=concept.d.ts.map