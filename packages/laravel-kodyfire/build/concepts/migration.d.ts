import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Migration extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    setModel(_data: any): void;
    generate(_data: any): Promise<void>;
    private appendData;
    getForeignKeysAttributes(columns: any): any;
    wait(ms: number): void;
    getFilename(model: any): Promise<any>;
    getMigrationName(model: any): any;
    getClassName(model: any): string;
    underscorize(word: any): any;
    getMigrationAttributes(model: any): Promise<string>;
    getFields(model: any): Promise<any>;
    getCommonOptions(field: any): string;
    getCascade(element: any): string;
}
