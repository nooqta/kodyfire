export declare class Action {
  static displayMessage(message: string): void;
  static execute(_args?: any): Promise<void>;
  static getPackageDependencies(rootDir?: string): Promise<any>;
  static getDependencyConcepts(dependency: string): Promise<
    | {
        name: string;
        concepts: any;
      }
    | undefined
  >;
  static getConceptAttributes(schema: any): Promise<any>;
  static addConcept(
    dependency: string,
    concept: string,
    data: any,
    rootDir?: string
  ): Promise<void>;
}
//# sourceMappingURL=action.d.ts.map
