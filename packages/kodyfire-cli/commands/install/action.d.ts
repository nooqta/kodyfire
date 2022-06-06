export declare const questions: (
  | {
      type: string;
      name: string;
      message: string;
      choices?: undefined;
    }
  | {
      type: string;
      name: string;
      message: string;
      choices: {
        title: string;
        value: string;
      }[];
    }
)[];
export declare class Action {
  static prompter(): Promise<void | any>;
  static runCommand(
    project:
      | {
          name: string;
          family: string;
          language: string;
          description: string;
          command: string;
          args: string[];
          requires: string[];
        }
      | {
          name?: string;
          family?: string;
          description?: string;
          command: string;
          args: string[];
          requires?: string[];
          language?: undefined;
        },
    name?: any
  ): Promise<void>;
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
