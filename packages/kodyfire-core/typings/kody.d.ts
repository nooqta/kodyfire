/// <reference types="node" />
/**
 * The IKody interface
 * @alpha
 */
import EventEmitter from 'events';
import { IGenerator, ITechnology, Package } from '..';
import { IParser } from '../parser';
export interface IKody {
  params: {
    name: string;
    version: string;
    id: string;
  };
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
export declare abstract class BaseKody implements IKody {
  technology: ITechnology;
  params: {
    name: string;
    version: string;
    id: string;
  };
  parser: IParser;
  generator: IGenerator;
  package?: Package | undefined;
  events: EventEmitter;
  get data(): void;
  get errors(): void;
  parse(_content: any): void;
  read(_source: string): void;
  write(_source: string, _content: any): void;
  generate(_content: any): void;
  whereami(): string;
  whoami(): string;
}
//# sourceMappingURL=kody.d.ts.map
