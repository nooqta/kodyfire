import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

const pluralize = require('pluralize');

export class DatabaseSeed extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('data', () => {
      return this.getSeedsList(
        this.technology.input.model,
        this.technology.input.roles && this.technology.input.roles.length > 0
      );
    });
  }
  setModel(_data: any) {
    this.model = this.technology.input.model.find(
      (m: any) => m.name == _data.model
    );
  }
  async generate(_data: any) {
    this.setModel(_data);
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(),
      compiled
    );
  }

  getFilename() {
    return `DatabaseSeeder.php`;
  }

  getSeedsList(models: any[], has_roles: boolean) {
    let seeds = has_roles ? `// $this->call(RolesTableSeeder::class);\n` : '';
    if (typeof models.find((el: any) => el.name === 'Country') != 'undefined') {
      seeds += `$this->call(CountriesTableSeeder::class);\n`;
    }
    models.forEach((el: any) => {
      if (el.name.toLowerCase() != 'country' && !!el.isMorph === false) {
        seeds += `$this->call(${pluralize(el.name)}TableSeeder::class);\n`;
      }
    });
    return seeds;
  }
}
