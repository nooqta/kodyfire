import { Technology as BaseTechnology } from 'basic-kodyfire';
import * as classes from '.';
import * as assets from './assets.json';
import { capitalize } from 'kodyfire-core';
export class Technology extends BaseTechnology {
  constructor(params: any, _assets = assets) {
    try {
      super(params, _assets);
      this.assets = _assets;
      this.updateTemplatesPath(params);
      this.initConcepts();
    } catch (error) {
      console.log(error);
    }
  }

  public initConcepts() {
    // add dynamic property for technology
    for (const concept of this.assets.concepts) {
      this.concepts.set(
        concept.name,
        new (<any>classes)[capitalize(concept.name)](concept, this)
      );
    }
  }
}
