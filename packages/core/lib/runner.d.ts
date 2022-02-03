import { IKodyWorkflow } from "..";
export declare class Runner implements IKodyWorkflow {
    options: any;
    input: any;
    constructor(options: any);
    run(_options: any): Promise<any>;
    handleKodyNotFound(name: any): void;
    getKody(name: any): Promise<any>;
    handleSourceNotValid(errors: any): void;
    handleKodySuccess(): void;
}
//# sourceMappingURL=runner.d.ts.map