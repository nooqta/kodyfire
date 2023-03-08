export declare const questions: ({
    type: string;
    name: string;
    message: string;
    choices?: undefined;
    initial?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    choices: {
        title: string;
        value: string;
    }[];
    initial?: undefined;
} | {
    type: string;
    name: string;
    message: string;
    initial: string;
    choices?: undefined;
})[];
type Project = {
    name: string;
    family: string;
    language?: string;
    description: string;
    command: string;
    args: string[];
    requires: string[];
};
export declare class Action {
    static prompter(): Promise<void | any>;
    static runCommand(project: Project, name?: any, path?: string): Promise<void>;
    static displayMessage(message: string): void;
    static execute(): Promise<void>;
    static addConcept(dependency: string, concept: string, data: any, rootDir?: string): Promise<void>;
    static addConceptProperty(dependency: string, concept: string, property: string, data: any, rootDir?: string): Promise<void>;
    static getSchemaDefinition(dependency: string, rootDir: string): any;
    static conceptToQuestion(name: string, concept: {
        type?: string;
        enum?: any;
    }, concepts?: any, message?: boolean | string, useIndex?: boolean): Promise<any | void>;
}
export {};
//# sourceMappingURL=action.d.ts.map