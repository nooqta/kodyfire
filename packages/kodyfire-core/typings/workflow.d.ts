export interface IKodyWorkflow {
    input: any;
    getKody(name: string): any;
    handleKodyNotFound(name: string): any;
    handleSourceNotValid(name: string): any;
    handleKodySuccess(name: string): any;
}
export declare class KodyWorkflow implements IKodyWorkflow {
    input: any;
    getKody: (_name: string) => Promise<any>;
    handleKodyNotFound: (name: string) => any;
    handleSourceNotValid: (errors: any) => any;
    handleKodySuccess: (name: string) => any;
}
//# sourceMappingURL=workflow.d.ts.map