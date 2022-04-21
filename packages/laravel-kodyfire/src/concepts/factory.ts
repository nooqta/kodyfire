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

    this.engine.builder.registerHelper('factory', () => {
      return _data.model;
    });

    this.engine.builder.registerHelper('imports', () => {
      return this.getImports();
    });

    this.engine.builder.registerHelper('model', () => {
      return _data.model;
    });

    this.engine.builder.registerHelper('factoryNamespace', () => {
      return _data.namespace;
    });
  }
  getImports() {
    let data = '';
    data += `use Faker\\Generator as Faker;\n`;
    data += `use App\\Models\\${this.model.name};\n`;
    this.model.relationships.forEach((el: any) => {
      if (el.type == 'belongsTo') {
        data += `use App\\Models\\${el.model};\n`;
      }
    });
    return data;
  }
  setModel(_data: any) {
    // @todo find a better way to get the model
    this.model = this.technology.input.model.find(
      (m: any) => m.name == _data.model
    );
  }
  async generate(_data: any) {
    this.setModel(_data);
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    this.model.definition = this.getData(this.model);
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

    // @todo add relations
    model.foreign_keys.forEach((el: any) => {
      el.name = el.column;
      data += `'${el.column}' => ${this.generateFaker(el)},\n`;
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
        el.faker_type == 'file' ||
        el.faker_type == 'image' ||
        el.faker_type == 'video'
      ) {
        return `${faker}->url()`;
      }
      if (el.faker_type != 'password') {
        if (el.options.includes('unique')) {
          return `${faker}->unique()->${el.faker_type}`;
        } else {
          return `${faker}->${el.faker_type}`;
        }
      } else {
        return `bcrypt('password')`;
      }
    } else {
      return `${el.model}::factory()`;
    }
  }
}
