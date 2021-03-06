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
      let args = '';
      let count = 3;
      if (_data.data && _data.data.args && _data.data.args.length > 0) {
        count = _data.data.count || 3;
        args = `[`;
        args += _data.data.args
          .map((d: any) => `'${d.key}' => '${d.value}'`)
          .join(', ');
        args += `]`;
        return `${strings.classify(
          _data.model
        )}::factory()->count(${count})->create(${args});`;
      }
      return `${strings.classify(
        _data.model
      )}::factory()->count(${count})->create();`;
    });

    this.engine.builder.registerHelper('class', () => {
      return `${pluralize(strings.classify(_data.model))}TableSeeder`;
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
  async generate(_data: any) {
    if (!_data.model) {
      this.model = _data.data;
    } else if (_data.data) {
      this.setModel(_data);
      this.model = { ...this.model, ..._data.data };
    } else {
      this.setModel(_data);
    }
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      _data.filename || this.getFilename(_data.model),
      compiled
    );
  }

  getFilename(name: string) {
    return `${pluralize(strings.classify(name))}TableSeeder.php`;
  }
}
