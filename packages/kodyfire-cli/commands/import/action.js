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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Action = exports.supportedTypes = void 0;
const zx_1 = require('zx');
const action_1 = require('../list/action');
const action_2 = require('../generate/action');
const chalk_1 = __importDefault(require('chalk'));
const boxen = require('boxen');
exports.supportedTypes = [
  'json',
  'yaml',
  'plantuml',
  'api',
  'openai',
  'chatgpt',
  'puppeteer',
];
class Action {
  static displayMessage(message, color = 'yellow') {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: color,
        borderStyle: 'round',
      })
    );
  }
  static execute(_args) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { type, source, kody, concepts } = _args;
        // Check if kody is installed
        const kodies = yield action_1.Action.getInstalledKodies();
        // check if kody exists
        const currentKody = kodies.find(k => k.id === kody || k.name === kody);
        if (!currentKody) {
          this.displayMessage(
            `😞 The kody ${kody} is not installed.\nUse kody list to check your installed kodies`,
            'red'
          );
          process.exit(1);
        }
        // resolve the parser to be used for the source
        // @todo: every kody should provide the list of supported types
        // for now we check statically. An error will occur if the parser is not supported
        if (!['json', 'yaml', 'plantuml'].includes(type)) {
          if (exports.supportedTypes.includes(type)) {
            this.displayMessage(
              `${type} parser not implemented yet. Please use yaml or plantuml (class diagram) for now.`,
              'red'
            );
          } else {
            this.displayMessage(
              `Unsupported type ${type}. Supported types are ${exports.supportedTypes.join(
                ', '
              )}. Only json is implemented for now.`,
              'red'
            );
          }
          process.exit(1);
        }
        // we check if the file exists
        if (!zx_1.fs.existsSync(source)) {
          this.displayMessage('File not found', 'red');
          process.exit(1);
        }
        let imports = [];
        let yaml;
        // @todo: refactor. Every kody is responsible for parsing the source
        switch (type) {
          case 'yaml': {
            const { load } = require('js-yaml');
            // @ts-ignore
            yaml = load(zx_1.fs.readFileSync(source));
            imports = Object.keys(yaml.models).map(name =>
              Object.assign({ name }, yaml.models[name])
            );
            break;
          }
          case 'plantuml': {
            const { parse } = require('plantuml-parser');
            const plantuml = zx_1.fs
              .readFileSync(_args.source, 'utf8')
              .toString();
            const [uml] = parse(plantuml);
            // @ts-ignore
            imports = uml.elements.filter(e => e.constructor.name === 'Class');
            break;
          }
          case 'json': {
            const json = zx_1.fs.readFileSync(_args.source, 'utf8');
            // @ts-ignore
            imports = JSON.parse(json);
            break;
          }
        }
        // We loop through the _args.concepts list then the classes get the currentConcept based on the currentKody
        // and generate the concept
        concepts.forEach(conceptName =>
          __awaiter(this, void 0, void 0, function* () {
            imports.forEach(c =>
              __awaiter(this, void 0, void 0, function* () {
                const _concepts = yield action_2.Action.getDependencyConcepts(
                  currentKody.name
                );
                const currentConcept = _concepts[conceptName];
                const answers = yield action_2.Action.getPropertiesAnswers(
                  currentConcept,
                  {
                    name: c.name,
                  },
                  currentKody.name
                );
                answers.import = imports;
                answers.parser = type;
                answers.yaml = yaml;
                answers.currentImport = c;
                yield action_2.Action.generateConcept(
                  currentKody.name,
                  conceptName,
                  answers
                );
              })
            );
          })
        );
        this.displayMessage(
          chalk_1.default.green(
            `🙌 ${chalk_1.default.bold(source)} ${chalk_1.default.white(
              'imported successfully'
            )}`
          ),
          'green'
        );
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map
