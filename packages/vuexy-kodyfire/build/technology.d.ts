import { ActionList, IConcept, Technology as BaseTechnology } from 'kodyfire-core';
export declare class Technology implements BaseTechnology {
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
            outputDir: string;
            template: {
                path: string;
                options: string[];
            };
        } | {
            name: string;
            outputDir: string;
            template: {
                path: string;
                options?: undefined;
            };
        })[];
    });
    prepareConcept(dependency: string, conceptName: string, preparedConcept: any): Promise<any>;
}
