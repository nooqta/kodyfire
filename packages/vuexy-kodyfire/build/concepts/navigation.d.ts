import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Navigation extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    getFilename(name: string, layout: string): string;
}
