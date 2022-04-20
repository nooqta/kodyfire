import { classify } from '@angular-devkit/core/src/utils/strings';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { Engine } from './engine';

const pluralize = require('pluralize');

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
    console.log(_data.model);
    _data.relationships = this.model.relationships;
    _data.controller = this.model.controller;
    _data.fields = this.model.fields;
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

  getValidation(
    model: any,
    prefix: any = '',
    relatedModel: any = null
  ): string {
    let validation = '';
    model.fields.forEach((f: any) => {
      if (
        !relatedModel ||
        (relatedModel != null && f.name != relatedModel.toLowerCase() + '_id')
      ) {
        if (f.options.filter((e: any) => e.key == 'default').length == 0) {
          if (f.options.filter((e: any) => e.key == 'nullable').length == 0) {
            if (f.options.filter((e: any) => e.key == 'unique').length > 0) {
              validation += `'${prefix}${f.name}' => '${this.isEmail(
                f.name
              )}required|unique:${this.underscorize(
                pluralize(model.name)
              )},${prefix}${f.name}',\n`;
            } else {
              validation += `'${prefix}${f.name}' => '${this.isEmail(
                f.name
              )}required',\n`;
            }
          }
        }
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
    model: any,
    relationships: any,
    _prefix: any = ''
  ): string {
    let validation = '';
    validation = this.getValidation(model);
    //Relations validation
    if (
      model.controller &&
      model.controller != '' &&
      model.controller.with_additional_relations &&
      model.controller.with_additional_relations != '' &&
      model.controller.with_additional_relations.length > 0
    ) {
      model.controller.with_additional_relations.forEach((element: any) => {
        validation += this.getRelationValidation(
          element,
          relationships,
          model.name
        );
      });
    }
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
            content += this.getValidation(model, prefix, relatedModel);
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
