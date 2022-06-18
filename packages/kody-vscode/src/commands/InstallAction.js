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
exports.InstallAction = void 0;
const vscode = __importStar(require('vscode'));
const action_1 = require('kodyfire-cli/commands/install/action');
class InstallAction extends action_1.Action {
  static displayMessage(message) {
    vscode.window.showInformationMessage(message);
  }
  static isWorkspaceFolderOpen() {
    return __awaiter(this, void 0, void 0, function* () {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        return false;
      }
      return true;
    });
  }
  static doesPackageJsonExist() {
    return __awaiter(this, void 0, void 0, function* () {
      const packageJson = yield vscode.workspace.findFiles('package.json');
      return packageJson.length > 0;
    });
  }
  static runCommand(project, name = null) {
    return __awaiter(this, void 0, void 0, function* () {
      if (name) {
        project.args = [...project.args, name];
      }
      if (!this.terminal) {
        this.terminal = vscode.window.createTerminal('Extension: kody');
      }
      this.terminal.show();
      // const cmd = `${project.command} ${project.args.join(' ')}`;
      this.terminal.sendText(
        `${project.command} ${project.args.join(' ').toString()}`
      );
    });
  }
  static prompter(questionsList = action_1.questions) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      let answers = {};
      for (let i = 0; i < questionsList.length; i++) {
        const question = questionsList[i];
        if (question.type === 'select' && question.choices) {
          let option = {
            placeHolder: question.message,
          };
          let choices =
            (_a = question.choices) === null || _a === void 0
              ? void 0
              : _a.map(choice => {
                  return {
                    label: choice.value.toString(),
                    description: choice.title,
                    target: choice.value,
                  };
                });
          const answer = yield this.showQuickPick(choices, option);
          if (answer) {
            answers[question.name] =
              answer === null || answer === void 0 ? void 0 : answer.target;
          }
        } else if (question.type === 'array') {
          answers[question.name] = [];
        } else {
          const answer = yield this.showInputBox(question);
          if (answer) {
            answers[question.name] = answer;
          }
        }
      }
      return answers;
    });
  }
  static showQuickPick(items, option) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield vscode.window.showQuickPick(items, option);
      return result;
    });
  }
  static showQuickPickAsString(items, option) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield vscode.window.showQuickPick(items, option);
      return result;
    });
  }
  static showInputBox(options) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield vscode.window.showInputBox({
        prompt: options.message,
        validateInput: _text => {
          return null;
          // return text !== '' ? null : 'Please enter a value';
          //return !(/^[A-Za-z\s]+$/.test(text)) ? 'Name not valid' : null;
        },
      });
      return result;
    });
  }
}
exports.InstallAction = InstallAction;
//# sourceMappingURL=InstallAction.js.map
