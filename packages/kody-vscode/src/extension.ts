// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { KodiesProvider } from './kodies';
import { ListAction } from './commands/ListAction';
import { SearchAction } from './commands/SearchAction';
import { InstallAction } from './commands/InstallAction';
import { Action } from 'kodyfire-cli/commands/init/action';
import { promises as fs } from 'fs';
import { Package } from 'kodyfire-core';

export class InitAction extends Action {
  displayMessage(message: string): void {
    vscode.window.showInformationMessage(message);
  }
}
const cloneCommand = vscode.commands.registerCommand(
  'kodyfire.install',
  async (moduleName: any) => {
    try {
      // Is workspace folder open?
      if (!(await InstallAction.isWorkspaceFolderOpen())) {
        InstallAction.displayMessage('Please open a workspace folder');
        return;
      }
      // Does package.json exist?
      if (!(await InstallAction.doesPackageJsonExist())) {
        let option: vscode.QuickPickOptions = {
          title: 'Create package.json?',
        };
        const createPackageJsonFile = await InstallAction.showQuickPick(
          ['Yes', 'No'],
          option
        );
        vscode.window.createOutputChannel;
        if (createPackageJsonFile) {
          await InstallAction.runCommand({
            command: 'npm',
            args: ['init'],
          });
        } else {
          InstallAction.displayMessage(
            'A package.json file is required to install a module'
          );
          return;
        }
      }
      const cmd = await InstallAction.runCommand({
        command: 'npm',
        args: ['install', moduleName.label],
      });
    } catch (error: any) {
      vscode.window.showErrorMessage(error);
    }
  }
);
export async function activate(context: vscode.ExtensionContext) {
  try {
    InstallAction.output = vscode.window.createOutputChannel('kodyfire');
    const kodies = await SearchAction.getKodies();
    const kodiesProvider = new KodiesProvider(kodies);
    vscode.window.registerTreeDataProvider('kodyfire-view', kodiesProvider);
    const projectRoot =
      vscode.workspace.workspaceFolders?.[0].uri.fsPath || '/';
    const installedKodies = await Package.getInstalledKodiesFromPath(
      projectRoot
    );
    const inspectorProvider = new KodiesProvider(installedKodies);
    vscode.window.registerTreeDataProvider(
      'kodyfire-inspector',
      inspectorProvider
    );
  } catch (error: any) {
    InstallAction.output.show();
    InstallAction.output.append(error);
  }
  let disposableInstall = cloneCommand;
  let disposableBoilerPlate = vscode.commands.registerCommand(
    'kodyfire.clone',
    async () => {
      try {
        // Is workspace folder open?
        if (!(await InstallAction.isWorkspaceFolderOpen())) {
          InstallAction.displayMessage('Please open a workspace folder');
          return;
        }
        const repoUrl = await InstallAction.showInputBox({
          message: 'Enter the repo URL',
          validateInput: (text: string) => {
            if (text.length === 0) {
              return 'Please enter a valid URL';
            }
            return null;
          },
        });
        if (!repoUrl) {
          vscode.window.showErrorMessage('Please enter a valid URL');
          return;
        }
        InstallAction.displayMessage(repoUrl);
        const repoName =
          (await InstallAction.showInputBox({
            message: 'Enter the repo name',
            validateInput: (text: string) => {
              return !/^[A-Za-z\s]+$/.test(text)
                ? 'Project name not valid'
                : null;
            },
          })) || '.';
        const cmd = await InstallAction.runCommand({
          command: 'git',
          args: ['clone', repoUrl, repoName],
        });
      } catch (error: any) {
        vscode.window.showErrorMessage(error);
      }
    }
  );
  let disposable = vscode.commands.registerCommand(
    'kodyfire.list',
    async () => {
      try {
        ListAction.execute();
      } catch (error: any) {
        InstallAction.output.show();
        InstallAction.output.append(error);
      }
    }
  );
  let initDisposable = vscode.commands.registerCommand(
    'kodyfire.init',
    async () => {
      try {
        vscode.window.showInformationMessage('Hello World from kodyfire!');
        if (!InstallAction.isWorkspaceFolderOpen()) {
          InitAction.displayMessage('Please open a workspace folder');
          return;
        }

        if (!(await InstallAction.doesPackageJsonExist())) {
          let option: vscode.QuickPickOptions = {
            title: 'Package.json required. Create package.json?',
          };
          const createPackageJsonFile = await InstallAction.showQuickPick(
            ['Yes', 'No'],
            option
          );
          vscode.window.createOutputChannel;
          if (createPackageJsonFile) {
            await InstallAction.runCommand({
              command: 'npm',
              args: ['init'],
            });
          } else {
            InstallAction.displayMessage(
              'A package.json file is required before initializing a kodyfire project'
            );
            return;
          }
        }
        const projectRoot =
          vscode.workspace.workspaceFolders?.[0].uri.fsPath || '/';
        await InitAction.execute({ rootDir: projectRoot });
        InitAction.displayMessage('Project initialized successfully');
      } catch (error: any) {
        vscode.window.showErrorMessage(error.message);
        InstallAction.output.show();
        InstallAction.output.append(error.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
