import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  output: any;
  constructor(params: any, technology: ITechnology = new Technology(params)) {
    this.technology = technology;
  }
  generate(content: any) {
    // for every concept in concepts list
    for (const [key] of this.technology.concepts) {
      for (const data of content[key]) {
        // do apropriate action
        this.output = this.technology.concepts.get(key)?.generate(data);
      }
    }
    // return result
    return this.output;
  }
}
