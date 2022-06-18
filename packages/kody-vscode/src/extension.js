'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require('vscode'));
const kodies_1 = require('./kodies');
const ListAction_1 = require('./commands/ListAction');
const SearchAction_1 = require('./commands/SearchAction');
const InstallAction_1 = require('./commands/InstallAction');
const InitAction_1 = require('./commands/InitAction');
const kodyfire_core_1 = require('kodyfire-core');
const concepts_1 = require('./concepts');
const cloneCommand = vscode.commands.registerCommand(
  'kodyfire.install',
  moduleName =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        // Is workspace folder open?
        if (!(yield InstallAction_1.InstallAction.isWorkspaceFolderOpen())) {
          InstallAction_1.InstallAction.displayMessage(
            'Please open a workspace folder'
          );
          return;
        }
        // Does package.json exist?
        if (!(yield InstallAction_1.InstallAction.doesPackageJsonExist())) {
          let option = {
            title: 'Create package.json?',
          };
          const createPackageJsonFile =
            yield InstallAction_1.InstallAction.showQuickPickAsString(
              ['Yes', 'No'],
              option
            );
          if (createPackageJsonFile) {
            yield InstallAction_1.InstallAction.runCommand({
              command: 'npm',
              args: ['init'],
            });
          } else {
            InstallAction_1.InstallAction.displayMessage(
              'A package.json file is required to install a module'
            );
            return;
          }
        }
        yield InstallAction_1.InstallAction.runCommand({
          command: 'npm',
          args: ['install', moduleName.label],
        });
      } catch (error) {
        vscode.window.showErrorMessage(error);
      }
    })
);
function activate(context) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      InstallAction_1.InstallAction.output =
        vscode.window.createOutputChannel('kodyfire');
      const kodies = yield SearchAction_1.SearchAction.getKodies();
      const kodiesProvider = new kodies_1.KodiesProvider(kodies);
      vscode.window.registerTreeDataProvider('kodyfire-view', kodiesProvider);
      let concepts = yield getConcepts();
      // const resolvedConcepts = await Promise.all(concepts);
      const inspectorProvider = new concepts_1.ConceptsProvider(concepts);
      vscode.window.registerTreeDataProvider(
        'kodyfire-inspector',
        inspectorProvider
      );
    } catch (error) {
      InstallAction_1.InstallAction.output.show();
      InstallAction_1.InstallAction.output.append(error);
    }
    let disposableInstall = cloneCommand;
    context.subscriptions.push(disposableInstall);
    let disposableBoilerPlate = vscode.commands.registerCommand(
      'kodyfire.clone',
      () =>
        __awaiter(this, void 0, void 0, function* () {
          try {
            // Is workspace folder open?
            if (
              !(yield InstallAction_1.InstallAction.isWorkspaceFolderOpen())
            ) {
              InstallAction_1.InstallAction.displayMessage(
                'Please open a workspace folder'
              );
              return;
            }
            const repoUrl = yield InstallAction_1.InstallAction.showInputBox({
              message: 'Enter the repo URL',
              validateInput: text => {
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
            InstallAction_1.InstallAction.displayMessage(repoUrl);
            const repoName =
              (yield InstallAction_1.InstallAction.showInputBox({
                message: 'Enter the repo name',
                validateInput: text => {
                  return !/^[A-Za-z\s]+$/.test(text)
                    ? 'Project name not valid'
                    : null;
                },
              })) || '.';
            yield InstallAction_1.InstallAction.runCommand({
              command: 'git',
              args: ['clone', repoUrl, repoName],
            });
          } catch (error) {
            vscode.window.showErrorMessage(error);
          }
        })
    );
    context.subscriptions.push(disposableBoilerPlate);
    let disposable = vscode.commands.registerCommand('kodyfire.list', () =>
      __awaiter(this, void 0, void 0, function* () {
        try {
          ListAction_1.ListAction.execute();
        } catch (error) {
          InstallAction_1.InstallAction.output.show();
          InstallAction_1.InstallAction.output.append(error);
        }
      })
    );
    context.subscriptions.push(disposable);
    let conceptDisposable = vscode.commands.registerCommand(
      'kodyfire.addConcept',
      args =>
        __awaiter(this, void 0, void 0, function* () {
          var _a, _b;
          try {
            const [dependency, concept] = args.command.arguments;
            const concepts = yield getConcepts();
            const dependencyConcepts = concepts.find(d => {
              var _a;
              return (
                d.name === dependency &&
                Object.keys(
                  (_a = d.concepts) === null || _a === void 0
                    ? void 0
                    : _a.concepts
                ).find(c => c === concept)
              );
            });
            if (!dependencyConcepts) {
              vscode.window.showErrorMessage(
                `${dependency} does not have concept ${concept}`
              );
              return;
            }
            const dependencyConcept =
              (_a = dependencyConcepts.concepts) === null || _a === void 0
                ? void 0
                : _a.concepts[concept];
            let questions = [];
            const conceptNames = Object.keys(dependencyConcept);
            const projectRoot =
              ((_b = vscode.workspace.workspaceFolders) === null ||
              _b === void 0
                ? void 0
                : _b[0].uri.fsPath) || '/';
            const schemaDefiniton =
              InstallAction_1.InstallAction.getSchemaDefinition(
                dependency,
                projectRoot
              );
            for (let i = 0; i < conceptNames.length; i++) {
              const question =
                yield InstallAction_1.InstallAction.conceptToQuestion(
                  conceptNames[i],
                  dependencyConcept[conceptNames[i]],
                  schemaDefiniton
                );
              if (question) {
                questions.push(question);
              }
            }
            const answers = yield InstallAction_1.InstallAction.prompter(
              questions
            );
            InstallAction_1.InstallAction.addConcept(
              dependency,
              concept,
              answers,
              projectRoot
            );
          } catch (error) {
            InstallAction_1.InstallAction.output.show();
            InstallAction_1.InstallAction.output.append(JSON.stringify(error));
          }
        })
    );
    context.subscriptions.push(conceptDisposable);
    let conceptPropDisposable = vscode.commands.registerCommand(
      'kodyfire.addConceptProperty',
      args =>
        __awaiter(this, void 0, void 0, function* () {
          var _c, _d;
          try {
            const [dependency, concept, property] = args.command.arguments;
            const concepts = yield getConcepts();
            const dependencyConcepts = concepts.find(d => {
              var _a;
              return (
                d.name === dependency &&
                Object.keys(
                  (_a = d.concepts) === null || _a === void 0
                    ? void 0
                    : _a.concepts
                ).find(c => c === concept)
              );
            });
            if (!dependencyConcepts) {
              vscode.window.showErrorMessage(
                `${dependency} does not have concept ${concept}`
              );
              return;
            }
            const dependencyConcept =
              (_c = dependencyConcepts.concepts) === null || _c === void 0
                ? void 0
                : _c.concepts[concept];
            const conceptProperty = dependencyConcept[property];
            let questions = [];
            const conceptNames =
              conceptProperty.items.type === 'string'
                ? [property]
                : Object.keys(conceptProperty.items.properties);
            const projectRoot =
              ((_d = vscode.workspace.workspaceFolders) === null ||
              _d === void 0
                ? void 0
                : _d[0].uri.fsPath) || '/';
            const schemaDefiniton =
              InstallAction_1.InstallAction.getSchemaDefinition(
                dependency,
                projectRoot
              );
            // We prompt to choose the concept
            let question =
              yield InstallAction_1.InstallAction.conceptToQuestion(
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
              const question =
                yield InstallAction_1.InstallAction.conceptToQuestion(
                  conceptNames[i],
                  dependencyConcept[property].items.properties
                    ? dependencyConcept[property].items.properties[
                        conceptNames[i]
                      ]
                    : dependencyConcept[property].items,
                  schemaDefiniton
                );
              if (question) {
                questions.push(question);
              }
            }
            const answers = yield InstallAction_1.InstallAction.prompter(
              questions
            );
            InstallAction_1.InstallAction.addConceptProperty(
              dependency,
              concept,
              property,
              answers,
              projectRoot
            );
          } catch (error) {
            InstallAction_1.InstallAction.output.show();
            InstallAction_1.InstallAction.output.append(JSON.stringify(error));
          }
        })
    );
    context.subscriptions.push(conceptPropDisposable);
    let initDisposable = vscode.commands.registerCommand('kodyfire.init', () =>
      __awaiter(this, void 0, void 0, function* () {
        var _e;
        try {
          vscode.window.showInformationMessage('Hello World from kodyfire!');
          if (!InstallAction_1.InstallAction.isWorkspaceFolderOpen()) {
            InitAction_1.InitAction.displayMessage(
              'Please open a workspace folder'
            );
            return;
          }
          if (!(yield InstallAction_1.InstallAction.doesPackageJsonExist())) {
            let option = {
              title: 'Package.json required. Create package.json?',
            };
            const createPackageJsonFile =
              yield InstallAction_1.InstallAction.showQuickPick(
                [
                  { label: 'Yes', description: 'Yes' },
                  { label: 'No', description: 'No' },
                ],
                option
              );
            if (createPackageJsonFile) {
              yield InstallAction_1.InstallAction.runCommand({
                command: 'npm',
                args: ['init'],
              });
            } else {
              InstallAction_1.InstallAction.displayMessage(
                'A package.json file is required before initializing a kodyfire project'
              );
              return;
            }
          }
          const projectRoot =
            ((_e = vscode.workspace.workspaceFolders) === null || _e === void 0
              ? void 0
              : _e[0].uri.fsPath) || '/';
          yield InitAction_1.InitAction.execute({ rootDir: projectRoot });
          InitAction_1.InitAction.displayMessage(
            'Project initialized successfully'
          );
        } catch (error) {
          vscode.window.showErrorMessage(error.message);
          InstallAction_1.InstallAction.output.show();
          InstallAction_1.InstallAction.output.append(error.message);
        }
      })
    );
    context.subscriptions.push(initDisposable);
  });
}
exports.activate = activate;
function getConcepts() {
  var _a;
  return __awaiter(this, void 0, void 0, function* () {
    const projectRoot =
      ((_a = vscode.workspace.workspaceFolders) === null || _a === void 0
        ? void 0
        : _a[0].uri.fsPath) || '/';
    const installedKodies =
      yield kodyfire_core_1.Package.getInstalledKodiesFromPath(projectRoot);
    let concepts = [];
    for (let i = 0; i < installedKodies.length; i++) {
      const concept = yield InitAction_1.InitAction.getDependencyConcepts(
        installedKodies[i].name
      );
      concepts.push({ name: installedKodies[i].name, concepts: concept });
    }
    return concepts;
  });
}
// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
