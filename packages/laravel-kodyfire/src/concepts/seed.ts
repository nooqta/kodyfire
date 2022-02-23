import { strings } from '@angular-devkit/core';
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

const pluralize = require('pluralize');

export class Seed extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('data', () => {
      return `${strings.classify(_data.model)}::factory()->count(3)->create();`;
    });

    this.engine.builder.registerHelper('class', () => {
      return `${strings.classify(_data.model)}`;
    });

    this.engine.builder.registerHelper('namespace', () => {
      return `App\\Models\\${strings.classify(_data.model)}`;
    });
  }
  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name == _data.model
    );
  }
  generate(_data: any) {
    this.setModel(_data);
    this.initEngine(_data);
    const template = this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data.model),
      compiled
    );
  }

  getFilename(name: string) {
    return `${pluralize(strings.classify(name))}TableSeeder.php`;
  }
}
