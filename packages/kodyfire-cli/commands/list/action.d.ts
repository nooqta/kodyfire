export declare class Action {
    static displayMessage(message: string): void;
    static displayKodies(kodies: any[]): void;
    static execute(args: {
        technology: any;
        summary: any;
    }): Promise<void>;
    static getInstalledKodies(): Promise<string[]>;
    static displayTemplates(packageName: string): Promise<void>;
    static displayOverwrites(packageName: string): Promise<void>;
    static displayConcepts(packageName: string): Promise<void>;
    static getDependencyConcepts(dependency: string, rootDir?: string): Promise<{
        name: string;
        concepts: any;
    } | undefined>;
    static getDependencyTemplates(dependency: string, rootDir?: string): Promise<any>;
    static getConceptAttributes(schema: any): Promise<any>;
}
export declare const action: (args: any) => Promise<void>;
//# sourceMappingURL=action.d.ts.map