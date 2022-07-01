import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Dependency extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(_data: any): void;
    generate(_data: any): Promise<void>;
    getFileName(): string;
    getCommands(dependency: any): string;
}
