import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';

export class Dependency extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine(_data: any) {
    this.engine = new Engine();

    this.engine.builder.registerHelper('commands', () => {
      return this.getCommands(_data);
    });
  }

  generate(_data: any) {
    this.initEngine(_data);
    const template = this.engine.read(this.template.path, _data.template);
    const compiled = this.engine.compile(template, this.model);

    this.engine.createOrOverwrite(
      this.technology.rootDir,
      '',
      this.getFileName(),
      compiled
    );
  }

  getFileName() {
    return 'bash.sh';
  }

  getCommands(dependency: any): string {
    dependency.commands.unshift(`composer require ${dependency.install}`);
    return dependency.commands.map((cmd: string) => cmd).join('\n');
  }
}
