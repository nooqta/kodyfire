export declare class Action {
    static kody: any;
    static concept: any;
    static properties: any;
    static isCanceled: boolean;
    static onCancel(_prompt: any): Promise<boolean>;
    static getDependencyConcepts(dependency: string): Promise<any>;
    static getPackageDependencies(rootDir?: string): Promise<any>;
    static prompter(_args: {
        addMore?: any;
        persist?: any;
        kody?: any;
        concept?: any;
    }): Promise<void | any>;
    private static setConcept;
    static getCurrentConcept(): Promise<any>;
    static getPropertiesAnswers(concept: any): Promise<any>;
    static getConceptQuestion(): Promise<false | {
        type: string;
        name: string;
        message: string;
        choices: {
            title: string;
            value: string;
        }[];
    }>;
    static getKodyQuestion(): Promise<false | {
        type: string;
        name: string;
        message: string;
        choices: any;
    }>;
    static displayMessage(message: string): void;
    static execute(args: any): Promise<void>;
    static getConceptAttributes(schema: any): Promise<any>;
    static addConcept(dependency: string, concept: string, data: any, rootDir?: string): Promise<void>;
    static generateConcept(dependency: string, concept: string, data: any, rootDir?: string): Promise<void>;
    static addConceptProperty(dependency: string, concept: string, property: string, data: any, rootDir?: string): Promise<void>;
    static getSchemaDefinition(dependency: string, rootDir?: string): any;
    static conceptToQuestion(name: string, concept: {
        description: string;
        default?: any;
        type?: string;
        enum?: any;
        items?: any;
    }, _concepts?: any, message?: boolean | string, _useIndex?: boolean, label?: string, useValueAsName?: boolean): Promise<any | void>;
}
//# sourceMappingURL=action.d.ts.map