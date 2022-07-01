import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept } from './concept';
export declare class Api extends Concept {
    model: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    getFilename(): string;
    getGroupsList(models: any[]): string;
    getRoutesList(group: any, models: any[]): any;
    getRouteUrl(routeType: any, modelName: any): string;
    getRouteType(routeType: any): string;
    getNameSpaces(controllers: any[]): string;
}
