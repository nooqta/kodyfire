import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class CustomConcept extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  setModel(_data: any) {
    if (_data.model) {
      this.model = this.technology.input.model.find(
        (m: any) => m.name.toLowerCase() == _data.model.toLowerCase()
      );
      const controller = this.technology.input.controller.find(
        (c: any) => c.model == _data.model
      );
      this.model.controller = controller;
    }
  }

  initEngine(_data: any) {
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.setModel(_data);
    this.initEngine(_data);
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, _data);

    this.engine.createOrOverwrite(
      this.technology.rootDir,
      _data.outputDir,
      this.getFileName(_data.name),
      compiled
    );
  }

  getFileName(name: string) {
    return `${name}.php`;
  }
}
