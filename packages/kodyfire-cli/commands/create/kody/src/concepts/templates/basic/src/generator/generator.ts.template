import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { Tree, HostTree } from '@angular-devkit/schematics';
import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  tree: Tree;
  constructor(params: any, technology: ITechnology = new Technology(params)) {
    this.technology = technology;
    const _backend = new virtualFs.ScopedHost(
      new NodeJsSyncHost(),
      normalize(process.cwd())
    );
    this.tree = new HostTree(_backend);
  }
  async generate(content: any): Promise<Tree> {
    this.input = content;
    this.technology.input = content;
    this.technology.rootDir = content.rootDir || this.technology.rootDir;
    // for every concept in concepts list
    for (const [key] of this.technology.concepts) {
      for (const data of content[key]) {
        // do apropriate action
        this.tree = await this.technology.concepts.get(key)?.generate(data);
      }
    }
    // return result
    return this.tree;
  }
}
