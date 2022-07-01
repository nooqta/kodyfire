import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Lang extends Concept {
    texts: any[];
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    setTexts(_data: any): void;
    initEngine(_data: any): void;
    generate(_data: any): Promise<void>;
    getFileName(name: string, lng: string): string;
    getTranslations(): string;
}
