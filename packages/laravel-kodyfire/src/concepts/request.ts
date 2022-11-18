import { classify } from '@angular-devkit/core/src/utils/strings';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { join, relative } from 'path';
// import pluralize from 'pluralize';
import { Engine } from './engine';

export class Request implements IConcept {
  model: any;
  name: string;
  defaultAction: string;
  source?: Source | undefined;
  template: TemplateSchema;
  outputDir: string;
  technology: Technology;
  engine: Engine;
  models: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    this.source = concept.source ?? Source.Template;
    this.outputDir = concept.outputDir ?? '';
    this.name = concept.name ?? '';
    this.template = concept.template as TemplateSchema;
    this.technology = technology;
    this.models = technology.input;
  }
  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name.toLowerCase() == _data.model.toLowerCase()
    );
  }
  async generate(_data: any) {
    this.setModel(_data);
    this.engine = new Engine();
    _data.relationships = this.model.relationships;
    _data.controller = this.model.controller;
    _data.fields = this.model.fields.filter(
      (f: any) => typeof f.rules != 'undefined'
    );
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    this.engine.builder.registerHelper('getRequestValidation', () => {
      return this.getRequestValidation(
        _data,
        _data.relationships,
        _data.prefix === 'Create' ? 'store' : 'update'
      );
    });
    _data.rules = this.getRequestValidation(
      _data,
      _data.relationships,
      _data.prefix === 'Create' ? 'store' : 'update'
    );
    _data.relationRules = this.getRelationValidation();

    const compiled = this.engine.compile(template, _data);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data.prefix + _data.model),
      compiled
    );
  }

  getFilename(name: any) {
    return `${classify(name)}Request.php`;
  }

  getValidation(prefix: any = '', _relatedModel: any = null): string {
    let validation = '';
    this.model.fields.forEach((f: any) => {
      if (f.rules) {
        validation += `'${prefix}${this.underscorize(f.name)}' => '${
          f.rules
        }',\n`;
      }
    });
    return validation;
  }

  underscorize(word: any) {
    return word.replace(/[A-Z]/g, function (char: any, index: any) {
      return (index !== 0 ? '_' : '') + char.toLowerCase();
    });
  }

  getRequestValidation(
    _model: any,
    _relationships: any,
    _prefix: any = ''
  ): string {
    let validation = '';
    validation = this.getValidation();
    return validation;
  }

  getRelationValidation() {
    let content = '';
    this.model.foreign_keys.forEach((r: any) => {
      if (r.required) {
        content += `'${this.underscorize(r.column)}' => 'required|exists:${
          r.on
        },${r.references}',\n`;
      }
    });
    this.model.relationships.forEach((r: any) => {
      const relatedModel = this.technology.input.model.find(
        (m: any) => m.name.toLowerCase() == r.model.toLowerCase()
      );
      if (r.type == 'hasMany' && relatedModel) {
        content += `'${this.underscorize(r.name)}' => 'array',\n`;
        relatedModel.fields.forEach((f: any) => {
          if (f.rules) {
            content += `'${this.underscorize(r.name)}.*.${this.underscorize(
              f.name
            )}' => '${f.rules}',\n`;
          }
        });
      }
    });
    return content;
  }

  isEmail(name: any): string {
    if (name == 'email') {
      return 'email|';
    } else {
      return '';
    }
  }
}
