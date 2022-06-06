import * as vscode from 'vscode';
import { Action, questions } from 'kodyfire-cli/commands/install/action';

export class InstallAction extends Action {
  static terminal: vscode.Terminal;
  static output: vscode.OutputChannel;
  static displayMessage(message: string) {
    vscode.window.showInformationMessage(message);
  }
  static async isWorkspaceFolderOpen() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return false;
    }
    return true;
  }
  static async doesPackageJsonExist() {
    const packageJson = await vscode.workspace.findFiles('package.json');
    return packageJson.length > 0;
  }
  static async runCommand(
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
    name: any = null
  ) {
    if (name) {
      project.args = [...project.args, name];
    }

    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal('Extension: kody');
    }

    this.terminal.show();
    const cmd = `${project.command} ${project.args.join(' ')}`;
    this.terminal.sendText(
      `${project.command} ${project.args.join(' ').toString()}`
    );
  }
  static async prompter(questionsList = questions) {
    let answers: any = {};
    for (let i = 0; i < questionsList.length; i++) {
      const question = questionsList[i];
      if (question.type === 'select' && question.choices) {
        let option: vscode.QuickPickOptions = {
          placeHolder: question.message,
        };
        let choices: vscode.QuickPickItem[] = question.choices?.map(choice => {
          return {
            label: choice.value.toString(),
            description: choice.title,
            target: choice.value,
          };
        });
        const answer: any = await this.showQuickPick(choices, option);
        if (answer) {
          answers[question.name] = answer?.target;
        }
      } else if (question.type === 'array') {
        answers[question.name] = [];
      } else {
        const answer = await this.showInputBox(question);
        if (answer) {
          answers[question.name] = answer;
        }
      }
    }
    return answers;
  }
  static async showQuickPick(
    items: vscode.QuickPickItem[],
    option: vscode.QuickPickOptions
  ) {
    const result = await vscode.window.showQuickPick(items, option);
    return result;
  }
  static async showQuickPickAsString(items: string[], option: any) {
    const result = await vscode.window.showQuickPick(items, option);
    return result;
  }
  static async showInputBox(options: any) {
    const result = await vscode.window.showInputBox({
      prompt: options.message,
      validateInput: text => {
        return null;
        // return text !== '' ? null : 'Please enter a value';
        //return !(/^[A-Za-z\s]+$/.test(text)) ? 'Name not valid' : null;
      },
    });
    return result;
  }
}
