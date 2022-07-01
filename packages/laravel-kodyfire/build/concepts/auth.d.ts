import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Auth extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    getProjectConfigs(): string;
}
