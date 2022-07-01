import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Test extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    setModel(_data: any): void;
    initEngine(_data: any): void;
    generate(_data: any): Promise<void>;
    getFileName(name: string): string;
    getTests(): string;
    generateFaker(el: any, faker?: any): string | 1;
    getTestData(model: any): string;
    getDetailedTests(model: any): string;
    getResourceTests(model: any): string;
}
