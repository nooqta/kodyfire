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
const action_1 = require('./../init/action');
const prompts = require('prompts');
const boxen = require('boxen');
class Action {
  static onCancel(_prompt) {
    return __awaiter(this, void 0, void 0, function* () {
      this.isCanceled = true;
      return true;
    });
  }
  static getDependencyConcepts(dependency) {
    return __awaiter(this, void 0, void 0, function* () {
      const dep = yield action_1.Action.getDependencyConcepts(dependency);
      return dep === null || dep === void 0 ? void 0 : dep.concepts;
    });
  }
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
            const { kody } = yield prompts(kodyQuestion);
            this.kody = kody;
          }
          if (!this.concept) {
            // set concept
            const conceptQuestion = yield this.getConceptQuestion();
            if (!conceptQuestion) {
              this.displayMessage(
                'No concepts selected. Please select a concept to proceed.'
              );
              process.exit(1);
            }
            const { concept } = yield prompts(conceptQuestion);
            this.concept = concept;
          }
          if (!this.properties) {
            // set properties
            const currentConcept = yield this.getCurrentConcept();
            const answers = yield this.getPropertiesAnswers(currentConcept);
            if (answers) {
              // @todo validate answers
              this.addConcept(this.kody, this.concept, answers);
            }
          }
        }))();
    });
  }
  static getCurrentConcept() {
    return __awaiter(this, void 0, void 0, function* () {
      const concepts = yield this.getDependencyConcepts(this.kody);
      return concepts[this.concept];
    });
  }
  static getPropertiesAnswers(concept) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const schemaDefinition = this.getSchemaDefinition(this.kody);
      const conceptNames = Object.keys(concept || {});
      if (conceptNames.length == 0) {
        return [];
      }
      const answers = {};
      for (let i = 0; i < conceptNames.length; i++) {
        const currentConcept = concept[conceptNames[i]];
        if (
          currentConcept.type !== 'array' &&
          ((_a = currentConcept.items) === null || _a === void 0
            ? void 0
            : _a.type) !== 'object'
        ) {
          const question = yield this.conceptToQuestion(
            conceptNames[i],
            concept[conceptNames[i]],
            schemaDefinition,
            false,
            false,
            `${conceptNames[i]}`,
            true
          );
          if (typeof question.value != 'undefined') {
            answers[conceptNames[i]] = question.value;
          } else if (question) {
            const answer = yield prompts(question);
            answers[conceptNames[i]] = answer.value;
          }
        }
        if (
          currentConcept.type === 'array'
          // && currentConcept.items?.type === 'object'
        ) {
          const question = {
            type: 'confirm',
            name: 'value',
            message: `Would you like to add ${conceptNames[i]}?`,
            initial: true,
          };
          const { value } = yield prompts(question);
          if (value) {
            let addMore = true;
            while (addMore) {
              let childConcept;
              if (
                ((_b = currentConcept.items) === null || _b === void 0
                  ? void 0
                  : _b.type) !== 'string'
              ) {
                childConcept = yield this.getPropertiesAnswers(
                  currentConcept.items.properties
                );
              } else {
                const conceptQuestion = yield this.conceptToQuestion(
                  conceptNames[i],
                  currentConcept.items
                );
                const currentAnswer = yield prompts(conceptQuestion);
                childConcept = currentAnswer[conceptNames[i]];
              }
              if (answers[conceptNames[i]]) {
                answers[conceptNames[i]].push(childConcept);
              } else {
                answers[conceptNames[i]] = [childConcept];
              }
              const question = {
                type: 'confirm',
                name: 'value',
                message: `Would you like to add more ${conceptNames[i]}?`,
                initial: true,
              };
              const { value } = yield prompts(question);
              if (!value) {
                addMore = false;
              }
            }
          }
        }
      }
      return answers;
    });
  }
  static getConceptQuestion() {
    return __awaiter(this, void 0, void 0, function* () {
      const concepts = yield this.getDependencyConcepts(this.kody);
      const conceptNames = Object.keys(concepts || {});
      if (conceptNames.length == 0) {
        return false;
      }
      const question = {
        type: conceptNames.length < 4 ? 'select' : 'autocomplete',
        name: 'concept',
        message: `Select the concept you want to add?`,
        choices: conceptNames.map(concept => ({
          title: (0, kodyfire_core_1.capitalize)(concept),
          value: concept,
        })),
      };
      return question;
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
        choices: dependencies.map(dep => ({
          title: (0, kodyfire_core_1.capitalize)(dep.replace('-kodyfire', '')),
          value: dep,
        })),
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
  static getSchemaDefinition(dependency, rootDir = process.cwd()) {
    const path = (0, path_1.join)(
      rootDir,
      `kody-${dependency.replace('-kodyfire', '')}.json`
    );
    if (!zx_1.fs.existsSync(path)) {
      return false;
    }
    return JSON.parse(zx_1.fs.readFileSync(path, 'utf8'));
  }
  static conceptToQuestion(
    name,
    concept,
    _concepts = {},
    message = false,
    _useIndex = false,
    label = '',
    useValueAsName = false
  ) {
    return __awaiter(this, void 0, void 0, function* () {
      message = concept.description || message;
      label = label || name;
      if (typeof concept.enum !== 'undefined') {
        if (concept.enum.length == 1) return { value: concept.enum[0] }; // if only one option, return it as default answer
        const choices = concept.enum.map(c => ({ title: c, value: c }));
        return Object.assign(
          Object.assign(
            {
              type: choices.length < 5 ? 'select' : 'autocomplete',
              name: useValueAsName ? 'value' : name,
              message: message || `Select the value for ${label}?`,
            },
            concept.description && { description: concept.description }
          ),
          { choices: choices }
        );
      }
      if (concept.type === 'boolean') {
        return Object.assign(
          Object.assign(
            Object.assign(
              Object.assign(
                { type: 'toggle', name: useValueAsName ? 'value' : name },
                concept.default && { initial: concept.default }
              ),
              { initial: concept.default }
            ),
            concept.description && { description: concept.description }
          ),
          {
            message: message || `What is the value for ${label}?`,
            active: 'Yes',
            inactive: 'No',
          }
        );
      }
      if (concept.type === 'string') {
        return Object.assign(
          Object.assign(
            Object.assign(
              { type: 'text', name: useValueAsName ? 'value' : name },
              concept.default && { initial: concept.default }
            ),
            concept.description && { description: concept.description }
          ),
          { message: message || `What is the value for ${label}?` }
        );
      }
      if (concept.type === 'number') {
        return Object.assign(
          Object.assign(
            Object.assign(
              { type: 'number', name: useValueAsName ? 'value' : name },
              concept.default && { initial: concept.default }
            ),
            concept.description && { description: concept.description }
          ),
          { message: message || `What is the value for ${label}?` }
        );
      }
      if (concept.type === 'array') {
        if (concept.items.type == 'string') {
          return Object.assign(
            Object.assign(
              { type: 'text', name: useValueAsName ? 'value' : name },
              concept.description && { description: concept.description }
            ),
            { message: message || `What is the value for ${label}?` }
          );
        }
      }
      if (concept.type === 'boolean') {
        return Object.assign(
          Object.assign(
            Object.assign(
              Object.assign(
                { type: 'select', name: useValueAsName ? 'value' : name },
                concept.description && { description: concept.description }
              ),
              { message: message || `What is the value for ${label}?` }
            ),
            concept.default && { initial: concept.default }
          ),
          {
            choices: [
              { title: 'true', value: true },
              { title: 'false', value: false },
            ],
          }
        );
      }
      return false;
    });
  }
}
exports.Action = Action;
Action.isCanceled = false;
//# sourceMappingURL=action.js.map
