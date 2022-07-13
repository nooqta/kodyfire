/// <reference types="node" />
export interface IBuilder {
    compile(template: string): any;
}
export interface IEngine {
    builder: IBuilder;
}
export declare class Engine {
    builder: any;
    constructor();
    registerPartials(): void;
    read(path: string, templateName: any): Promise<any>;
    getPartial(path: string, template: string, data: any): Promise<any>;
    compile(template: any, data: any): any;
    create(rootDir: string, outputDir: string, filename: any, content: string | Buffer): Promise<void>;
    overwrite(rootDir: string, outputDir: string, filename: any, content: string | Buffer): Promise<void>;
    createOrOverwrite(rootDir: string, outputDir: string, filename: any, content: string | Buffer, overwrite?: boolean): Promise<void>;
    setContent(filename: any, content: string | Buffer): string | Buffer;
    getFiles(rootDir: string, outputDir: string): Promise<any>;
}
