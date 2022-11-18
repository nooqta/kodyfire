import { IGenerator, ITechnology } from 'kodyfire-core';
import { Technology } from '../technology';

export class Generator implements IGenerator {
  technology: ITechnology;
  input: any;
  output: any;
  constructor(params: any, technology: ITechnology = new Technology(params)) {
    this.technology = technology;
  }
  async generate(content: any) {
    this.input = content;
    this.technology.input = content;
    this.technology.rootDir = content.rootDir || this.technology.rootDir;

    // for every concept in concepts list
    for (const [key] of this.technology.concepts) {
      // eslint-disable-next-line no-prototype-builtins
      if (content.hasOwnProperty(key)) {
        for (const data of content[key]) {
          console.log('content[key]', content[key]);
          // do apropriate action
          this.output = await this.technology.concepts.get(key)?.generate(data);
        }
      } else {
        // do apropriate action
      }
    }
    // return result
    return this.output;
  }
}
