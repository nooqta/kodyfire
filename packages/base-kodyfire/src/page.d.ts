import { Action, Tree } from '@angular-devkit/schematics';
import {
  ActionList,
  IConcept,
  Source,
  ITechnology,
  TemplateSchema,
} from 'kodyfire-core';
export declare class Page implements IConcept {
  source?: Source;
  name: string;
  content: string;
  outputDir: string;
  actions: ActionList;
  action: Partial<Action>;
  template: TemplateSchema;
  defaultAction: string;
  technology: ITechnology;
  constructor(concept: Partial<IConcept>, technology: ITechnology);
  resolveAction(_action: string | undefined, _args: any): Partial<Action>;
  generate(data: any, tree: Tree): Promise<Tree> | Tree;
}
//# sourceMappingURL=page.d.ts.map
