'use strict';
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
exports.Action = void 0;
// import { $ } from "zx";
const kodyfire_core_1 = require('kodyfire-core');
const path_1 = require('path');
const zx_1 = require('zx');
const prompts = require('prompts');
const boxen = require('boxen');
const questions =
  // Does kody.json file exist
  // Are there any kodies installed
  // If no list kodies the user can install
  // If yes, list the kodies
  // Choose kody
  // If done selecting kodies, save the kody.json file
  // Ask the user if she/he wants to watch the build process
  // For every selected kody
  // Install project from scratch if applicable
  // Select destination
  //  Define concepts
  [
    {
      type: 'select',
      name: 'technology',
      message: `What are you building today?`,
      choices: [
        // Installed kodies list
        { title: 'A Backend using Laravel (php)', value: 'laravel' },
        { title: 'A frontend using Vuexy (vue)', value: 'vuexy' },
        { title: 'Both', value: ['laravel', 'vuexy'] },
      ],
    },
    {
      type: 'multiselect',
      name: 'color',
      message: 'Pick colors',
      choices: [
        { title: 'Red', value: '#ff0000' },
        { title: 'Green', value: '#00ff00' },
        { title: 'Blue', value: '#0000ff' },
      ],
    },
  ];
class Action {
  // @todo: refactor into a Base Action class. used by init/action.ts
  static getPackageDependencies(rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      const packageJsonFile = yield zx_1.fs.readFile(
        (0, path_1.join)(rootDir, 'package.json'),
        'utf8'
      );
      const packageJson = JSON.parse(packageJsonFile);
      const name = packageJson.name;
      let dependencies = [];
      if (
        packageJson.dependencies &&
        Object.keys(packageJson.dependencies).length > 0
      ) {
        dependencies = Object.keys(packageJson.dependencies);
      }
      if (
        packageJson.devDependencies &&
        Object.keys(packageJson.devDependencies).length > 0
      ) {
        dependencies = dependencies.concat(
          Object.keys(packageJson.devDependencies)
        );
      }
      dependencies = dependencies.filter(dep => dep.includes('-kodyfire'));
      return { name, dependencies };
    });
  }
  static prompter() {
    return __awaiter(this, void 0, void 0, function* () {
      (() =>
        __awaiter(this, void 0, void 0, function* () {
          if (!this.kody) {
            const kodyQuestion = yield this.getKodyQuestion();
            if (!kodyQuestion) {
              this.displayMessage(
                'No kodies installed. Please install at least a kody package first.'
              );
              process.exit(1);
            }
            this.kody = yield prompts(kodyQuestion);
          }
          const response = yield prompts(questions);
          console.log(response);
        }))();
    });
  }
  static getKodyQuestion() {
    return __awaiter(this, void 0, void 0, function* () {
      const { dependencies } = yield this.getPackageDependencies();
      if (dependencies.length == 0) {
        return false;
      }
      const question = {
        type: 'select',
        name: 'kody',
        message: `Select the kody package?`,
        choices: dependencies,
      };
      return question;
    });
  }
  static displayMessage(message) {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      })
    );
  }
  static execute() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield this.prompter();
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static addConcept(dependency, concept, data, rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let content = this.getSchemaDefinition(dependency, rootDir);
        if (content[concept]) {
          content[concept] = [...content[concept], data];
        } else {
          content[concept] = [data];
        }
        content = JSON.stringify(content, null, '\t');
        zx_1.fs.writeFileSync(
          (0, path_1.join)(
            rootDir,
            `kody-${dependency.replace('-kodyfire', '')}.json`
          ),
          content
        );
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static addConceptProperty(
    dependency,
    concept,
    property,
    data,
    rootDir = process.cwd()
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let content = this.getSchemaDefinition(dependency, rootDir);
        const currentConcept = data['concept'];
        // tweak the data for array for now
        delete data['concept'];
        data = data[property] ? data[property] : data;
        if (typeof content[concept][currentConcept][property] !== 'undefined') {
          content[concept][currentConcept][property] = [
            ...content[concept][currentConcept][property],
            data,
          ];
        } else {
          content[concept][currentConcept][property] = [data];
        }
        content = JSON.stringify(content, null, '\t');
        zx_1.fs.writeFileSync(
          (0, path_1.join)(
            rootDir,
            `kody-${dependency.replace('-kodyfire', '')}.json`
          ),
          content
        );
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static getSchemaDefinition(dependency, rootDir) {
    return JSON.parse(
      zx_1.fs.readFileSync(
        (0, path_1.join)(
          rootDir,
          `kody-${dependency.replace('-kodyfire', '')}.json`
        ),
        'utf8'
      )
    );
  }
  static conceptToQuestion(
    name,
    concept,
    concepts = {},
    message = false,
    useIndex = false
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      if (concepts[name] && typeof concepts[name] != 'string') {
        const choices = concepts[name].map((c, index) => ({
          title: c.name || `${(0, kodyfire_core_1.capitalize)(name)} ${index}`,
          value: useIndex ? index : c.name,
        }));
        return {
          type: 'select',
          name: name,
          message: message || `Select the value for ${name}?`,
          choices: choices,
        };
      }
      if (typeof concept.enum !== 'undefined') {
        return {
          type: 'select',
          name: name,
          message: message || `Select the value for ${name}?`,
          choices: concept.enum.map(c => ({ title: c, value: c })),
        };
      }
      if (concept.type === 'string') {
        return {
          type: 'text',
          name: name,
          message: message || `What is the value for ${name}?`,
        };
      }
      if (concept.type === 'array') {
        return {
          type: 'array',
          name: name,
          message: message || `What is the value for ${name}?`,
        };
      }
    });
  }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map
