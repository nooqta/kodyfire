import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Module extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    readFolder(folder: string): any[];
    getFilename(path: any, name: string, moduleName: string): string;
}
