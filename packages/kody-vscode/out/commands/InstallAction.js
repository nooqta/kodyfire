'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.InstallAction = void 0;
const vscode = __importStar(require('vscode'));
const action_1 = require('kodyfire-cli/commands/install/action');
class InstallAction extends action_1.Action {
  static displayMessage(message) {
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
  static async runCommand(project, name = null) {
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
  static async prompter(questionsList = action_1.questions) {
    let answers = {};
    for (let i = 0; i < questionsList.length; i++) {
      const question = questionsList[i];
      if (question.type === 'select' && question.choices) {
        let option = {
          title: question.message,
        };
        let choices = question.choices?.map(choice => choice.title);
        const answer = await this.showQuickPick(choices, option);
        answers[question.name] = answer;
      } else if (question.type === 'array') {
        answers[question.name] = [];
      } else {
        const answer = await this.showInputBox(question);
        answers[question.name] = answer;
      }
    }
    return answers;
  }
  static async showQuickPick(items, option) {
    const result = await vscode.window.showQuickPick(items, option);
    return result;
  }
  static async showInputBox(options) {
    const result = await vscode.window.showInputBox({
      prompt: options.message,
      validateInput: text => {
        return text !== '' ? null : 'Please enter a value';
        //return !(/^[A-Za-z\s]+$/.test(text)) ? 'Project name not valid' : null;
      },
    });
    return result;
  }
}
exports.InstallAction = InstallAction;
//# sourceMappingURL=InstallAction.js.map
