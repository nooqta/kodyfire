import { Tree } from '@angular-devkit/schematics';
import { IGenerator, ITechnology } from 'kodyfire-core';
export declare class Generator implements IGenerator {
    technology: ITechnology;
    input: any;
    tree: Tree;
    constructor(params: any);
    generate(content: any): Promise<Tree>;
}
