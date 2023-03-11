export declare class Action {
    static prompter(kody: string): Promise<void | any>;
    static runCommand(kody: string, path?: string): Promise<void>;
    static displayMessage(message: string): void;
    static execute(kody: string): Promise<void>;
    static addConcept(dependency: string, concept: string, data: any, rootDir?: string): Promise<void>;
    static addConceptProperty(dependency: string, concept: string, property: string, data: any, rootDir?: string): Promise<void>;
    static getSchemaDefinition(dependency: string, rootDir: string): any;
    static conceptToQuestion(name: string, concept: {
        type?: string;
        enum?: any;
    }, concepts?: any, message?: boolean | string, useIndex?: boolean): Promise<any | void>;
}
//# sourceMappingURL=action.d.ts.map