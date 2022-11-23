import { join, relative } from 'path';
const { promises: fs } = require('fs');

import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
import { Engine } from './engine';
import { strings } from '@angular-devkit/core';

export class Module extends Concept {
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
        const template = await this.engine.read(
          this.template.path,
          join(_data.templateFolder, file)
        );

        const compiled = await this.engine.compile(template, _data);
        await this.engine.createOrOverwrite(
          this.technology.rootDir,
          this.outputDir,
          this.getFilename({
            path: _data.templateFolder,
            name: file,
            moduleName: _data.name,
          }),
          compiled
        );
      } else if (stat.isDirectory()) {
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

  getFilename(data: {
    path: string;
    name: string;
    moduleName: string;
  }): string {
    const { path, name, moduleName } = data;
    return join(
      path.replaceAll('module', moduleName),
      `${name
        .replace('Module', strings.classify(moduleName))
        .replace('module', moduleName)
        .replace('.template', '')}`
    );
  }
}
