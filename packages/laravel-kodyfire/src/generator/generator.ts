import { normalize, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { Tree, HostTree } from '@angular-devkit/schematics';
import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  tree: Tree;
  constructor(params: any) {
    this.technology = new Technology(params);
    const _backend = new virtualFs.ScopedHost(
      new NodeJsSyncHost(),
      normalize(process.cwd())
    );
    this.tree = new HostTree(_backend);
  }
  generate(content: any): Tree {
    this.input = content;
    this.technology.input = content;
    // for every concept in concepts list
    for (let [key] of this.technology.concepts) {
      for (let data of content[key]) {
        // do apropriate action
        this.tree = this.technology.concepts.get(key)?.generate(data);
      }
    }
    // return result
    return this.tree;
  }
}
