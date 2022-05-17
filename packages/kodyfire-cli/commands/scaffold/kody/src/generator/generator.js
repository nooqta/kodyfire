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
exports.Generator = void 0;
const core_1 = require('@angular-devkit/core');
const node_1 = require('@angular-devkit/core/node');
const schematics_1 = require('@angular-devkit/schematics');
const technology_1 = require('../technology');
class Generator {
  constructor(params) {
    this.technology = new technology_1.Technology(params);
    const _backend = new core_1.virtualFs.ScopedHost(
      new node_1.NodeJsSyncHost(),
      core_1.normalize(process.cwd())
    );
    this.tree = new schematics_1.HostTree(_backend);
  }
  generate(content) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      this.input = content;
      this.technology.input = content;
      // for every concept in concepts list
      for (const [key] of this.technology.concepts) {
        // do apropriate action
        this.tree = yield (_a = this.technology.concepts.get(key)) === null ||
        _a === void 0
          ? void 0
          : _a.generate(content);
      }
      // return result
      return this.tree;
    });
  }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map
