import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { IConcept, ITechnology, Source, TemplateSchema } from 'kodyfire-core';
import { join, relative } from 'path';

import { strings } from '@angular-devkit/core';

export class Kodyfire implements IConcept {
  source?: Source;
  name: string;
  content: string;
  outputDir: string;
  template: TemplateSchema;
  defaultAction: string;
  technology: ITechnology;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? '';
    this.name = concept.name ?? '';
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }
  generate(_data: any) {
    // clone == apply, create == create, overwrite == overwrite
    const templateSource = apply(
      url(
        join(
          process.cwd(),
          relative(process.cwd(), __dirname),
          this.template.path
        )
      ),
      [
        applyTemplates({
          ...strings,
          ..._data,
        }),
        move(join(this.technology.rootDir, this.outputDir)),
      ]
    );
    return chain([mergeWith(templateSource)]);
  }
}
