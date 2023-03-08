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
        concepts: {
            name: string;
            template: {
                path: string;
            };
        }[];
    });
    prepareConcept(dependency: string, conceptName: string, preparedConcept: any): Promise<any>;
}
//# sourceMappingURL=technology.d.ts.map