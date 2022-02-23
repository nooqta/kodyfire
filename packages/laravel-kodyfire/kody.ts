import EventEmitter from 'events';
import {
  BaseKody,
  IGenerator,
  IKody,
  IParser,
  ITechnology,
} from 'kodyfire-core';
import { Generator, Parser, Validator } from '.';

export class Kody extends BaseKody implements IKody {
  [x: string]: any;
  parser: IParser;
  generator: IGenerator;
  technology: ITechnology;
  events: EventEmitter;
  constructor(params: any) {
    super();
    let validator = new Validator();
    this.params = params;
    this.parser = new Parser(validator);
    this.generator = new Generator(params);
    this.technology = this.generator.technology;
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
