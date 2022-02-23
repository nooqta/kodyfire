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
}
//# sourceMappingURL=technology.d.ts.map