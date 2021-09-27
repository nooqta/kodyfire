import { ActionList } from "./actionList";
import { IConcept } from "./concept";

export interface ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    concepts: Map<string,IConcept>;
    assets: any;
    actions: ActionList;
}

export class Technology implements ITechnology {
    id: string;
    name: string;
    version: string;
    rootDir: string;
    concepts: Map<string,IConcept>;
    assets: any;
    actions: ActionList;
    constructor() {
        this.actions = new ActionList();
        this.concepts = new Map();
    }

}