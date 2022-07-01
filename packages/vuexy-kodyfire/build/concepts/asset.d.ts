import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Asset extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    getFilename(path: string, filename: string): string;
}
