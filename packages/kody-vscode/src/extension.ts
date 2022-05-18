// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Action } from 'kodyfire-cli/commands/list/action';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export class ListAction extends Action {
  static displayMessage(message: string) {
    vscode.window.showInformationMessage(message);
  }

  static displayKodies(kodies: any[]) {
    console.log(kodies);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "kodyfire" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('kodyfire.list', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    // const output = vscode.window.createOutputChannel('kodyfire');
    // output.show();
    // output.append('Hello World!');
    try {
      ListAction.execute();
    } catch (error: any) {
      const output = vscode.window.createOutputChannel('kodyfire');
      output.show();
      output.append(error);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
