/// <reference types="node" />
import EventEmitter from 'events';
import {
  BaseKody,
  IGenerator,
  IKody,
  IParser,
  ITechnology,
  Package,
} from 'kodyfire-core';
export declare class Kody extends BaseKody implements IKody {
  [x: string]: any;
  parser: IParser;
  generator: IGenerator;
  technology: ITechnology;
  package: Package;
  events: EventEmitter;
  constructor(params: any);
  generate(_content: any): void;
  parse(content: any): any;
  read(source: any): any;
  get errors(): any;
  get data(): any;
  whereami(): string;
  whoami(): string;
}
//# sourceMappingURL=kody.d.ts.map
