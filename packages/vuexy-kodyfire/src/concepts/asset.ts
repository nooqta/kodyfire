// @ts-nocheck
import { Tree } from '@angular-devkit/schematics';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';

/* @ts-ignore */
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';

export class Asset extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.initEngine();
    const template = await this.engine.read(this.template.path, _data.template);
    const compiled = await this.engine.compile(template, _data.data);
    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data.path, _data.filename),
      compiled
    );
  }

  getFilename(path: string, filename: string) {
    return `${path}/${filename}`;
  }
}
