// @ts-nocheck
import { Tree } from '@angular-devkit/schematics';
import {
  IConcept,
  ITechnology,
  Source,
  Technology,
  TemplateSchema,
} from 'kodyfire-core';
import { join, relative } from 'path';
const { promises: fs } = require('fs');

/* @ts-ignore */
import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';

export class Scaffold extends Concept {
  model: any;
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
  }

  initEngine() {
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.initEngine();
    const filePath = join(
      relative(process.cwd(), __dirname),
      this.template.path,
      _data.templateFolder
    );
    const folderContent = await this.readFolder(filePath);
    for (const file of folderContent) {
      const stat = await fs.lstat(join(filePath, file));
      if (stat.isFile()) {
        console.log(`copying file: ${_data.templateFolder}/${file}`);
        const template = await this.engine.read(
          this.template.path,
          join(_data.templateFolder, file)
        );

        const compiled = await this.engine.compile(template, _data);
        await this.engine.createOrOverwrite(
          this.technology.rootDir,
          _data.outputDir,
          this.getFilename(_data.templateFolder, file),
          compiled
        );
      } else if (stat.isDirectory()) {
        console.log(`creating folder: ${_data.templateFolder}/${file}`);
        await this.generate({
          ..._data,
          templateFolder: join(_data.templateFolder, file),
        });
      }
    }
  }

  async readFolder(folder: string): Promise<any[]> {
    // Read directory
    let names;
    try {
      names = await fs.readdir(folder);
    } catch (e) {
      console.log('e', e);
    }
    return names;
  }

  getFilename(path: string, name: string) {
    return join(path, `${name.replace('.template', '')}`);
  }
}
