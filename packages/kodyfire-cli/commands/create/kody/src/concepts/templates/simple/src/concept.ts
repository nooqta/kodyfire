import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';
import { strings } from '@angular-devkit/core';
const pluralize = require('pluralize');

import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';
export class Concept extends BaseConcept {
  extension = '.kody'; // replace with your extension
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    this.engine = new Engine();

    // Register functions you want to use in your templates with the engine builder registerHelper method.
    this.engine.builder.registerHelper('uppercase', (value: any) => {
      return value.toUpperCase();
    });
    this.engine.builder.registerHelper('pluralize', (value: any) => {
      return pluralize(value);
    });
    this.engine.builder.registerHelper('lowercase', (value: any) => {
      return value?.toLowerCase();
    });

    for (const key in strings) {
      this.engine.builder.registerHelper(key, (value: any) => {
        /* @ts-ignore */
        return strings[key](value);
      });
    }
  }

  async generate(_data: any) {
    // We resolve the template name here
    _data.template = this.resolveTemplateName(_data.template, this.name);
    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );

    const compiled = this.engine.compile(template, _data);

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }

  // resolve template name if it does not have template extension
  resolveTemplateName(templateName: string, name: string) {
    if (templateName.includes('.template')) return templateName;
    // The format of a template : {conceptName}.{templateName}.{extension}.template
    // example : concept.api.php.template
    return `${name.toLowerCase()}.${templateName}${this.extension}.template`;
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${data.name}.${data.extension || this.getExtension(data.template)}`
    );
  }

  getExtension(templateName: string) {
    return templateName.replace('.template', '').split('.').pop();
  }

  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
}
