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
exports.Action = exports.question = void 0;
const path_1 = require('path');
const fs = require('fs');
const prompts = require('prompts');
const boxen = require('boxen');
const question = name => ({
  type: 'text',
  name: 'value',
  message: `What is the destination folder for ${name}?`,
  initial: './',
});
exports.question = question;
class Action {
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
  static execute(_args = { rootDir: process.cwd() }) {
    return __awaiter(this, void 0, void 0, function* () {
      const { name, dependencies } = yield this.getPackageDependencies(
        _args.rootDir
      );
      try {
        const kody = {
          project: name,
          rootDir: _args.rootDir,
          sources: [],
        };
        if (dependencies.length == 0) {
          this.displayMessage(
            'No dependencies found. Install kody dependencies first. Use kody search to find the dependencies.'
          );
        }
        if (dependencies.length > 0) {
          for (const dep of dependencies) {
            const entries = {};
            kody.sources.push({
              name: dep.replace('-kodyfire', ''),
              filename: `kody-${dep.replace('-kodyfire', '')}.json`,
            });
            // get the deb package schema file
            // @todo: find a better way
            const { schema } = yield Promise.resolve().then(() =>
              __importStar(require(`${_args.rootDir}/node_modules/${dep}`))
            );
            for (const prop of Object.keys(schema.properties)) {
              entries[prop] = [];
            }
            const name = dep.replace('-kodyfire', '');
            entries.project = 'my-project';
            entries.name = name;
            const { value } = yield prompts((0, exports.question)(name));
            const rootDir = (0, path_1.join)(process.cwd(), value);
            entries.rootDir = rootDir;
            const kodyJson = JSON.stringify(entries, null, '\t');
            fs.writeFileSync(
              (0, path_1.join)(
                _args.rootDir,
                `kody-${dep.replace('-kodyfire', '')}.json`
              ),
              kodyJson
            );
          }
          const data = JSON.stringify(kody, null, '\t');
          fs.writeFileSync((0, path_1.join)(_args.rootDir, 'kody.json'), data);
        }
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static getPackageDependencies(rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      const packageJsonFile = fs.readFileSync(
        (0, path_1.join)(rootDir, 'package.json')
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
  static getDependencyConcepts(dependency, rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const entries = {};
        // get the deb package schema file
        const { schema } = yield Promise.resolve().then(() =>
          __importStar(require(`${rootDir}/node_modules/${dependency}`))
        );
        // console.log(schema.properties.umlClass.items.properties, dependency);
        console.log(`${rootDir}/node_modules/${dependency}`);
        for (const prop of Object.keys(schema.properties)) {
          const attributes = yield this.getConceptAttributes(
            schema.properties[prop]
          );
          if (attributes) {
            entries[prop] = attributes;
          }
        }
        return { name: dependency, concepts: entries };
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static getConceptAttributes(schema) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (Object.prototype.hasOwnProperty.call(schema, 'properties')) {
          return schema.properties;
        }
        if (Object.prototype.hasOwnProperty.call(schema, 'items')) {
          return yield this.getConceptAttributes(schema.items);
        }
      } catch (error) {
        this.displayMessage(error.message);
      }
      return false;
    });
  }
  static addConcept(dependency, concept, data, rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let content = JSON.parse(
          fs.readFileSync(
            (0, path_1.join)(
              rootDir,
              `kody-${dependency.replace('-kodyfire', '')}.json`
            ),
            'utf8'
          )
        );
        content[concept] = [...content[concept], data];
        content = JSON.stringify(content, null, '\t');
        fs.writeFileSync(
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
}
exports.Action = Action;
//# sourceMappingURL=action.js.map
