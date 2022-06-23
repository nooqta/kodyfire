import { IKody, IKodyWorkflow } from '..';
export declare class Runner implements IKodyWorkflow {
  options: any;
  input: any;
  constructor(options: any);
  run(_options: any): Promise<any>;
  postExecute(kody: IKody): Promise<void>;
  getSchemaDefinition(dependency: string, rootDir?: string): any;
  preExecute(dependency: string, kody: IKody, data: any[]): Promise<any[]>;
  handleKodyNotFound(name: any): void;
  getKody(name: any): Promise<any>;
  handleSourceNotValid(errors: any): void;
  handleKodySuccess(): void;
  handleKodyError(message: any): void;
}
//# sourceMappingURL=runner.d.ts.map
