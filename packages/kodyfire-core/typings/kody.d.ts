/// <reference types="node" />
/**
 * The IKody interface
 * @alpha
 */
import EventEmitter from "events";
import { IGenerator, Package } from "..";
import { IParser } from "../parser";
export interface IKody {
    params: {
        name: string;
        version: string;
        id: string;
    };
    parser: IParser;
    generator: IGenerator;
    package?: Package;
    events: EventEmitter;
    get data(): any;
    get errors(): any;
    parse(content: any): any;
    read(source: string): any;
    generate(content: any): any;
    whereami(): string;
    whoami(): string;
}
export declare abstract class BaseKody implements IKody {
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
    generate(_content: any): void;
    whereami(): string;
    whoami(): string;
}
//# sourceMappingURL=kody.d.ts.map