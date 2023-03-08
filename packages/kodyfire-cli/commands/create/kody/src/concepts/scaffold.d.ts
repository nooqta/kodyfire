import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Scaffold extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    readFolder(folder: string): Promise<any[]>;
    getFilename(path: string, name: string): string;
}
//# sourceMappingURL=scaffold.d.ts.map