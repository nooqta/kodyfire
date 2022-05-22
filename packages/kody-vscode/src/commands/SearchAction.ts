import * as vscode from 'vscode';
import { Action as BaseSearchAction } from 'kodyfire-cli/commands/search/action';

export class SearchAction extends BaseSearchAction {
  static displayMessage(message: string): void {
    vscode.window.showInformationMessage(message);
  }
}
