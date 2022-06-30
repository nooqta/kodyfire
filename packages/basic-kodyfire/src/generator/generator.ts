import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  output: any;
  constructor(params: any) {
    this.technology = new Technology(params);
  }
  async generate(content: any) {
    this.input = content;
    this.technology.input = content;
    this.technology.rootDir = content.rootDir || this.technology.rootDir;

    // for every concept in concepts list
    for (const [key] of this.technology.concepts) {
      for (const data of content[key]) {
        // do apropriate action
        this.output = await this.technology.concepts.get(key)?.generate(data);
      }
    }
    // return result
    return this.output;
  }
}
