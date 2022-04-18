import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { Engine } from './engine';

export class Databag implements IConcept {
  name: string;
  defaultAction: string;
  source?: Source | undefined;
  template: TemplateSchema;
  outputDir: string;
  technology: Technology;
  engine: Engine;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? '';
    this.name = concept.name ?? '';
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }
  async generate(_data: any) {
    this.engine = new Engine();
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, _data);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      'DataBag.php',
      compiled
    );
  }
}
