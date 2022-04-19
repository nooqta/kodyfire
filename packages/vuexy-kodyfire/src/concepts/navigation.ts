// @ts-nocheck
import { Tree } from '@angular-devkit/schematics';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { join } from 'path';

/* @ts-ignore */
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';

export class Navigation extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.initEngine();
    const template = await this.engine.read(
      this.template.path,
      join(_data.layout, _data.template)
    );
    const compiled = await this.engine.compile(template, this.name);
    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(this.name, _data.layout),
      compiled
    );
  }

  getFilename(name: string, layout: string) {
    return join(layout, `${strings.classify(name)}.vue`);
  }
}
