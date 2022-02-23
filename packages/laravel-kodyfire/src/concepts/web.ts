import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Web extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();
  }

  generate(_data: any) {
    this.initEngine();
    const template = this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, {});
    this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(),
      compiled
    );
  }

  getFilename() {
    return `web.php`;
  }
}
