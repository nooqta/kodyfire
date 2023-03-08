import { ActionList } from './actionList';
import { IConcept } from './concept';
export interface ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    input?: any;
    concepts: Map<string, IConcept>;
    assets: any;
    actions: ActionList;
    params: any;
    prepareConcept(dependency: string, conceptName: string, data: any): any;
}
export declare class Technology implements ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    input?: any;
    concepts: Map<string, IConcept>;
    assets: any;
    actions: ActionList;
    params: any;
    constructor();
    prepareConcept(dependency: string, conceptName: string, preparedConcept: any): Promise<any>;
}
//# sourceMappingURL=technology.d.ts.map