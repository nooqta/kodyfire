import { Tree } from '@angular-devkit/schematics';
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
  generate(data: any, tree: Tree): Promise<Tree> | Tree;
  getFilename(name: any): string;
}
//# sourceMappingURL=page.d.ts.map
