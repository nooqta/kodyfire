import EventEmitter from 'events';
import {
  BaseKody,
  IGenerator,
  IKody,
  IParser,
  ITechnology,
} from 'kodyfire-core';
import { Generator, Parser, Validator, Technology, schema } from '.';

export class Kody extends BaseKody implements IKody {
  [x: string]: any;
  parser: IParser;
  generator: IGenerator;
  technology: ITechnology;
  events: EventEmitter;
  constructor(
    params: any,
    _schema = schema,
    technology = new Technology(params)
  ) {
    super();
    this.params = params;
    this.technology = technology;
    this.generator = new Generator(params, technology);
    const validator = new Validator();
    this.parser = new Parser(validator);
    this.events = new EventEmitter();
  }
  generate(_content: any) {
    this.generator.generate(_content);
  }
  parse(content: any) {
    return this.parser.parse(content);
  }

  read(source: any) {
    return this.parser.reader(source);
  }

  write(source: string, content: any) {
    return this.parser.write(source, content);
  }

  get errors() {
    return this.parser.validator.errors;
  }
  get data() {
    return this.parser.data;
  }
  whereami(): string {
    return __dirname;
  }
  whoami(): string {
    return __filename;
  }
}
