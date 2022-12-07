export declare class Action {
  static displayMessage(message: string): void;
  static displayKodies(kodies: any[]): void;
  static execute(args: { technology: any }): Promise<void>;
  static getInstalledKodies(): Promise<string[]>;
  static displayConcepts(
    concepts: Promise<
      | {
          name: string;
          concepts: any;
        }
      | undefined
    >
  ): void;
  static getDependencyConcepts(
    dependency: string,
    rootDir?: string
  ): Promise<
    | {
        name: string;
        concepts: any;
      }
    | undefined
  >;
  static getConceptAttributes(schema: any): Promise<any>;
}
export declare const action: (args: any) => Promise<void>;
//# sourceMappingURL=action.d.ts.map
