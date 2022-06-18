import * as vscode from 'vscode';
import { Action } from 'kodyfire-cli/commands/install/action';
export declare class InstallAction extends Action {
  static terminal: vscode.Terminal;
  static output: vscode.OutputChannel;
  static displayMessage(message: string): void;
  static isWorkspaceFolderOpen(): Promise<boolean>;
  static doesPackageJsonExist(): Promise<boolean>;
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
  static prompter(
    questionsList?: (
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
    )[]
  ): Promise<any>;
  static showQuickPick(
    items: vscode.QuickPickItem[],
    option: vscode.QuickPickOptions
  ): Promise<vscode.QuickPickItem | undefined>;
  static showQuickPickAsString(
    items: string[],
    option: any
  ): Promise<string[] | undefined>;
  static showInputBox(options: any): Promise<string | undefined>;
}
//# sourceMappingURL=InstallAction.d.ts.map
