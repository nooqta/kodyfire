/**
 * The IKody interface
 * @alpha
 */
import EventEmitter from 'events';
import { IGenerator, ITechnology, Package } from '..';
import { IParser } from '../parser';

export interface IKody {
  params: { name: string; version: string; id: string };
  parser: IParser;
  generator: IGenerator;
  technology: ITechnology;
  package?: Package;
  events: EventEmitter;
  data: any;
  errors: any;
  parse(content: any): any;
  read(source: string): any;
  write(source: string, content: any): any;
  generate(content: any): any;
  whereami(): string;
  whoami(): String;
}
export abstract class BaseKody implements IKody {
  technology: ITechnology;
  params: { name: string; version: string; id: string };
  parser: IParser;
  generator: IGenerator;
  package?: Package | undefined;
  events: EventEmitter;
  get data() {
    throw new Error('Method not implemented.');
  }
  get errors() {
    throw new Error('Method not implemented.');
  }
  parse(_content: any) {
    throw new Error('Method not implemented.');
  }
  read(_source: string) {
    throw new Error('Method not implemented.');
  }
  write(_source: string, _content: any) {
    throw new Error('Method not implemented.');
  }
  generate(_content: any) {
    throw new Error('Method not implemented.');
  }
  whereami(): string {
    throw new Error('Method not implemented.');
  }
  whoami(): string {
    throw new Error('Method not implemented.');
  }
}
