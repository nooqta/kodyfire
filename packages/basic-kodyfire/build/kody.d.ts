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
    constructor(params: any, _schema?: {
        type: string;
        properties: {
            project: {
                type: string;
            };
            name: {
                type: string;
            };
            rootDir: {
                type: string;
            };
            concept: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        template: {
                            type: string;
                            enum: string[];
                        };
                        outputDir: {
                            type: string;
                        };
                    };
                };
            };
        };
        required: string[];
    }, technology?: Technology);
    generate(_content: any): void;
    parse(content: any): any;
    read(source: any): any;
    get errors(): any;
    get data(): any;
    whereami(): string;
    whoami(): string;
}
