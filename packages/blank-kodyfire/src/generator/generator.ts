import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  constructor(params: any) {
    this.technology = new Technology(params);
  }
  async generate(content: any) {
    // for every concept in concepts list
    for (const [key] of this.technology.concepts) {
      // do apropriate action
      await this.technology.concepts.get(key)?.generate(content);
    }
    // return result?
  }
}
