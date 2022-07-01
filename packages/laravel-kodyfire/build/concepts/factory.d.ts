import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Factory extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(_data: any): void;
    getImports(): string;
    setModel(_data: any): void;
    generate(_data: any): Promise<void>;
    getFilename(name: string): string;
    getData(model: any): string;
    generateFaker(el: any, faker?: any): string;
}
