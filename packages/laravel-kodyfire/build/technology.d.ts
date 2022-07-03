import { ActionList, IConcept, ITechnology } from 'kodyfire-core';
export declare class Technology implements ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    concepts: Map<string, IConcept>;
    assets: any;
    actions: ActionList;
    input?: any;
    params: any;
    constructor(params: any, _assets?: {
        name: string;
        version: string;
        rootDir: string;
        concepts: ({
            name: string;
            defaultAction: string;
            source: string;
            outputDir: string;
            template: {
                path: string;
                options: never[];
                placeholders: never[];
            };
        } | {
            name: string;
            defaultAction: string;
            source: string;
            outputDir: string;
            template: {
                path: string;
                options: string[];
                placeholders?: undefined;
            };
        } | {
            name: string;
            defaultAction: string;
            source: string;
            outputDir: null;
            template: {
                path: string;
                options: never[];
                placeholders?: undefined;
            };
        })[];
    });
    prepareConcept(dependency: string, conceptName: string, preparedConcept: any): Promise<any>;
}
