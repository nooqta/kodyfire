import { ActionList } from "./actionList";
import { IConcept } from "./concept";

export interface ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    input?: any;
    concepts: Map<string,IConcept>;
    assets: any;
    actions: ActionList;
    params: any;
}

export class Technology implements ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    input?: any;
    concepts: Map<string,IConcept>;
    assets: any;
    actions: ActionList;
    params: any;
    constructor() {
        this.actions = new ActionList();
        this.concepts = new Map();
    }

}