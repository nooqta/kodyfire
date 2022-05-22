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
