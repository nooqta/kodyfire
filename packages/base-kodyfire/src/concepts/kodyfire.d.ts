import { IConcept, ITechnology, Source, TemplateSchema } from 'kodyfire-core';
export declare class Kodyfire implements IConcept {
  source?: Source;
  name: string;
  content: string;
  outputDir: string;
  template: TemplateSchema;
  defaultAction: string;
  technology: ITechnology;
  constructor(concept: Partial<IConcept>, technology: ITechnology);
  generate(_data: any): import('@angular-devkit/schematics').Rule;
}
//# sourceMappingURL=kodyfire.d.ts.map
