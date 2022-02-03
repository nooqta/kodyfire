import { ActionList } from "./actionList";
import { IConcept } from "./concept";
export interface ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    input?: any;
    concepts: Map<string, IConcept>;
    assets: any;
    actions: ActionList;
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
    constructor();
}
//# sourceMappingURL=technology.d.ts.map