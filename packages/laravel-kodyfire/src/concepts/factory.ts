import { strings } from '@angular-devkit/core';
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Factory extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('data', () => {
      return this.getData(this.model);
    });

    this.engine.builder.registerHelper('factory', () => {
      return _data.model;
    });

    this.engine.builder.registerHelper('model', () => {
      return _data.model;
    });

    this.engine.builder.registerHelper('factoryNamespace', () => {
      return _data.namespace;
    });
  }
  setModel(_data: any) {
    // @todo find a better way to get the model
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
    return `${strings.classify(name)}Factory.php`;
  }

  getData(model: any) {
    let data = '';
    model.fields.forEach((el: any) => {
      data += `'${el.name}' => ${this.generateFaker(el)},\n`;
    });

    if (model.isMorph) {
      data += `'${model.name.toLowerCase()}able_id' => 1,
            '${model.name.toLowerCase()}able_type' => 'App\\Models\\${
        model.name
      }',\n`;
    }

    return data;
  }

  generateFaker(el: any, faker: any = '$this->faker') {
    if (!el.name.includes('_id')) {
      if (el.type == 'enum') {
        return `'${el.arguments[0]}'`;
      }
      if (
        el.extra_type == 'file' ||
        el.extra_type == 'image' ||
        el.extra_type == 'video'
      ) {
        return `${faker}->url()`;
      }
      if (el.extra_type != 'password') {
        if (el.options.includes('unique')) {
          return `${faker}->unique()->${el.extra_type}`;
        } else {
          return `${faker}->${el.extra_type}`;
        }
      } else {
        return `bcrypt('password')`;
      }
    } else {
      return 1;
    }
  }
}
