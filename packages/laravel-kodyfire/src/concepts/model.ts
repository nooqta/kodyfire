import { classify } from '@angular-devkit/core/src/utils/strings';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { join, relative } from 'path';
import { Engine } from './engine';

export class Model implements IConcept {
  name: string;
  defaultAction: string;
  source?: Source | undefined;
  template: TemplateSchema;
  outputDir: string;
  technology: Technology;
  engine: Engine;
  templatesPath?: string | undefined;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? '';
    this.name = concept.name ?? '';
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
  }
  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
  async generate(_data: any) {
    this.engine = new Engine();
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    _data.hidden = this.getHiddenArray(_data);
    _data.fillable = this.getFillable(_data);
    _data.relations = this.getModelRelations(_data);
    const compiled = this.engine.compile(template, _data);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data.name),
      compiled
    );
  }

  getFilename(name: any) {
    return `${classify(name)}.php`;
  }

  getModelRelations(model: any): string {
    let relations = '';
    if (!model.relationships) {
      return relations;
    }
    model.relationships.forEach((rel: any) => {
      if (rel.type === 'morphTo') {
        relations += `public function ${rel.name}()
        {
            return $this->${rel.type}();
        }\n`;
      } else {
        relations += `
    public function ${rel.name}()
    {
        return $this->${rel.type}(${this.getRelationArgs(rel)});
    }\n`;
      }
    });
    return relations;
  }

  getFillable(model: any): string {
    return model.fillable
      ? model.fillable.map((field: string) => `'${field}'`).join(', ')
      : '';
  }

  getRelationArgs(rel: any): string {
    let args = '';
    if (
      rel.model != '' &&
      rel.arguments != '' &&
      rel.arguments &&
      rel.arguments.length > 0
    ) {
      args = `${rel.model}::class, '${rel.arguments}'`;
    } else if (rel.model != '') {
      args = `${rel.model}::class`;
    }
    return args;
  }

  getHiddenArray(data: any): string {
    return data.hidden || [];
  }
}
