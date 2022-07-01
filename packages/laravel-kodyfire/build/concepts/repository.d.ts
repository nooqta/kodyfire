import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Repository extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    setModel(_data: any): void;
    generate(_data: any): Promise<void>;
    getMethods(model: any, data: any): Promise<string>;
    getFilename(name: any): string;
    hasUplodableMorph(model: any): any;
    getAdditionalMethods(model: any): string;
    getMethod(relation: any): string;
    getMorphAttachments(model: any): string;
    getAttachments(model: any): string;
    getUpdateAttachments(model: any): string;
    uploadAttachment(model: any): string;
}
