const { load } = require('js-yaml');
const { readFileSync } = require('fs');

export class Yaml {
  public static resolve(source: string): any {
    const data = readFileSync(source, 'utf8');
    return load(data.toString());
  }
}
