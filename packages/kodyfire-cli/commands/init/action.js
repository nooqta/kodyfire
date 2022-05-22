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
exports.Action = void 0;
const path_1 = require('path');
const zx_1 = require('zx');
const boxen = require('boxen');
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
      const packageJsonFile = yield zx_1.fs.readFile(
        (0, path_1.join)(_args.rootDir, 'package.json'),
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
      try {
        const kody = {
          project: name,
          rootDir: _args.rootDir,
          sources: [],
        };
        if (dependencies.length > 0) {
          for (const dep of dependencies) {
            const entries = {};
            kody.sources.push({
              name: dep.replace('-kodyfire', ''),
              filename: `kody-${dep.replace('-kodyfire', '')}.json`,
            });
            // get the deb package schema file
            const { schema } = yield Promise.resolve().then(() =>
              __importStar(require(`${dep}/src/parser/validator/schema`))
            );
            for (const prop of Object.keys(schema.properties)) {
              entries[prop] = [];
            }
            entries.project = 'my-project';
            entries.name = dep.replace('-kodyfire', '');
            entries.rootDir = _args.rootDir;
            const kodyJson = JSON.stringify(entries, null, '\t');
            zx_1.fs.writeFileSync(
              (0, path_1.join)(
                _args.rootDir,
                `kody-${dep.replace('-kodyfire', '')}.json`
              ),
              kodyJson
            );
          }
          const data = JSON.stringify(kody, null, '\t');
          zx_1.fs.writeFileSync(
            (0, path_1.join)(_args.rootDir, 'kody.json'),
            data
          );
        }
      } catch (error) {
        this.displayMessage(error.message);
      }
    });
  }
}
exports.Action = Action;
//# sourceMappingURL=action.js.map
