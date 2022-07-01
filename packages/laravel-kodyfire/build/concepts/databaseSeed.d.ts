import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class DatabaseSeed extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(_data: any): void;
    setModel(_data: any): void;
    generate(_data: any): Promise<void>;
    getFilename(): string;
    getSeedsList(models: any[], has_roles: boolean): string;
}
