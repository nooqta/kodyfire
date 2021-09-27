import { Action, Tree } from "@angular-devkit/schematics";
import { Service, Technology } from "..";
import { ActionList } from "./actionList";
export enum Source {
    Template
}
export interface TemplateSchema {
    path: string;
    options: string[];
}
export interface IConcept extends Service<IConcept> {
    name: string;
    defaultAction: string;
    action: Partial<Action>;
    source?: Source;
    template: TemplateSchema;
    outputDir?: string;
    actions: ActionList;
    technology: Technology;
    generate(data: any, tree: Tree): any;
}
