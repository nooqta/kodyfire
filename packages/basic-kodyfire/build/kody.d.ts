/// <reference types="node" />
import EventEmitter from 'events';
import { BaseKody, IGenerator, IKody, IParser, ITechnology, Package } from 'kodyfire-core';
import { Technology } from '.';
export declare class Kody extends BaseKody implements IKody {
    [x: string]: any;
    parser: IParser;
    generator: IGenerator;
    technology: ITechnology;
    package: Package;
    events: EventEmitter;
    constructor(params: any, _schema?: any, technology?: Technology);
    generate(_content: any): Promise<void>;
    parse(content: any): any;
    read(source: any): any;
    get errors(): any;
    get data(): any;
    whereami(): string;
    whoami(): string;
}
