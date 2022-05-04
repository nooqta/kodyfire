import { classify } from '@angular-devkit/core/src/utils/strings';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
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
    _data.fields = this.model.fields.filter((f: any) => f.required == true);
    const template = await this.engine.read(this.template.path, _data.template);
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
      console.log(f.validation);
      if (f.validation) {
        validation += `'${prefix}${this.underscorize(f.name)}' => '${
          f.validation
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

  getRelationValidation(relation: any, relationships: any, relatedModel: any) {
    let content = `'${this.underscorize(
      Object.values(relation)[0]
    )}' => 'required',\n`;
    let modelName = '';
    let model = null;
    relationships.forEach((r: any) => {
      if (
        r.name == Object.values(relation)[0] &&
        r.type == Object.keys(relation)[0]
      ) {
        modelName = r.model;
      }
    });
    if (modelName != '') {
      model = this.models.find((m: any) => m.name == modelName);
      if (typeof model != 'undefined') {
        const prefix = `${this.underscorize(Object.values(relation)[0])}.*.`;
        switch (Object.keys(relation)[0]) {
          case 'hasMany':
            content += this.getValidation(prefix, relatedModel);
            break;

          default:
            break;
        }
      }
    }
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
