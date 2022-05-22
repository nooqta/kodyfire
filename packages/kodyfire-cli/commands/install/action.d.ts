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
  static prompter(): Promise<void>;
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
}
//# sourceMappingURL=action.d.ts.map