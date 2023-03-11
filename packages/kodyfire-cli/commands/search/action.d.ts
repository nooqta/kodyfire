export declare class Action {
    static displayMessage(message: string): void;
    static displaySearchResults(kodies: any[]): void;
    static execute(_args: any): Promise<void>;
    static getKodies(keywords: string[]): Promise<any>;
}
export declare const action: (_args: any) => Promise<void>;
//# sourceMappingURL=action.d.ts.map