import * as vscode from 'vscode';
import { Action } from 'kodyfire-cli/commands/init/action';

export class InitAction extends Action {
  displayMessage(message: string): void {
    vscode.window.showInformationMessage(message);
  }
}
