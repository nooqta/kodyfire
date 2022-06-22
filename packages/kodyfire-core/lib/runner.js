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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Runner = void 0;
const __1 = require('..');
const jsonSchemaToObject_1 = __importDefault(
  require('../utils/jsonSchemaToObject')
);
const path_1 = require('path');
const fs_1 = __importDefault(require('fs'));
class Runner {
  constructor(options) {
    this.options = options;
    this.input = options.input;
  }
  run(_options) {
    return __awaiter(this, void 0, void 0, function* () {
      // get package name
      const { name } = _options;
      const currentKody = yield this.getKody(name);
      // stop processing if package not found
      if (typeof currentKody == 'undefined') {
        this.handleKodyNotFound(name);
      }
      // require package
      const m = yield Promise.resolve().then(() =>
        __importStar(require(currentKody.name))
      );
      const kody = new m.Kody(
        Object.assign(Object.assign({}, _options), currentKody)
      );
      kody.package = new __1.Package(kody);
      yield kody.package.registerPackages();
      // parse source
      const content = kody.read(this.input);
      const data = kody.parse(content);
      /// check if source is valid
      if (!data) {
        this.handleSourceNotValid(kody.errors);
      }
      // Pre-execute
      const updatedData = yield this.preExecute(
        currentKody.name,
        kody,
        kody.data
      );
      // generate artifacts | execute action
      const output = kody.generate(updatedData);
      // Post-execute
      yield this.postExecute(kody);
      this.handleKodySuccess();
      return output;
    });
  }
  postExecute(kody) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const recipes = kody.data.recipes;
        if (typeof recipes !== 'undefined') {
          for (const recipe of recipes) {
            const { schema: targetSchema } = yield Promise.resolve().then(() =>
              __importStar(
                require(`${recipe.kody}/src/parser/validator/schema`)
              )
            );
            const concept = (0, jsonSchemaToObject_1.default)(
              recipe.target,
              targetSchema.properties[recipe.target].items ||
                targetSchema.properties[recipe.target],
              recipe.mapping
            );
            console.log(concept);
            const target = this.getSchemaDefinition(recipe.kody);
            target[recipe.target].push(concept);
            const targetFilename = (0, path_1.join)(
              process.cwd(),
              `kody-${recipe.kody.replace('-kodyfire', '')}.json`
            );
            kody.write(targetFilename, target);
          }
        }
      } catch (error) {
        // @todo: handle error
        console.log(error);
      }
    });
  }
  getSchemaDefinition(dependency, rootDir = process.cwd()) {
    return JSON.parse(
      fs_1.default.readFileSync(
        (0, path_1.join)(
          rootDir,
          `kody-${dependency.replace('-kodyfire', '')}.json`
        ),
        'utf8'
      )
    );
  }
  preExecute(dependency, kody, data) {
    return __awaiter(this, void 0, void 0, function* () {
      for (const key in data) {
        for (const concept of data[key]) {
          if (typeof concept.domino !== 'undefined') {
            for (const related of concept.domino) {
              const relatedConcept = data[related].find(
                item => item[key] === concept.name
              );
              if (!relatedConcept) {
                // @todo: no need to pass relatedConcept to prepareConcept
                let relatedData = {};
                relatedData = yield kody.technology.prepareConcept(
                  dependency,
                  related,
                  relatedData
                );
                relatedData = Object.assign(Object.assign({}, relatedData), {
                  [key]: concept.name,
                });
                data[related].push(relatedData);
                // update kody.json file
                kody.write(this.input, data);
              }
            }
          }
        }
      }
      return data;
    });
  }
  handleKodyNotFound(name) {
    this.options.handleKodyNotFound(name);
  }
  getKody(name) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.options.getKody(name);
    });
  }
  handleSourceNotValid(errors) {
    this.options.handleSourceNotValid(errors);
  }
  handleKodySuccess() {
    this.options.handleKodySuccess();
  }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map
