import { extract } from './extractor';
import { transform } from './transformer';
import { load } from './loader';
import { IParser, IValidator, Yaml } from 'kodyfire-core';
const fs = require('fs');

export class Parser implements IParser {
  validator: IValidator;
  requiresExtract: boolean;
  requiresTansform: boolean;
  requiresLoad: boolean;
  data: any;
  constructor(validator: IValidator) {
    this.validator = validator;
    this.requiresExtract = false;
    this.requiresTansform = false;
    this.requiresLoad = false;
  }
  reader(source: string) {
    return this.readfile(source);
  }

  parse(data: any) {
    if (!this.validate(data)) {
      return false;
    }
    // @todo: use extractor and transformer maybe here
    this.data = data;
    return data;
  }

  validate = (data: any) => {
    return this.validator.validate(data);
  };
  extractor: any = () => {
    // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
    return extract();
  };

  transformer = () => {
    // @todo: v.x for source code, reverse engineer websites or other sources that requires an extractor
    return transform();
  };

  loader = () => {
    return load();
  };
  readfile(filepath: any) {
    const fileContent = fs.readFileSync(filepath);
    const extension = filepath.split('.').pop();
    if (extension === 'json') {
      return JSON.parse(fileContent);
    } else if (extension === 'yml') {
      return Yaml.resolve(filepath);
    }
    throw new Error('Unsupported file extension');
  }

  write(filepath: any, data: any) {
    fs.writeFileSync(filepath, JSON.stringify(data));
  }
}
