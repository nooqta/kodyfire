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
const path = require('path');
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
            'No dependencies found. Install kody dependencies first. Use `kody search` to find the dependencies.'
          );
          process.exit(1);
        }
        for (const dep of dependencies) {
          yield Action.createDefinitionFile(_args.rootDir, dep);
          // Add the dependency to the kody.json file
          kody.sources.push({
            name: dep.replace('-kodyfire', ''),
            filename: `kody-${dep.replace('-kodyfire', '')}.json`,
          });
          const data = JSON.stringify(kody, null, '\t');
          if (!fs.existsSync((0, path_1.join)(_args.rootDir, 'kody.json'))) {
            fs.writeFileSync(
              (0, path_1.join)(_args.rootDir, 'kody.json'),
              data
            );
          } else {
            const kodyJson = JSON.parse(
              fs.readFileSync((0, path_1.join)(_args.rootDir, 'kody.json'))
            );
            kodyJson.sources.push({
              name: dep.replace('-kodyfire', ''),
              filename: `kody-${dep.replace('-kodyfire', '')}.json`,
            });
            fs.writeFileSync(
              (0, path_1.join)(_args.rootDir, 'kody.json'),
              JSON.stringify(kodyJson, null, '\t')
            );
          }
        }
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
  static createDefinitionFile(rootDir, dep) {
    return __awaiter(this, void 0, void 0, function* () {
      const filename = (0, path_1.join)(
        rootDir,
        `kody-${dep.replace('-kodyfire', '')}.json`
      );
      // Create the file if it doesn't exist
      if (!fs.existsSync(filename)) {
        const entries = yield Action.getEntries(rootDir, dep);
        const kodyJson = JSON.stringify(entries, null, '\t');
        fs.writeFileSync(filename, kodyJson);
      } else {
        this.displayMessage(`${filename} already exists.`);
      }
    });
  }
  static getEntries(rootDirectory, dep) {
    return __awaiter(this, void 0, void 0, function* () {
      const entries = {};
      // get the deb package schema file
      // @todo: find a better way
      const { schema } = yield Promise.resolve().then(() =>
        __importStar(require(`${rootDirectory}/node_modules/${dep}`))
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
      return entries;
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
  static getNpmGlobalPrefix() {
    let globalPrefix = '';
    if (process.env.PREFIX) {
      globalPrefix = process.env.PREFIX;
    } else if (process.platform === 'win32') {
      // c:\node\node.exe --> prefix=c:\node\
      globalPrefix = path.dirname(process.execPath);
    } else {
      // /usr/local/bin/node --> prefix=/usr/local
      globalPrefix = path.dirname(path.dirname(process.argv[1]));
      // destdir only is respected on Unix
      if (process.env.DESTDIR) {
        globalPrefix = path.join(process.env.DESTDIR, globalPrefix);
      }
    }
    return globalPrefix;
  }
  static getDependencyConcepts(dependency, rootDir = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const entries = {};
        // get the deb package schema file
        let kodyPath = (0, path_1.join)(rootDir, 'node_modules', dependency);
        if (
          !fs.existsSync((0, path_1.join)(rootDir, 'node_modules', dependency))
        ) {
          this.displayMessage(
            `${dependency} does not exist. Install it first.`
          );
          process.exit(1);
          // @todo: try a globally installed kody
          kodyPath = (0, path_1.join)(
            this.getNpmGlobalPrefix(),
            'lib',
            'node_modules',
            dependency
          );
        }
        const { schema } = yield Promise.resolve().then(() =>
          __importStar(require(kodyPath))
        );
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
