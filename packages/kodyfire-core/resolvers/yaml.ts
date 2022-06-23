const yaml = require('js-yaml');
const fs = require('fs');

export class Yaml {
  public static resolve(source: string): any {
    const data = fs.readFileSync(source, 'utf8');
    return yaml.load(data.toString());
  }
}
