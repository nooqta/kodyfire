import EventEmitter from 'events';
import {
  BaseKody,
  IGenerator,
  IKody,
  IParser,
  ITechnology,
  Package,
} from 'kodyfire-core';
import { Generator, Parser, Validator, schema, Technology } from '.';

export class Kody extends BaseKody implements IKody {
  [x: string]: any;
  parser: IParser;
  generator: IGenerator;
  technology: ITechnology;
  package: Package;
  events: EventEmitter;
  constructor(
    params: any,
    _schema = schema,
    technology = new Technology(params)
  ) {
    super();
    const validator = new Validator(_schema);
    this.technology = technology;
    this.params = params;
    this.parser = new Parser(validator);
    this.generator = new Generator(params);
    this.events = new EventEmitter();
  }
  generate(_content: any) {
    this.events.emit('generate', _content);
    this.generator.generate(_content);
  }
  parse(content: any) {
    this.events.emit('parse', content);
    return this.parser.parse(content);
  }
  read(source: any) {
    this.events.emit('read', source);
    return this.parser.reader(source);
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
