// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { KodiesProvider } from './kodies';
import { ListAction } from './commands/ListAction';
import { SearchAction } from './commands/SearchAction';
import { InstallAction } from './commands/InstallAction';
import { InitAction } from './commands/InitAction';
import { promises as fs } from 'fs';
import { Package } from 'kodyfire-core';
import { ConceptsProvider } from './concepts';

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
        const createPackageJsonFile = await InstallAction.showQuickPickAsString(
          ['Yes', 'No'],
          option
        );

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
    let concepts = await getConcepts();

    // const resolvedConcepts = await Promise.all(concepts);
    const inspectorProvider = new ConceptsProvider(concepts);
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
  let conceptDisposable = vscode.commands.registerCommand(
    'kodyfire.addConcept',
    async args => {
      try {
        const [dependency, concept] = args.command.arguments;
        const concepts = await getConcepts();
        const dependencyConcepts = concepts.find(
          d =>
            d.name === dependency &&
            Object.keys(d.concepts?.concepts).find(c => c === concept)
        );
        if (!dependencyConcepts) {
          vscode.window.showErrorMessage(
            `${dependency} does not have concept ${concept}`
          );
          return;
        }

        const dependencyConcept =
          dependencyConcepts.concepts?.concepts[concept];
        let questions = [];
        const conceptNames = Object.keys(dependencyConcept);
        const projectRoot =
          vscode.workspace.workspaceFolders?.[0].uri.fsPath || '/';
        const schemaDefiniton = InstallAction.getSchemaDefinition(
          dependency,
          projectRoot
        );
        for (let i = 0; i < conceptNames.length; i++) {
          const question = await InstallAction.conceptToQuestion(
            conceptNames[i],
            dependencyConcept[conceptNames[i]],
            schemaDefiniton
          );
          if (question) {
            questions.push(question);
          }
        }
        const answers = await InstallAction.prompter(questions);
        InstallAction.addConcept(dependency, concept, answers, projectRoot);
      } catch (error: any) {
        InstallAction.output.show();
        InstallAction.output.append(JSON.stringify(error));
      }
    }
  );
  let conceptPropDisposable = vscode.commands.registerCommand(
    'kodyfire.addConceptProperty',
    async args => {
      try {
        const [dependency, concept, property] = args.command.arguments;
        const concepts = await getConcepts();
        const dependencyConcepts = concepts.find(
          d =>
            d.name === dependency &&
            Object.keys(d.concepts?.concepts).find(c => c === concept)
        );
        if (!dependencyConcepts) {
          vscode.window.showErrorMessage(
            `${dependency} does not have concept ${concept}`
          );
          return;
        }

        const dependencyConcept =
          dependencyConcepts.concepts?.concepts[concept];
        const conceptProperty = dependencyConcept[property];
        let questions = [];
        const conceptNames =
          conceptProperty.items.type === 'string'
            ? [property]
            : Object.keys(conceptProperty.items.properties);
        const projectRoot =
          vscode.workspace.workspaceFolders?.[0].uri.fsPath || '/';
        const schemaDefiniton = InstallAction.getSchemaDefinition(
          dependency,
          projectRoot
        );
        // We prompt to choose the concept
        let question = await InstallAction.conceptToQuestion(
          concept,
          conceptProperty,
          schemaDefiniton,
          'Choose the index of the concept?',
          true
        );
        if (question) {
          question.name = 'concept';
          questions.push(question);
        }
        for (let i = 0; i < conceptNames.length; i++) {
          const question = await InstallAction.conceptToQuestion(
            conceptNames[i],
            dependencyConcept[property].items.properties
              ? dependencyConcept[property].items.properties[conceptNames[i]]
              : dependencyConcept[property].items,
            schemaDefiniton
          );
          if (question) {
            questions.push(question);
          }
        }
        const answers = await InstallAction.prompter(questions);
        InstallAction.addConceptProperty(
          dependency,
          concept,
          property,
          answers,
          projectRoot
        );
      } catch (error: any) {
        InstallAction.output.show();
        InstallAction.output.append(JSON.stringify(error));
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
            [
              { label: 'Yes', description: 'Yes' },
              { label: 'No', description: 'No' },
            ],
            option
          );

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

async function getConcepts() {
  const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '/';
  const installedKodies = await Package.getInstalledKodiesFromPath(projectRoot);
  let concepts = [];
  for (let i = 0; i < installedKodies.length; i++) {
    const concept = await InitAction.getDependencyConcepts(
      installedKodies[i].name
    );
    concepts.push({ name: installedKodies[i].name, concepts: concept });
  }
  return concepts;
}

// this method is called when your extension is deactivated
export function deactivate() {}
