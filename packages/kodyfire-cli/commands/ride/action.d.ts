export declare class Action {
  static kody: any;
  static concept: any;
  static property: any;
  static getPackageDependencies(rootDir?: string): Promise<any>;
  static prompter(): Promise<void | any>;
  static getKodyQuestion(): Promise<
    | false
    | {
        type: string;
        name: string;
        message: string;
        choices: any;
      }
  >;
  static displayMessage(message: string): void;
  static execute(): Promise<void>;
  static addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir?: string
  ): Promise<void>;
  static addConceptProperty(
    dependency: string,
    concept: string,
    property: string,
    data: any,
    rootDir?: string
  ): Promise<void>;
  static getSchemaDefinition(dependency: string, rootDir: string): any;
  static conceptToQuestion(
    name: string,
    concept: {
      type?: string;
      enum?: any;
    },
    concepts?: any,
    message?: boolean | string,
    useIndex?: boolean
  ): Promise<any | void>;
}
//# sourceMappingURL=action.d.ts.map
