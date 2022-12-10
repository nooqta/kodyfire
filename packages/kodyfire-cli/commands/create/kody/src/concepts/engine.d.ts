/// <reference types="node" />
export declare class Engine {
  builder: any;
  constructor();
  registerPartials(): void;
  read(path: string, templateName: any): Promise<any>;
  compile(template: any, data: any): any;
  create(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer
  ): Promise<void>;
  overwrite(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer
  ): Promise<void>;
  createOrOverwrite(
    rootDir: string,
    outputDir: string,
    filename: any,
    content: string | Buffer
  ): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map
